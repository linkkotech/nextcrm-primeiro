"use server";

import { authenticateWithCredentials, registerUser } from "@/services/auth.service";
import { loginSchema, signupSchema } from "@/schemas/auth.schemas";

export interface LoginActionResult {
  error?: string;
}

export interface SignupActionResult {
  error?: string;
  success?: boolean;
}

/**
 * Server Action para autenticação de usuário.
 * Valida os dados de entrada e chama o serviço de autenticação.
 * O redirecionamento é gerenciado pelo middleware após a criação da sessão.
 * 
 * @param data - Dados do formulário de login (email e password)
 * @returns Resultado da ação com possível erro
 */
export async function loginAction(data: unknown): Promise<LoginActionResult> {
  // Validação dos dados de entrada
  const validatedFields = loginSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Campos inválidos." };
  }

  const { email, password } = validatedFields.data;

  // A Server Action agora apenas orquestra a chamada para o serviço
  const result = await authenticateWithCredentials(email, password);

  if (!result.success) {
    return { error: result.message };
  }

  // O redirecionamento é gerenciado pelo middleware após o signIn criar a sessão
  // Não precisamos fazer redirect() manual aqui
  return {};
}

/**
 * Server Action para registro de novo usuário.
 * Valida os dados de entrada, cria o usuário e faz login automático.
 * O redirecionamento é gerenciado pelo middleware após a criação da sessão.
 * 
 * @param data - Dados do formulário de signup (name, email, password, confirmPassword)
 * @returns Resultado da ação com possível erro ou sucesso
 */
export async function signupAction(data: unknown): Promise<SignupActionResult> {
  // Validação dos dados de entrada
  const validatedFields = signupSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Campos inválidos." };
  }

  const { name, email, password } = validatedFields.data;

  // Criar o usuário
  const registerResult = await registerUser(name, email, password);

  if (!registerResult.success) {
    return { error: registerResult.message };
  }

  // Fazer login automático após o cadastro
  const loginResult = await authenticateWithCredentials(email, password);

  if (!loginResult.success) {
    return { 
      error: "Conta criada, mas houve um erro no login. Tente fazer login manualmente." 
    };
  }

  // Sucesso: usuário criado e logado
  return { success: true };
}

