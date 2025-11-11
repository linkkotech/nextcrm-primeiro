import { createServerClient } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { Session, User } from "@supabase/supabase-js";

/**
 * Fetches the current Supabase session so Server Components can reason about authentication state.
 *
 * @example
 * ```ts
 * const session = await getSession()
 * ```
 *
 * @returns {Promise<Session | null>} The active session when authenticated, otherwise `null`.
 */
export async function getSession(): Promise<Session | null> {
  const supabase = await createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Obtains the Supabase user payload to access metadata such as the auth identifier and email verification status.
 *
 * @example
 * ```ts
 * const user = await getSupabaseUser()
 * if (!user) throw new Error("Not authenticated")
 * ```
 *
 * @returns {Promise<User | null>} The Supabase Auth user when logged in, otherwise `null`.
 */
export async function getSupabaseUser(): Promise<User | null> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Combines Supabase identity with the enriched Prisma profile so downstream code can enforce workspace rules.
 *
 * @example
 * ```ts
 * const user = await getUser()
 * if (!user) return redirect('/sign-in')
 * ```
 *
 * @returns {Promise<Awaited<ReturnType<typeof prisma.user.findUnique>> | null>} A denormalised user record with memberships or `null` if unauthenticated.
 */
export async function getUser() {
  try {
    const supabaseUser = await getSupabaseUser();
    
    if (!supabaseUser) {
      return null;
    }

    // Buscar dados adicionais do Prisma
    // EDGE CASE: relações opcionais nulas quebram seleção ampla; por isso usamos select explícito e resiliente
    const user = await prisma.user.findUnique({
      where: { supabaseUserId: supabaseUser.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        adminRole: {
          select: {
            id: true,
            name: true,
          },
        },
        workspacesOwned: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        workspaceMemberships: {
          select: {
            id: true,
            workspace: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            workspaceRole: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return user;
  } catch (error) {
    console.error("Error in getUser():", error);
    // IMPORTANTE: devolver null mantém o fluxo sem expor detalhes sensíveis e evita falhas em Server Components
    return null;
  }
}

/**
 * Lightweight helper to determine if there is an active Supabase session.
 *
 * @example
 * ```ts
 * const canAccess = await isAuthenticated()
 * ```
 *
 * @returns {Promise<boolean>} `true` when a session exists, otherwise `false`.
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session;
}

/**
 * Guards server codepaths by redirecting unauthenticated users to the sign-in screen.
 *
 * @example
 * ```ts
 * const user = await requireAuth()
 * ```
 *
 * @throws {RedirectType} When no authenticated user is found, forcing navigation to `/sign-in`.
 * @returns {Promise<NonNullable<Awaited<ReturnType<typeof getUser>>>>} The hydrated Prisma user upon success.
 */
export async function requireAuth() {
  const user = await getUser();
  
  if (!user) {
    redirect('/sign-in');
  }
  
  return user;
}

/**
 * Determines if the authenticated user has platform-level administrative privileges.
 *
 * @example
 * ```ts
 * if (await isAdmin()) {
 *   // render admin dashboard widgets
 * }
 * ```
 *
 * @returns {Promise<boolean>} `true` when the user has `super_admin` or `admin` role; otherwise `false`.
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getUser();
  
  if (!user || !user.adminRole) {
    return false;
  }
  
  return ['super_admin', 'admin'].includes(user.adminRole.name);
}

/**
 * Checks if the authenticated user is the root `super_admin`, enabling tenant-wide maintenance flows.
 *
 * @example
 * ```ts
 * const isRoot = await isSuperAdmin()
 * ```
 *
 * @returns {Promise<boolean>} `true` when the admin role is `super_admin`, otherwise `false`.
 */
export async function isSuperAdmin(): Promise<boolean> {
  const user = await getUser();
  
  if (!user || !user.adminRole) {
    return false;
  }
  
  return user.adminRole.name === 'super_admin';
}

