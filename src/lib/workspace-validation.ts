import { prisma } from "@/lib/prisma";

/**
 * Valida se um usuário tem acesso a um workspace específico.
 * Verifica a existência do workspace e a membersão do usuário.
 *
 * IMPORTANTE: Esta função DEVE ser chamada em Server Components ou Server Actions
 * para validar acesso antes de renderizar conteúdo do workspace.
 *
 * @param userId - ID do usuário autenticado
 * @param workspaceSlug - Slug único do workspace (URL param)
 * @returns {Promise<{ workspace: Workspace, isMember: boolean } | null>}
 *   - Retorna objeto com workspace data e flag isMember se tudo válido
 *   - Retorna null se workspace não existe ou usuário não tem acesso
 *
 * @example
 * const result = await validateWorkspaceMembership(userId, 'my-workspace');
 * if (!result) {
 *   redirect('/admin/dashboard'); // Acesso negado
 * }
 * const { workspace, isMember } = result;
 */
export async function validateWorkspaceMembership(
  userId: string,
  workspaceSlug: string
) {
  try {
    // 1. Buscar workspace por slug
    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
      select: {
        id: true,
        name: true,
        slug: true,
        ownerId: true,
        createdAt: true,
      },
    });

    // Workspace não existe
    if (!workspace) {
      return null;
    }

    // 2. Verificar se usuário é membro do workspace
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId: workspace.id,
        },
      },
      select: {
        id: true,
        workspaceRoleId: true,
      },
    });

    // Usuário não é membro
    if (!membership) {
      return null;
    }

    // Sucesso: retornar workspace e confirmar que é membro
    return {
      workspace,
      isMember: true,
    };
  } catch (error) {
    console.error(
      `[validateWorkspaceMembership] Error validating access for user ${userId} to workspace ${workspaceSlug}:`,
      error
    );
    return null;
  }
}
