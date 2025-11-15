'use server';

import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/session';
import { ctaBlockContentSchema, type CTABlockContent } from '@/schemas/ctaBlock.schemas';
import { revalidatePath } from 'next/cache';

/**
 * Server Action to save/update CTA Block in a Digital Template
 * Stores CTA blocks in the template's content.dynamicBlocks array
 */
export async function saveCTABlock(
  templateId: string,
  blockId: string,
  ctaContent: unknown
) {
  try {
    // Step 1: Validate CTA content
    const validatedContent = ctaBlockContentSchema.parse(ctaContent);

    // Step 2: Get current user session
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Você precisa estar autenticado para editar templates.',
      };
    }

    // Step 3: Fetch template
    const template = await prisma.digitalTemplate.findUnique({
      where: { id: templateId },
      select: {
        id: true,
        workspaceId: true,
        content: true,
      },
    });

    if (!template) {
      return {
        success: false,
        error: 'Template não encontrado.',
      };
    }

    // Step 4: Verify permissions (same as heroBlock)
    const isAdminEditingGlobalTemplate =
      (session.user?.adminRole?.name === 'super_admin' || 
       session.user?.adminRole?.name === 'admin') &&
      template.workspaceId === null;

    if (isAdminEditingGlobalTemplate) {
      // Admin has permission
    } else if (template.workspaceId) {
      const workspaceMembership = await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: session.user.id,
            workspaceId: template.workspaceId,
          },
        },
      });

      if (!workspaceMembership) {
        return {
          success: false,
          error: 'Você não tem permissão para editar este template.',
        };
      }
    } else {
      return {
        success: false,
        error: 'Você não tem permissão para editar este template.',
      };
    }

    // Step 5: Update template content with CTA block
    const currentContent = template.content as any;
    const dynamicBlocks = currentContent.dynamicBlocks || [];

    // Find and update existing block, or add new one
    const existingBlockIndex = dynamicBlocks.findIndex(
      (block: any) => block.id === blockId
    );

    if (existingBlockIndex >= 0) {
      // Update existing block
      dynamicBlocks[existingBlockIndex] = {
        ...dynamicBlocks[existingBlockIndex],
        content: validatedContent,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Add new block
      dynamicBlocks.push({
        id: blockId,
        type: 'cta',
        content: validatedContent,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Step 6: Save to database
    await prisma.digitalTemplate.update({
      where: { id: templateId },
      data: {
        content: {
          ...currentContent,
          dynamicBlocks,
        },
        updatedAt: new Date(),
      },
    });

    // Step 7: Revalidate
    revalidatePath(`/admin/digital-templates/${templateId}`);
    revalidatePath('/admin/digital-templates');

    return {
      success: true,
      message: 'CTA salvo com sucesso!',
      data: { blockId, content: validatedContent },
    };
  } catch (error) {
    console.error('Error saving CTA block:', error);

    if (error instanceof Error) {
      return {
        success: false,
        error: `Erro ao salvar CTA: ${error.message}`,
      };
    }

    return {
      success: false,
      error: 'Erro desconhecido ao salvar CTA. Tente novamente.',
    };
  }
}

/**
 * Server Action to delete a CTA block from a Digital Template
 */
export async function deleteCTABlock(
  templateId: string,
  blockId: string
) {
  try {
    // Step 1: Get current user session
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Você precisa estar autenticado.',
      };
    }

    // Step 2: Fetch template
    const template = await prisma.digitalTemplate.findUnique({
      where: { id: templateId },
      select: {
        id: true,
        workspaceId: true,
        content: true,
      },
    });

    if (!template) {
      return {
        success: false,
        error: 'Template não encontrado.',
      };
    }

    // Step 3: Verify permissions
    const isAdminEditingGlobalTemplate =
      (session.user?.adminRole?.name === 'super_admin' || 
       session.user?.adminRole?.name === 'admin') &&
      template.workspaceId === null;

    if (!isAdminEditingGlobalTemplate && template.workspaceId) {
      const workspaceMembership = await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: session.user.id,
            workspaceId: template.workspaceId,
          },
        },
      });

      if (!workspaceMembership) {
        return {
          success: false,
          error: 'Você não tem permissão para editar este template.',
        };
      }
    }

    // Step 4: Remove block from dynamicBlocks array
    const currentContent = template.content as any;
    const dynamicBlocks = (currentContent.dynamicBlocks || []).filter(
      (block: any) => block.id !== blockId
    );

    // Step 5: Save updated content
    await prisma.digitalTemplate.update({
      where: { id: templateId },
      data: {
        content: {
          ...currentContent,
          dynamicBlocks,
        },
        updatedAt: new Date(),
      },
    });

    // Step 6: Revalidate
    revalidatePath(`/admin/digital-templates/${templateId}`);
    revalidatePath('/admin/digital-templates');

    return {
      success: true,
      message: 'CTA removido com sucesso!',
    };
  } catch (error) {
    console.error('Error deleting CTA block:', error);

    return {
      success: false,
      error: 'Erro ao remover CTA. Tente novamente.',
    };
  }
}
