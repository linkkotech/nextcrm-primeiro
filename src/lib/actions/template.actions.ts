"use server";

import { createTemplateSchema } from "@/schemas/template.schemas";
import { getAuthSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import type {
  CreateTemplateResult,
  DeleteTemplateResult,
  DuplicateTemplateResult,
} from "@/types/template";

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
 * @param workspaceId - Optional workspace ID for workspace-scoped templates
 * @returns {Promise<CreateTemplateResult>} Success with created template data or error message
 */
export async function createDigitalTemplateAction(
  data: unknown,
  workspaceId?: string
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

    // IMPORTANTE: Determinar workspaceId baseado no papel do usuário e contexto
    let finalWorkspaceId: string | null = null;

    const isPlatformAdmin = 
      user.adminRole?.name === "super_admin" || 
      user.adminRole?.name === "admin";

    if (isPlatformAdmin) {
      // Admins de plataforma criam templates globais (a menos que workspaceId seja fornecido)
      finalWorkspaceId = workspaceId || null;
    } else {
      // Workspace users devem criar templates com workspaceId obrigatório
      if (!workspaceId) {
        return { 
          error: "Workspace ID é obrigatório para usuários de workspace." 
        };
      }
      
      // Verificar se usuário pertence ao workspace
      const membership = user.workspaceMemberships?.find(
        m => m.workspace.id === workspaceId
      );
      
      if (!membership) {
        return { error: "Você não tem permissão para criar templates neste workspace." };
      }
      
      // Apenas work_admin pode criar templates
      if (membership.workspaceRole.name !== "work_admin") {
        return { error: "Apenas administradores do workspace podem criar templates." };
      }
      
      finalWorkspaceId = workspaceId;
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
        workspaceId: finalWorkspaceId,
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
    if (workspaceId) {
      revalidatePath(`/app/[workspaceSlug]/tools/smart-cards/templates`);
    }

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
 * Deletes a DigitalTemplate from the database with permission checks.
 * 
 * Authorization Rules:
 * - Platform admins (super_admin, admin) can delete any template
 * - Workspace admins (work_admin) can only delete templates from their workspace
 * - Regular users cannot delete templates
 * 
 * @param templateId - ID of the template to delete
 * @returns {Promise<DeleteTemplateResult>} Success or error message
 */
export async function deleteTemplateAction(
  templateId: string
): Promise<DeleteTemplateResult> {
  try {
    // 1. Autenticação
    const { user } = await getAuthSession();

    if (!user) {
      return { error: "Você precisa estar autenticado." };
    }

    // 2. Buscar template para verificar ownership
    const template = await prisma.digitalTemplate.findUnique({
      where: { id: templateId },
      select: { id: true, name: true, workspaceId: true },
    });

    if (!template) {
      return { error: "Template não encontrado." };
    }

    // 3. Verificar permissões
    const isPlatformAdmin =
      user.adminRole?.name === "super_admin" ||
      user.adminRole?.name === "admin";

    // REGRA DE SEGURANÇA: Templates globais (workspaceId: null) só podem ser deletados por platform admins
    if (template.workspaceId === null && !isPlatformAdmin) {
      return { error: "Permissão negada. Apenas administradores da plataforma podem remover templates globais." };
    }

    // REGRA DE SEGURANÇA: Templates de workspace só podem ser deletados por membros daquele workspace
    if (template.workspaceId !== null) {
      if (!isPlatformAdmin) {
        const membership = user.workspaceMemberships?.find(
          m => m.workspace.id === template.workspaceId
        );
        
        if (!membership) {
          return { error: "Permissão negada. Você não pertence a este workspace." };
        }
        
        if (membership.workspaceRole.name !== "work_admin") {
          return { error: "Permissão negada. Apenas administradores do workspace podem remover templates." };
        }
      }
    }

    // 4. Deletar
    await prisma.digitalTemplate.delete({
      where: { id: templateId },
    });

    // 5. Revalidar
    revalidatePath("/admin/digital-templates");
    revalidatePath(`/app/[workspaceSlug]/tools/smart-cards/templates`);

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
 * Duplicates an existing DigitalTemplate with permission checks.
 * Creates a copy with the same content, type, and description.
 * 
 * Authorization Rules:
 * - Platform admins can duplicate any template
 * - Workspace admins can only duplicate templates from their workspace
 * - Regular users cannot duplicate templates
 * 
 * @param originalTemplateId - ID of the template to duplicate
 * @returns {Promise<DuplicateTemplateResult>} Success with new template data or error
 */
export async function duplicateTemplateAction(
  originalTemplateId: string
): Promise<DuplicateTemplateResult> {
  try {
    // 1. Autenticação
    const { user } = await getAuthSession();

    if (!user) {
      return { error: "Você precisa estar autenticado." };
    }

    // 2. Buscar template original
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

    // 3. Verificar permissões
    const isPlatformAdmin =
      user.adminRole?.name === "super_admin" ||
      user.adminRole?.name === "admin";

    // REGRA DE SEGURANÇA: Templates globais só podem ser duplicados por platform admins
    if (originalTemplate.workspaceId === null && !isPlatformAdmin) {
      return { error: "Permissão negada. Apenas administradores da plataforma podem duplicar templates globais." };
    }

    // REGRA DE SEGURANÇA: Templates de workspace só podem ser duplicados por membros daquele workspace
    if (originalTemplate.workspaceId !== null) {
      if (!isPlatformAdmin) {
        const membership = user.workspaceMemberships?.find(
          m => m.workspace.id === originalTemplate.workspaceId
        );
        
        if (!membership) {
          return { error: "Permissão negada. Você não pertence a este workspace." };
        }
        
        if (membership.workspaceRole.name !== "work_admin") {
          return { error: "Permissão negada. Apenas administradores do workspace podem duplicar templates." };
        }
      }
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
    revalidatePath(`/app/[workspaceSlug]/tools/smart-cards/templates`);

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
