"use server";

import { authenticateWithCredentials, registerUser, signOutUser } from "@/services/auth.service";
import { loginSchema, signupSchema } from "@/schemas/auth.schemas";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface LoginActionResult {
  error?: string;
  redirectTo?: string;
}

export interface SignupActionResult {
  error?: string;
  success?: boolean;
  redirectTo?: string;
}

/**
 * Handles credential-based authentication as a Next.js Server Action so the session cookies are issued on the server.
 * 
 * Implementa lógica de redirecionamento baseada em AdminRole:
 * - Se usuário tem AdminRole → retorna redirectTo: '/admin/dashboard'
 * - Se usuário é cliente → retorna redirectTo: '/app/select-workspace'
 *
 * @example
 * ```ts
 * const result = await loginAction({ email, password })
 * if (result?.error) toast.error(result.error)
 * else router.push(result.redirectTo)
 * ```
 *
 * @returns {Promise<LoginActionResult>} A structured result with error or redirectTo.
 */
export async function loginAction(data: unknown): Promise<LoginActionResult> {
  try {
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

    // Se autenticação foi bem-sucedida, result.userId está preenchido
    const userId = result.userId;
    if (!userId) {
      return { error: "Erro ao processar autenticação." };
    }

    // LÓGICA DE REDIRECIONAMENTO BASEADA EM ROLE
    // Buscar usuário com AdminRole
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { adminRole: true },
    });

    // Revalidar cache
    revalidatePath('/', 'layout');

    // Decidir destino baseado em AdminRole
    let redirectTo = '/app/select-workspace'; // Default para clientes
    if (user?.adminRole) {
      redirectTo = '/admin/dashboard'; // Para staff/admin
    }

    return { redirectTo };
  } catch (error) {
    console.error('[loginAction] Error:', error);
    return { error: "Erro ao processar login. Tente novamente." };
  }
}

/**
 * Provisions a Supabase session and mirrors the user into Prisma.
 * 
 * Implementa lógica de redirecionamento baseada em AdminRole:
 * - Se novo usuário tem AdminRole (raro) → retorna redirectTo: '/admin/dashboard'
 * - Se novo usuário é cliente (normal) → retorna redirectTo: '/app/select-workspace'
 *
 * @example
 * ```ts
 * const result = await signupAction({ name, email, password, confirmPassword })
 * if (result?.error) setFormError(result.error)
 * else router.push(result.redirectTo)
 * ```
 *
 * @returns {Promise<SignupActionResult>} Contains validation, provisioning errors, or redirectTo.
 */
export async function signupAction(data: unknown): Promise<SignupActionResult> {
  try {
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

    // Se registro foi bem-sucedido, registerResult.userId está preenchido
    const userId = registerResult.userId;
    if (!userId) {
      return { error: "Erro ao processar registro." };
    }

    // LÓGICA DE REDIRECIONAMENTO BASEADA EM ROLE
    // Buscar usuário com AdminRole
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { adminRole: true },
    });

    // Revalidar cache
    revalidatePath('/', 'layout');

    // Decidir destino baseado em AdminRole
    let redirectTo = '/app/select-workspace'; // Default para clientes
    if (user?.adminRole) {
      redirectTo = '/admin/dashboard'; // Para staff/admin (raro)
    }

    return { success: true, redirectTo };
  } catch (error) {
    console.error('[signupAction] Error:', error);
    return { error: "Erro ao processar registro. Tente novamente." };
  }
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
