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
 * Creates a new Supabase account and persists the mirrored record in Prisma so application metadata stays in sync.
 *
 * @example
 * ```ts
 * const result = await registerUser(name, email, password)
 * ```
 *
 * @throws {Error} When Supabase client creation fails.
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

    // Criar registro User no Prisma
    const user = await prisma.user.create({
      data: {
        supabaseUserId: data.user.id,
        email: data.user.email!,
        name,
        emailVerified: data.user.email_confirmed_at
          ? new Date(data.user.email_confirmed_at)
          : null,
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
