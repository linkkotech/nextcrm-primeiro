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
 * Handles credential-based authentication as a Next.js Server Action so the session cookies are issued on the server.
 *
 * @example
 * ```ts
 * const result = await loginAction({ email, password })
 * if (result?.error) toast.error(result.error)
 * ```
 *
 * @throws {RedirectType} When the credentials are valid and the user is redirected to the admin dashboard.
 * @returns {Promise<LoginActionResult>} A structured error payload when validation or authentication fails.
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
 * Provisions a Supabase session and corresponding Prisma user record for first-time signups.
 *
 * @example
 * ```ts
 * const result = await signupAction(formData)
 * if (result?.error) setFormError(result.error)
 * ```
 *
 * @throws {RedirectType} When the user is created successfully and redirected to the admin dashboard.
 * @returns {Promise<SignupActionResult>} Contains validation or provisioning errors when the flow cannot complete.
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
 * Invalidates the active Supabase session and clears cached layouts before redirecting to the sign-in screen.
 *
 * @example
 * ```ts
 * await logoutAction()
 * ```
 *
 * @throws {RedirectType} Always thrown after the session is invalidated to force navigation to `/sign-in`.
 * @returns {Promise<{ error: string } | void>} Contains an error payload only when Supabase rejects the logout call.
 */
export async function logoutAction(): Promise<{ error: string } | void> {
  const result = await signOutUser();
  
  if (!result.success) {
    return { error: result.message };
  }

  // Revalidar cache e redirecionar para login
  revalidatePath('/', 'layout');
  redirect('/sign-in');
}
