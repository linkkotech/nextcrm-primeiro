"use server";

import { revalidatePath } from "next/cache";
import { getAuthSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  inviteMemberSchema,
  type InviteMemberInput,
  addTeamMemberSchema,
  type AddTeamMemberInput,
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

/**
 * Adiciona um novo membro ao workspace com opções de onboarding flexíveis.
 *
 * Fluxo de segurança e onboarding:
 * 1. Verifica autenticação e permissão work_admin do workspace
 * 2. Valida dados com schema Zod (incluindo validação condicional de senha)
 * 3. Verifica se email já existe no workspace
 * 4. FLUXO CONDICIONAL:
 *    - Se sendInvite === true: Envia convite por email (Supabase inviteUserByEmail)
 *    - Se sendInvite === false: Cria usuário diretamente com senha provisória
 * 5. Cria registro User no banco
 * 6. Cria WorkspaceMember vinculando ao workspace e role
 * 7. Se unitId fornecido: Cria UnitMember vinculando à unidade
 * 8. Rollback automático de Supabase em caso de falha
 * 9. Revalida página de team
 *
 * @param workspaceSlug - Slug do workspace onde o membro será adicionado
 * @param data - Dados do novo membro (nome, email, role, unidade, etc)
 * @returns Objeto com status, mensagem e erro opcional
 *
 * @example
 * ```ts
 * // Exemplo 1: Enviar convite por email
 * const result1 = await addTeamMember("acme-corp", {
 *   name: "João Silva",
 *   email: "joao@acme.com",
 *   workspaceRoleId: "role-id",
 *   unitId: "unit-id",
 *   isActive: true,
 *   sendInvite: true
 * });
 *
 * // Exemplo 2: Criar com senha provisória
 * const result2 = await addTeamMember("acme-corp", {
 *   name: "Maria Santos",
 *   email: "maria@acme.com",
 *   workspaceRoleId: "role-id",
 *   isActive: true,
 *   sendInvite: false,
 *   password: "SenhaProvisoria123"
 * });
 * ```
 */
export async function addTeamMember(
  workspaceSlug: string,
  data: AddTeamMemberInput
) {
  let supabaseUserId: string | null = null;

  try {
    // 1. Validar autenticação
    const session = await getAuthSession();
    if (!session || !session.user) {
      return {
        success: false,
        message: "Não autorizado",
        error: "Você precisa estar autenticado",
      };
    }

    // 2. Validar dados
    const validatedData = addTeamMemberSchema.parse(data);

    // 3. Buscar workspace
    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
      select: { 
        id: true, 
        name: true,
        organizationId: true,
      },
    });

    if (!workspace) {
      return {
        success: false,
        message: "Workspace não encontrado",
        error: "O workspace especificado não existe",
      };
    }

    // 4. Verificar se usuário é work_admin do workspace
    const membership = session.user.workspaceMemberships?.find(
      (m) => m.workspace.id === workspace.id
    );

    const isWorkAdmin = membership?.workspaceRole.name === "work_admin";

    if (!isWorkAdmin) {
      return {
        success: false,
        message: "Permissão negada",
        error: "Apenas administradores do workspace podem adicionar membros",
      };
    }

    // 5. Verificar se email já existe no workspace
    const existingMember = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId: workspace.id,
        user: {
          email: validatedData.email,
        },
      },
    });

    if (existingMember) {
      return {
        success: false,
        message: "Membro já existe",
        error: "Este email já está registrado neste workspace",
      };
    }

    // 6. Verificar se unidade pertence ao workspace (se fornecida)
    if (validatedData.unitId) {
      const unit = await prisma.unit.findFirst({
        where: {
          id: validatedData.unitId,
          workspaceId: workspace.id,
        },
      });

      if (!unit) {
        return {
          success: false,
          message: "Unidade inválida",
          error: "A unidade selecionada não pertence a este workspace",
        };
      }
    }

    // 7. FLUXO CONDICIONAL: Criar usuário na Supabase Auth
    if (validatedData.sendInvite) {
      // CENÁRIO A: Enviar convite por email
      const { data: inviteData, error: inviteError } =
        await supabaseAdmin.auth.admin.inviteUserByEmail(validatedData.email, {
          data: {
            name: validatedData.name,
          },
        });

      if (inviteError || !inviteData.user) {
        return {
          success: false,
          message: "Erro ao enviar convite",
          error: inviteError?.message || "Falha ao enviar convite por email",
        };
      }

      supabaseUserId = inviteData.user.id;
    } else {
      // CENÁRIO B: Criar usuário diretamente com senha provisória
      const { data: authData, error: authError } =
        await supabaseAdmin.auth.admin.createUser({
          email: validatedData.email,
          password: validatedData.password!,
          email_confirm: true,
          user_metadata: {
            name: validatedData.name,
          },
        });

      if (authError || !authData.user) {
        return {
          success: false,
          message: "Erro ao criar usuário",
          error: authError?.message || "Falha ao criar usuário no Supabase",
        };
      }

      supabaseUserId = authData.user.id;
    }

    // 8. Criar registros no banco de dados em transação
    try {
      await prisma.$transaction(async (tx) => {
        // 8.1. Criar User
        const newUser = await tx.user.create({
          data: {
            supabaseUserId: supabaseUserId!,
            name: validatedData.name,
            email: validatedData.email,
            cargo: validatedData.cargo,
            celular: validatedData.celular,
          },
        });

        // 8.2. Criar WorkspaceMember
        await tx.workspaceMember.create({
          data: {
            userId: newUser.id,
            workspaceId: workspace.id,
            workspaceRoleId: validatedData.workspaceRoleId,
          },
        });

        // 8.3. Criar UnitMember (se unitId fornecido)
        if (validatedData.unitId) {
          await tx.unitMember.create({
            data: {
              userId: newUser.id,
              unitId: validatedData.unitId,
            },
          });
        }
      });
    } catch (dbError) {
      // ROLLBACK: Deletar de Supabase se falhar no banco
      if (supabaseUserId) {
        await supabaseAdmin.auth.admin.deleteUser(supabaseUserId);
      }

      return {
        success: false,
        message: "Erro ao salvar dados",
        error:
          dbError instanceof Error
            ? dbError.message
            : "Falha ao registrar membro no banco",
      };
    }

    // 9. Revalidar página de team
    revalidatePath(`/app/${workspaceSlug}/team`);

    return {
      success: true,
      message: validatedData.sendInvite
        ? `Convite enviado para ${validatedData.email}`
        : `Membro ${validatedData.name} adicionado com sucesso!`,
    };
  } catch (error) {
    // Limpar Supabase em caso de erro inesperado
    if (supabaseUserId) {
      await supabaseAdmin.auth.admin.deleteUser(supabaseUserId);
    }

    console.error("Erro ao adicionar membro:", error);
    return {
      success: false,
      message: "Erro inesperado",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}
