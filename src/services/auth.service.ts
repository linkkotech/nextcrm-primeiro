import { createServerClient } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

export interface AuthResult {
  success: boolean;
  message: string;
  userId?: string;
}

/**
 * Autentica um usuário com credenciais (email e senha).
 * Usa o Supabase Auth para criar a sessão oficial do usuário.
 * 
 * @param email - Email do usuário
 * @param password - Senha do usuário
 * @returns Resultado da autenticação com sucesso e mensagem
 */
export async function authenticateWithCredentials(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const supabase = await createServerClient();

    // Autentica com Supabase Auth
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

    // Buscar ou criar registro User no Prisma
    let user = await prisma.user.findUnique({
      where: { supabaseUserId: data.user.id },
    });

    if (!user) {
      // Criar registro User se não existir
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
 * Registra um novo usuário no sistema.
 * Cria o usuário no Supabase Auth e no Prisma.
 * 
 * @param name - Nome do usuário
 * @param email - Email do usuário
 * @param password - Senha do usuário
 * @returns Resultado do registro com sucesso e mensagem
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
 * Faz logout do usuário atual
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
