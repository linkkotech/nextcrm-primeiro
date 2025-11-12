"use server";

import { createTemplateSchema } from "@/schemas/template.schemas";
import { getAuthSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface CreateTemplateResult {
  success?: boolean;
  data?: {
    id: string;
    name: string;
    description?: string | null;
    type: string;
  };
  error?: string;
}

/**
 * Creates a new DigitalTemplate as a Server Action with full validation and authorization checks.
 * Persists to database and revalidates the templates list page for instant UI updates.
 * 
 * Platform admins (super_admin, admin) create global templates.
 * Workspace users create workspace-specific templates (future implementation).
 *
 * @example
 * ```ts
 * const result = await createDigitalTemplateAction({
 *   templateName: "My Template",
 *   description: "Optional description",
 *   templateType: "profile_template"
 * })
 * if (result.error) toast.error(result.error)
 * ```
 *
 * @param data - Form data from the client (templateName, description, templateType)
 * @returns {Promise<CreateTemplateResult>} Success with created template data or error message
 */
export async function createDigitalTemplateAction(
  data: unknown
): Promise<CreateTemplateResult> {
  try {
    // IMPORTANTE: Obter sessão do usuário sem falhar se não houver workspace
    const { user } = await getAuthSession();

    if (!user) {
      return { error: "Você precisa estar autenticado para criar um template." };
    }

    // IMPORTANTE: Validar payload do cliente com schema Zod
    const validatedData = createTemplateSchema.safeParse(data);

    if (!validatedData.success) {
      const errors = validatedData.error.flatten().fieldErrors;
      const firstError = Object.values(errors)[0]?.[0];
      return { error: firstError || "Dados inválidos." };
    }

    const { templateName, description, templateType } = validatedData.data;

    // Criar o template com conteúdo inicial vazio
    // IMPORTANTE: DigitalTemplate não requer workspaceId - templates são globais por padrão
    // A associação com workspaces é feita através de WorkspaceTemplate (Many-to-Many)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newTemplate = await (prisma as any).digitalTemplate.create({
      data: {
        name: templateName,
        description: description || null,
        type: templateType,
        content: {
          theme: {},
          blocks: [],
        },
        createdByUserId: user.id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
      },
    });

    // IMPORTANTE: Revalidar a página de templates para atualizar a UI automaticamente
    revalidatePath("/admin/digital-templates");

    return {
      success: true,
      data: {
        ...newTemplate,
        type: newTemplate.type,
      },
    };
  } catch (error) {
    console.error("Error creating template:", error);

    // EDGE CASE: Capturar erros de banco de dados (constraints, etc.)
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "Erro ao criar o template. Tente novamente." };
  }
}
