import { signIn } from "@/app/api/auth/[...nextauth]/route";
import { AuthError } from "next-auth";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export interface AuthResult {
  success: boolean;
  message: string;
  userId?: string;
}

/**
 * Autentica um usuário com credenciais (email e senha).
 * Usa o NextAuth para criar a sessão oficial do usuário.
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
    // A lógica de negócio principal agora vive aqui
    // O signIn do NextAuth valida as credenciais e cria a sessão
    await signIn("credentials", { 
      email, 
      password, 
      redirect: false 
    });

    return { 
      success: true, 
      message: "Login bem-sucedido" 
    };
  } catch (error) {
    if (error instanceof AuthError) {
      // Tratar erros específicos do NextAuth
      switch (error.type) {
        case "CredentialsSignin":
          return { 
            success: false, 
            message: "Credenciais inválidas." 
          };
        default:
          return { 
            success: false, 
            message: "Erro ao autenticar. Tente novamente." 
          };
      }
    }
    
    // Tratar outros erros
    return { 
      success: false, 
      message: "Ocorreu um erro inesperado." 
    };
  }
}

/**
 * Registra um novo usuário no sistema.
 * Faz hash da senha e cria o usuário no banco de dados.
 * 
 * @param name - Nome do usuário
 * @param email - Email do usuário
 * @param password - Senha do usuário (será hasheada)
 * @returns Resultado do registro com sucesso e mensagem
 */
export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        message: "Este email já está cadastrado.",
      };
    }

    // Hash da senha
    const passwordHash = await hash(password, 12);

    // Criar usuário no banco
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
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

