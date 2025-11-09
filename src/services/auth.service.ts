import { signIn } from "next-auth";
import { AuthError } from "next-auth";

export interface AuthResult {
  success: boolean;
  message: string;
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

