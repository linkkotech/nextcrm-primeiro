"use server";

import { authenticateWithCredentials } from "@/services/auth.service";
import { loginSchema } from "@/schemas/auth.schemas";

export interface LoginActionResult {
  error?: string;
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

