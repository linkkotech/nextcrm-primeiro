"use server";

import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/**
 * Schema de validação para deleção de usuário.
 * Garante que o ID do usuário a deletar seja uma string válida.
 */
const deleteUserSchema = z.object({
  userIdToDelete: z
    .string()
    .min(1, "ID do usuário é obrigatório")
    .cuid("ID de usuário inválido"),
});

interface DeleteUserResult {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Deleta um usuário utilizando soft delete (marca como deletado em vez de remover do banco).
 *
 * Proteções implementadas:
 * - Usuários super_admin NÃO podem ser deletados (cláusula de proteção)
 * - Apenas administradores podem deletar outros usuários
 * - O soft delete preserva todos os dados históricos para auditoria
 *
 * @param data - Objeto contendo userIdToDelete (ID do usuário a deletar)
 * @returns Objeto com status de sucesso/erro e mensagem descritiva
 *
 * @example
 * ```ts
 * const result = await deleteUser({ userIdToDelete: "clv123abc456" });
 * if (result.success) {
 *   console.log("Usuário deletado com sucesso");
 * } else {
 *   console.error(result.error);
 * }
 * ```
 *
 * @throws {Error} Quando há erro de banco de dados ou validação
 */
export async function deleteUser(data: unknown): Promise<DeleteUserResult> {
  try {
    // Validar entrada
    const validatedData = deleteUserSchema.parse(data);
    const { userIdToDelete } = validatedData;

    // Obter sessão do usuário que está deletando
    const authSession = await getAuthSession();

    // Verificar se usuário está autenticado
    if (!authSession?.user?.id) {
      return {
        success: false,
        message: "Operação não autorizada.",
        error: "UNAUTHORIZED",
      };
    }

    // Verificar se o usuário autenticado é admin
    const requestingUser = authSession.user;
    const isAdmin =
      requestingUser.adminRole?.name === "super_admin" ||
      requestingUser.adminRole?.name === "admin";

    if (!isAdmin) {
      return {
        success: false,
        message: "Você não tem permissão para deletar usuários.",
        error: "FORBIDDEN",
      };
    }

    // Impedir auto-deleção
    if (userIdToDelete === authSession.user.id) {
      return {
        success: false,
        message: "Você não pode deletar sua própria conta.",
        error: "SELF_DELETE_FORBIDDEN",
      };
    }

    // Buscar o usuário a ser deletado, incluindo sua adminRole
    const userToDelete = await prisma.user.findUnique({
      where: { id: userIdToDelete },
      select: {
        id: true,
        name: true,
        email: true,
        adminRole: {
          select: {
            name: true,
          },
        },
      },
    });

    // Verificar se usuário existe
    if (!userToDelete) {
      return {
        success: false,
        message: "Usuário não encontrado.",
        error: "USER_NOT_FOUND",
      };
    }

    // ===== CLÁUSULA DE PROTEÇÃO: SUPER_ADMIN NÃO PODE SER DELETADO =====
    if (userToDelete.adminRole?.name === "super_admin") {
      return {
        success: false,
        message:
          "Não é permitido deletar um super administrador. Entre em contato com o suporte.",
        error: "CANNOT_DELETE_SUPER_ADMIN",
      };
    }

    // Executar soft delete: marcar como deletado sem remover do banco
    await prisma.user.update({
      where: { id: userIdToDelete },
      data: {
        deletedAt: new Date(),
      },
    });

    // Revalidar a página de usuários para refletir a mudança na UI
    revalidatePath("/admin/users");

    return {
      success: true,
      message: `Usuário ${userToDelete.name || userToDelete.email} foi deletado com sucesso.`,
    };
  } catch (error) {
    console.error("[deleteUser] Erro:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Dados de entrada inválidos.",
        error: error.errors[0]?.message || "VALIDATION_ERROR",
      };
    }

    return {
      success: false,
      message: "Erro ao deletar usuário. Tente novamente.",
      error: "DATABASE_ERROR",
    };
  }
}

/**
 * Obtém a contagem de usuários não deletados (ativos) no sistema.
 *
 * Útil para exibir estatísticas de usuários ativos e é naturalmente
 * protegido pelo middleware de soft delete.
 *
 * @returns Número de usuários com deletedAt = null
 *
 * @example
 * ```ts
 * const activeUserCount = await getActiveUserCount();
 * console.log(`${activeUserCount} usuários ativos`);
 * ```
 */
export async function getActiveUserCount(): Promise<number> {
  try {
    const count = await prisma.user.count({
      where: {
        deletedAt: null, // Explicitamente garantir que estamos contando apenas ativos
      },
    });
    return count;
  } catch (error) {
    console.error("[getActiveUserCount] Erro:", error);
    return 0;
  }
}

/**
 * Restaura um usuário deletado (soft delete).
 *
 * Apenas super_admin pode restaurar usuários deletados.
 * Esta é uma operação administrativa rara.
 *
 * @param userIdToRestore - ID do usuário a restaurar
 * @returns Objeto com status de sucesso/erro
 *
 * @example
 * ```ts
 * const result = await restoreUser("clv123abc456");
 * ```
 */
export async function restoreUser(data: unknown): Promise<DeleteUserResult> {
  try {
    // Validar entrada
    const validatedData = deleteUserSchema.parse(data);
    const { userIdToDelete: userIdToRestore } = validatedData;

    // Obter sessão do usuário que está restaurando
    const authSession = await getAuthSession();

    if (!authSession?.user?.id) {
      return {
        success: false,
        message: "Operação não autorizada.",
        error: "UNAUTHORIZED",
      };
    }

    // Apenas super_admin pode restaurar
    const isSuperAdmin = authSession.user.adminRole?.name === "super_admin";

    if (!isSuperAdmin) {
      return {
        success: false,
        message: "Apenas super administradores podem restaurar usuários.",
        error: "FORBIDDEN",
      };
    }

    // Restaurar usuário (limpar deletedAt)
    const restoredUser = await prisma.user.update({
      where: { id: userIdToRestore },
      data: {
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    revalidatePath("/admin/users");

    return {
      success: true,
      message: `Usuário ${restoredUser.name || restoredUser.email} foi restaurado com sucesso.`,
    };
  } catch (error) {
    console.error("[restoreUser] Erro:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Dados de entrada inválidos.",
        error: error.errors[0]?.message || "VALIDATION_ERROR",
      };
    }

    return {
      success: false,
      message: "Erro ao restaurar usuário.",
      error: "DATABASE_ERROR",
    };
  }
}
