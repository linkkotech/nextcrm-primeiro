"use server";

import { revalidatePath } from "next/cache";
import { getAuthSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  inviteMemberSchema,
  type InviteMemberInput,
} from "@/schemas/team.schemas";

/**
 * Cria um novo membro administrativo da plataforma através de convite.
 *
 * Fluxo de segurança:
 * 1. Verifica autenticação e permissão super_admin
 * 2. Valida dados com schema Zod
 * 3. Cria usuário na Supabase Auth
 * 4. Cria registro no banco de dados
 * 5. Rollback automático se falhar (deleta de Supabase)
 * 6. Revalida página de team
 *
 * @param data - Dados do convite (email, adminRoleId, password)
 * @returns Objeto com status, mensagem e erro opcional
 *
 * @example
 * ```ts
 * const result = await inviteTeamMember({
 *   email: "newadmin@example.com",
 *   adminRoleId: "admin-role-id",
 *   password: "SecurePass123"
 * });
 *
 * if (result.success) {
 *   toast.success(result.message);
 * } else {
 *   toast.error(result.error);
 * }
 * ```
 *
 * @throws {Error} Se não autenticado ou sem permissão super_admin
 */
export async function inviteTeamMember(data: InviteMemberInput) {
  try {
    // 1. Validar autenticação e permissão
    const session = await getAuthSession();
    if (!session || !session.user) {
      return {
        success: false,
        message: "Não autorizado",
        error: "Você precisa estar autenticado",
      };
    }

    // Verificar se é super_admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { adminRole: true },
    });

    if (!user || user.adminRole?.name !== "super_admin") {
      return {
        success: false,
        message: "Permissão negada",
        error: "Apenas super_admin pode convidar membros",
      };
    }

    // 2. Validar dados
    const validatedData = inviteMemberSchema.parse(data);

    // 3. Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return {
        success: false,
        message: "Email já existe",
        error: "Este email já está registrado no sistema",
      };
    }

    // 4. Criar usuário na Supabase Auth
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: validatedData.email,
        password: validatedData.password,
        email_confirm: true,
      });

    if (authError || !authData.user) {
      return {
        success: false,
        message: "Erro ao criar usuário",
        error: authError?.message || "Falha na criação do usuário no Supabase",
      };
    }

    // 5. Criar registro no banco de dados
    try {
      await prisma.user.create({
        data: {
          id: authData.user.id,
          supabaseUserId: authData.user.id,
          name: validatedData.fullName,
          email: validatedData.email,
          adminRoleId: validatedData.adminRoleId,
        },
      });
    } catch (dbError) {
      // ROLLBACK: Deletar de Supabase se falhar no banco
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);

      return {
        success: false,
        message: "Erro ao salvar dados",
        error:
          dbError instanceof Error
            ? dbError.message
            : "Falha ao registrar usuário no banco",
      };
    }

    // 6. Revalidar página
    revalidatePath("/admin/team");

    return {
      success: true,
      message: `Membro ${validatedData.email} convidado com sucesso!`,
    };
  } catch (error) {
    console.error("Erro ao convidar membro:", error);
    return {
      success: false,
      message: "Erro inesperado",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}
