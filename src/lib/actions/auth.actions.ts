"use server";

import { authenticateWithCredentials, registerUser, signOutUser } from "@/services/auth.service";
import { loginSchema, signupSchema } from "@/schemas/auth.schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

  // Chamar o serviço de autenticação
  const result = await authenticateWithCredentials(email, password);

  if (!result.success) {
    return { error: result.message };
  }

  // Revalidar cache e redirecionar
  revalidatePath('/', 'layout');
  redirect('/admin/dashboard');
}

/**
 * Server Action para registro de novo usuário.
 * Valida os dados de entrada, cria o usuário e faz login automático.
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

  // Criar o usuário (signUp do Supabase já faz login automático)
  const registerResult = await registerUser(name, email, password);

  if (!registerResult.success) {
    return { error: registerResult.message };
  }

  // Revalidar cache e redirecionar
  revalidatePath('/', 'layout');
  redirect('/admin/dashboard');
}

/**
 * Server Action para logout do usuário.
 */
export async function logoutAction() {
  const result = await signOutUser();
  
  if (!result.success) {
    return { error: result.message };
  }

  // Revalidar cache e redirecionar para login
  revalidatePath('/', 'layout');
  redirect('/sign-in');
}
