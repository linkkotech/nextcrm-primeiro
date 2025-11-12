"use server";

import { createTemplateSchema } from "@/schemas/template.schemas";
import { requireAuthWithWorkspace } from "@/lib/session";
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
 * @throws {RedirectType} When user is not authenticated (redirects to /sign-in)
 * @returns {Promise<CreateTemplateResult>} Success with created template data or error message
 */
export async function createDigitalTemplateAction(
  data: unknown
): Promise<CreateTemplateResult> {
  try {
    // IMPORTANTE: Validar autenticação e extrair contexto do usuário
    const { userId } = await requireAuthWithWorkspace();

    // IMPORTANTE: Validar payload do cliente com schema Zod
    const validatedData = createTemplateSchema.safeParse(data);

    if (!validatedData.success) {
      const errors = validatedData.error.flatten().fieldErrors;
      const firstError = Object.values(errors)[0]?.[0];
      return { error: firstError || "Dados inválidos." };
    }

    const { templateName, description, templateType } = validatedData.data;

    // Criar o template com conteúdo inicial vazio
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
        createdByUserId: userId,
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

    // EDGE CASE: Erros de autenticação são tratados por requireAuthWithWorkspace (redirect)
    // Este catch é para outros tipos de erro (ex: constraints do banco)
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "Erro ao criar o template. Tente novamente." };
  }
}
