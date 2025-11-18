import { createServerClient } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

export interface AuthResult {
  success: boolean;
  message: string;
  userId?: string;
}

/**
 * Performs the credential authentication handshake against Supabase and mirrors the user into Prisma on demand.
 *
 * @example
 * ```ts
 * const result = await authenticateWithCredentials(email, password)
 * if (!result.success) throw new Error(result.message)
 * ```
 *
 * @throws {Error} When Supabase client creation fails.
 * @returns {Promise<AuthResult>} Indicates success, error messaging, and the Prisma user identifier when available.
 */
export async function authenticateWithCredentials(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const supabase = await createServerClient();

    /**
     * Step 1: Authenticate com Supabase Auth
     * Supabase gerencia tokens JWT e refresh tokens
     * Não valida se user existe no Prisma ainda
     */
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        message: error.message === 'Invalid login credentials'
          ? "Credenciais inválidas."
          : "Erro ao autenticar. Tente novamente.",
      };
    }

    if (!data.user) {
      return {
        success: false,
        message: "Erro ao autenticar. Tente novamente.",
      };
    }

    /**
     * Step 2: Sync com Prisma User
     * Supabase é a source of truth para autenticação
     * Prisma é a source of truth para dados de aplicação
     * Mantém os dois em sync
     */
    let user = await prisma.user.findUnique({
      where: { supabaseUserId: data.user.id },
    });

    if (!user) {
      /**
       * Auto-provisioning: Criar User no Prisma se não existir
       * Permite que primeiro login automático crie registro
       * Alternativa: ter signup separado que cria ambos
       */
      user = await prisma.user.create({
        data: {
          supabaseUserId: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name,
          emailVerified: data.user.email_confirmed_at
            ? new Date(data.user.email_confirmed_at)
            : null,
        },
      });
    }

    return {
      success: true,
      message: "Login bem-sucedido",
      userId: user.id,
    };
  } catch (error) {
    console.error("Error authenticating user:", error);
    return {
      success: false,
      message: "Ocorreu um erro inesperado.",
    };
  }
}

/**
 * Creates a new Supabase account and persists the mirrored record in Prisma.
 * 
 * **Automatic Super_Admin Assignment:**
 * The first user created in the system is automatically assigned the super_admin role.
 * Subsequent users are created as regular users without administrative privileges.
 * This ensures that the initial admin user is established without manual intervention.
 * 
 * Plan selection is deferred to after account creation via the createWorkspace Server Action.
 * This allows users to create accounts without immediately choosing a plan.
 *
 * @example
 * ```ts
 * const result = await registerUser(name, email, password)
 * if (!result.success) throw new Error(result.message)
 * // First call: user.adminRoleId === superAdminRole.id
 * // Subsequent calls: user.adminRoleId === null
 * ```
 *
 * @throws {Error} When Supabase client creation fails or super_admin role is missing.
 * @returns {Promise<AuthResult>} Details whether the provisioning succeeded and exposes the Prisma user id on success.
 */
export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const supabase = await createServerClient();

    // Verificar se o email já existe no Prisma
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        message: "Este email já está cadastrado.",
      };
    }

    // Contar quantos usuários já existem no banco
    // IMPORTANTE: Se userCount === 0, o novo usuário será designado como super_admin
    const userCount = await prisma.user.count();

    // Buscar a AdminRole de super_admin (necessária para designação automática)
    const superAdminRole = await prisma.adminRole.findUnique({
      where: { name: "super_admin" },
    });

    // EDGE CASE: Se a seed não foi executada, a role não existe
    if (!superAdminRole) {
      return {
        success: false,
        message:
          "Erro de configuração: a role 'super_admin' não foi encontrada. Execute o seed do banco de dados.",
      };
    }

    // Criar usuário no Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      return {
        success: false,
        message: error.message || "Erro ao criar conta. Tente novamente.",
      };
    }

    if (!data.user) {
      return {
        success: false,
        message: "Erro ao criar conta. Tente novamente.",
      };
    }

    /**
     * Criar registro User no Prisma (espelhando Supabase Auth)
     * 
     * LÓGICA CONDICIONAL DE SUPER_ADMIN:
     * - Se userCount === 0: este é o primeiro usuário → adminRoleId = superAdminRole.id
     * - Se userCount > 0: usuários posteriores → adminRoleId = null (usuário normal)
     */
    const user = await prisma.user.create({
      data: {
        supabaseUserId: data.user.id,
        email: data.user.email!,
        name,
        emailVerified: data.user.email_confirmed_at
          ? new Date(data.user.email_confirmed_at)
          : null,
        // DESIGNAÇÃO AUTOMÁTICA: Primeiro usuário recebe super_admin
        adminRoleId: userCount === 0 ? superAdminRole.id : null,
      },
    });

    return {
      success: true,
      message: "Conta criada com sucesso!",
      userId: user.id,
    };
  } catch (error) {
    console.error("Error registering user:", error);
    return {
      success: false,
      message: "Erro ao criar conta. Tente novamente.",
    };
  }
}

/**
 * Signs the active user out of Supabase so the browser tokens can be revoked server-side.
 *
 * @example
 * ```ts
 * await signOutUser()
 * ```
 *
 * @throws {Error} When Supabase client creation fails.
 * @returns {Promise<AuthResult>} A success flag and contextual message for UI feedback.
 */
export async function signOutUser(): Promise<AuthResult> {
  try {
    const supabase = await createServerClient();
    
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        message: "Erro ao fazer logout.",
      };
    }

    return {
      success: true,
      message: "Logout realizado com sucesso.",
    };
  } catch (error) {
    console.error("Error signing out:", error);
    return {
      success: false,
      message: "Erro ao fazer logout.",
    };
  }
}
