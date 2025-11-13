'use server';

import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/session';
import { heroBlockSchema, type HeroBlockContent } from '@/schemas/heroBlock.schemas';
import { revalidatePath } from 'next/cache';

/**
 * Server Action to update Hero Block content in a Digital Template
 *
 * @param templateId - The ID of the DigitalTemplate to update
 * @param newContent - The new Hero Block content object (will be validated)
 *
 * @returns Object with success status, data, or error message
 *
 * @throws Returns error object if validation fails, user not authenticated,
 * or user lacks permission to edit the template
 *
 * @example
 * ```ts
 * const result = await updateHeroBlockContent(templateId, {
 *   content: { userName: "John", userInfo: "Developer", ... }
 * });
 * ```
 */
export async function updateHeroBlockContent(
  templateId: string,
  newContent: unknown
) {
  try {
    // Step 1: Validate input data with Zod schema
    let validatedData: HeroBlockContent;
    try {
      validatedData = heroBlockSchema.parse({ content: newContent }).content;
    } catch (validationError) {
      return {
        success: false,
        error: 'Dados inválidos. Verifique os campos do formulário.',
        details: validationError,
      };
    }

    // Step 2: Get current user session
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Você precisa estar autenticado para editar templates.',
      };
    }

    // Step 3: Fetch template and check if it exists
    const template = await prisma.digitalTemplate.findUnique({
      where: { id: templateId },
      select: {
        id: true,
        workspaceId: true,
      },
    });

    if (!template) {
      return {
        success: false,
        error: 'Template não encontrado.',
      };
    }

    // Step 4: IMPORTANT - Verify permissions based on user role and template type
    // This prevents data leakage across tenants
    
    // Check if admin is editing a global template (workspaceId is null)
    const isAdminEditingGlobalTemplate =
      (session.user?.adminRole?.name === 'super_admin' || 
       session.user?.adminRole?.name === 'admin') &&
      template.workspaceId === null;

    if (isAdminEditingGlobalTemplate) {
      // Admin has permission to edit global templates - proceed to update
    } else if (template.workspaceId) {
      // It's a workspace template - verify user belongs to the workspace
      const workspaceMembership = await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: session.user.id,
            workspaceId: template.workspaceId,
          },
        },
        select: {
          workspaceRoleId: true,
        },
      });

      if (!workspaceMembership) {
        return {
          success: false,
          error: 'Você não tem permissão para editar este template.',
        };
      }
    } else {
      // Edge case: non-admin user trying to edit a global template
      return {
        success: false,
        error: 'Você não tem permissão para editar este template.',
      };
    }

    // Step 5: Update the template with validated content
    const updatedTemplate = await prisma.digitalTemplate.update({
      where: { id: templateId },
      data: {
        content: validatedData,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        content: true,
      },
    });

    // Step 6: Revalidate the template editor page to reflect changes
    revalidatePath(`/app/[workspaceSlug]/digital-templates/[templateId]`);
    revalidatePath(`/app/[workspaceSlug]/digital-templates`);

    return {
      success: true,
      data: updatedTemplate,
      message: 'Hero Section atualizada com sucesso!',
    };
  } catch (error) {
    console.error('Error updating hero block content:', error);

    if (error instanceof Error) {
      return {
        success: false,
        error: `Erro ao atualizar: ${error.message}`,
      };
    }

    return {
      success: false,
      error: 'Erro desconhecido ao atualizar Hero Section. Tente novamente.',
    };
  }
}
