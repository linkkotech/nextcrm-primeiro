"use server";

import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getAuthSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/**
 * Schema de validação para criação de workspace.
 * Inclui dados do workspace, administrador e plano de assinatura.
 */
const createWorkspaceSchema = z.object({
  workspaceName: z
    .string()
    .min(1, "Nome do workspace é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres"),
  clientType: z.enum(["pf", "pj"], {
    errorMap: () => ({ message: "Selecione um tipo de cliente" }),
  }),
  document: z.string().min(1, "Documento é obrigatório"),
  adminName: z
    .string()
    .min(1, "Nome completo é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres"),
  adminEmail: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
  planId: z.string().min(1, "A seleção de um plano é obrigatória."),
});

type CreateWorkspaceFormData = z.infer<typeof createWorkspaceSchema>;

interface CreateWorkspaceResult {
  success: boolean;
  message: string;
  workspaceId?: string;
  subscriptionId?: string;
  error?: string;
}

/**
 * Cria um novo cliente (usuário + workspace + assinatura) em uma transação atômica.
 *
 * Fluxo de 5 passos:
 * 1. Criar usuário no Supabase Auth
 * 2. Criar usuário na tabela User local (com supabase_user_id)
 * 3. Criar o Workspace (com ownerId do novo usuário)
 * 4. Criar a WorkspaceSubscription (vinculando ao plano)
 * 5. Criar WorkspaceMember (vinculando usuário ao workspace com role work_admin)
 *
 * Se qualquer passo falhar:
 * - A transação Prisma é automaticamente revertida
 * - O usuário criado no Supabase Auth é deletado manualmente
 * - Um erro detalhado é retornado
 *
 * @param data - Dados validados do formulário
 * @returns Resultado com status e IDs dos recursos criados
 *
 * @example
 * ```ts
 * const result = await createWorkspace({
 *   workspaceName: "Acme Corp",
 *   clientType: "pj",
 *   document: "12.345.678/0001-00",
 *   adminName: "João Silva",
 *   adminEmail: "joao@acme.com",
 *   password: "SecurePassword123",
 *   planId: "clv123abc456"
 * });
 * ```
 */
export async function createWorkspace(
  data: unknown
): Promise<CreateWorkspaceResult> {
  let supabaseUserId: string | null = null;

  try {
    // Obter usuário autenticado (super_admin que está criando o cliente)
    const authSession = await getAuthSession();
    
    if (!authSession?.user?.id) {
      return {
        success: false,
        message: "Usuário não autenticado.",
        error: "UNAUTHORIZED",
      };
    }

    // Validar dados com o Zod schema
    const validatedData = createWorkspaceSchema.parse(data);

    // Verificar se o plano existe
    const planExists = await prisma.plan.findUnique({
      where: { id: validatedData.planId },
    });

    if (!planExists) {
      return {
        success: false,
        message: "O plano selecionado não é válido.",
        error: "PLAN_NOT_FOUND",
      };
    }

    // Buscar a WorkspaceRole 'work_admin' para usar depois
    const workAdminRole = await prisma.workspaceRole.findUnique({
      where: { name: "work_admin" },
    });

    if (!workAdminRole) {
      return {
        success: false,
        message: "Configuração interna incompleta.",
        error: "ROLE_NOT_FOUND",
      };
    }

    /**
     * PASSO 1: Criar usuário no Supabase Auth
     * Executado FORA da transação porque é uma operação externa
     */
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: validatedData.adminEmail,
        password: validatedData.password,
        email_confirm: true,
      });

    if (authError || !authData.user) {
      return {
        success: false,
        message: "Erro ao criar usuário no sistema de autenticação.",
        error: authError?.message || "Falha desconhecida no Auth",
      };
    }

    supabaseUserId = authData.user.id;

    /**
     * TRANSAÇÃO ATÔMICA: 4 operações restantes
     * Passos 2-5: User local + Workspace + Subscription + WorkspaceMember
     * Se qualquer uma falhar, todas são revertidas
     */
    const result = await prisma.$transaction(async (tx) => {
      /**
       * PASSO 2: Criar usuário na tabela User local
       */
      const newUser = await tx.user.create({
        data: {
          id: supabaseUserId!,
          supabaseUserId: supabaseUserId!,
          email: validatedData.adminEmail,
          name: validatedData.adminName,
        },
      });

      /**
       * PASSO 3: Criar o Workspace
       * ownerId usa o ID do usuário que acabamos de criar
       */
      const newWorkspace = await tx.workspace.create({
        data: {
          name: validatedData.workspaceName,
          slug: `${validatedData.workspaceName
            .toLowerCase()
            .replace(/\s+/g, "-")}-${Date.now()}`,
          ownerId: newUser.id,
        },
      });

      /**
       * PASSO 4: Criar a WorkspaceSubscription
       * Vincula o workspace ao plano selecionado
       */
      const newSubscription = await tx.workspaceSubscription.create({
        data: {
          workspaceId: newWorkspace.id,
          planId: validatedData.planId,
          status: "Active",
        },
      });

      /**
       * PASSO 5: Criar WorkspaceMember
       * Vincula o novo usuário ao novo workspace como work_admin
       */
      const workspaceMember = await tx.workspaceMember.create({
        data: {
          userId: newUser.id,
          workspaceId: newWorkspace.id,
          workspaceRoleId: workAdminRole.id,
        },
      });

      return {
        user: newUser,
        workspace: newWorkspace,
        subscription: newSubscription,
        workspaceMember: workspaceMember,
      };
    });

    // Revalidar páginas para refletir as mudanças
    revalidatePath("/admin/clients");

    return {
      success: true,
      message: "Cliente criado com sucesso!",
      workspaceId: result.workspace.id,
      subscriptionId: result.subscription.id,
    };
  } catch (error) {
    console.error("Erro ao criar workspace:", error);

    // Se a transação falhou e já criamos usuário no Auth, deletar (rollback manual)
    if (supabaseUserId) {
      try {
        await supabaseAdmin.auth.admin.deleteUser(supabaseUserId);
        console.log(`[ROLLBACK] Usuário ${supabaseUserId} deletado do Auth`);
      } catch (deleteError) {
        console.error(
          `[ROLLBACK FALHOU] Não foi possível deletar usuário ${supabaseUserId}:`,
          deleteError
        );
        // Continuar mesmo se o rollback falhar, mas registrar o erro
      }
    }

    // Diferenciar entre erro de validação Zod e erros de banco de dados
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Dados inválidos.",
        error: error.errors[0]?.message || "Erro de validação",
      };
    }

    return {
      success: false,
      message: "Erro ao criar cliente. Tente novamente.",
      error: error instanceof Error ? error.message : "UNKNOWN_ERROR",
    };
  }
}
