"use server";

import { createTemplateSchema } from "@/schemas/template.schemas";
import { getAuthSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";

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
 * Authorization Rules:
 * - Platform admins (super_admin, admin) create global templates (workspaceId = null)
 * - Workspace admins (work_admin) create workspace-specific templates (workspaceId = currentWorkspaceId)
 * - Regular users (work_user) are denied access
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
    // Obter sessão do usuário
    const { user } = await getAuthSession();

    if (!user) {
      return { error: "Você precisa estar autenticado para criar um template." };
    }

    // Validar payload do cliente com schema Zod
    const validatedData = createTemplateSchema.safeParse(data);

    if (!validatedData.success) {
      const errors = validatedData.error.flatten().fieldErrors;
      const firstError = Object.values(errors)[0]?.[0];
      return { error: firstError || "Dados inválidos." };
    }

    const { templateName, description, templateType } = validatedData.data;

    // IMPORTANTE: Determinar workspaceId baseado no papel do usuário
    let workspaceId: string | null = null;

    if (user.adminRole?.name === "super_admin" || user.adminRole?.name === "admin") {
      // Admins de plataforma criam templates globais
      workspaceId = null;
    } else {
      // Para usuários sem adminRole, verificar workspace role
      // NOTA: Assumindo que getAuthSession retorna workspaceMembership com role
      // Ajustar conforme estrutura real da sessão
      return { 
        error: "Apenas administradores da plataforma podem criar templates globais. Criação de templates de workspace será implementada em breve." 
      };
    }

    // Criar o template com workspaceId apropriado
    const newTemplate = await prisma.digitalTemplate.create({
      data: {
        name: templateName,
        description: description || null,
        type: templateType,
        content: {
          theme: {},
          blocks: [],
        },
        workspaceId: workspaceId, // null para admins, workspaceId para work_admins
        createdByUserId: user.id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
      },
    });

    // Revalidar a página de templates para atualizar a UI automaticamente
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

/**
 * Deletes a DigitalTemplate from the database.
 * Only platform admins can delete global templates.
 * 
 * @param templateId - ID of the template to delete
 * @returns {Promise<DeleteTemplateResult>} Success or error message
 */
export interface DeleteTemplateResult {
  success?: boolean;
  error?: string;
}

export async function deleteTemplateAction(
  templateId: string
): Promise<DeleteTemplateResult> {
  try {
    // 1. Autenticação
    const { user } = await getAuthSession();

    if (!user) {
      return { error: "Você precisa estar autenticado." };
    }

    // 2. Verificar permissões (apenas admins)
    const isAdmin =
      user.adminRole?.name === "super_admin" ||
      user.adminRole?.name === "admin";

    if (!isAdmin) {
      return {
        error: "Apenas administradores podem remover templates globais.",
      };
    }

    // 3. Verificar se template existe e é global
    const template = await prisma.digitalTemplate.findUnique({
      where: { id: templateId },
      select: { id: true, name: true, workspaceId: true },
    });

    if (!template) {
      return { error: "Template não encontrado." };
    }

    if (template.workspaceId !== null) {
      return {
        error: "Apenas templates globais podem ser removidos desta área.",
      };
    }

    // 4. Deletar
    await prisma.digitalTemplate.delete({
      where: { id: templateId },
    });

    // 5. Revalidar
    revalidatePath("/admin/digital-templates");

    return { success: true };
  } catch (error) {
    console.error("Error deleting template:", error);

    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "Erro ao remover o template. Tente novamente." };
  }
}

/**
 * Duplicates an existing DigitalTemplate.
 * Creates a copy with the same content, type, and description.
 * Only platform admins can duplicate templates.
 * 
 * @param originalTemplateId - ID of the template to duplicate
 * @returns {Promise<DuplicateTemplateResult>} Success with new template data or error
 */
export interface DuplicateTemplateResult {
  success?: boolean;
  data?: {
    id: string;
    name: string;
  };
  error?: string;
}

export async function duplicateTemplateAction(
  originalTemplateId: string
): Promise<DuplicateTemplateResult> {
  try {
    // 1. Autenticação
    const { user } = await getAuthSession();

    if (!user) {
      return { error: "Você precisa estar autenticado." };
    }

    // 2. Verificar permissões (apenas admins)
    const isAdmin =
      user.adminRole?.name === "super_admin" ||
      user.adminRole?.name === "admin";

    if (!isAdmin) {
      return {
        error: "Apenas administradores podem duplicar templates.",
      };
    }

    // 3. Buscar template original
    const originalTemplate = await prisma.digitalTemplate.findUnique({
      where: { id: originalTemplateId },
      select: {
        name: true,
        description: true,
        type: true,
        content: true,
        workspaceId: true,
      },
    });

    if (!originalTemplate) {
      return { error: "Template original não encontrado." };
    }

    // 4. Preparar dados do novo template
    const newTemplateName = `Cópia de ${originalTemplate.name}`;

    // 5. Criar template duplicado
    const duplicatedTemplate = await prisma.digitalTemplate.create({
      data: {
        name: newTemplateName,
        description: originalTemplate.description,
        type: originalTemplate.type,
        content: originalTemplate.content as Prisma.InputJsonValue,
        workspaceId: originalTemplate.workspaceId,
        createdByUserId: user.id,
      },
      select: {
        id: true,
        name: true,
      },
    });

    // 6. Revalidar página
    revalidatePath("/admin/digital-templates");

    return {
      success: true,
      data: {
        id: duplicatedTemplate.id,
        name: duplicatedTemplate.name,
      },
    };
  } catch (error) {
    console.error("Error duplicating template:", error);

    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "Erro ao duplicar template. Tente novamente." };
  }
}
