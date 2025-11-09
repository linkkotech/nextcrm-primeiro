import { createServerClient } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

/**
 * Busca a sessão atual do Supabase
 * @returns Sessão do Supabase ou null se não autenticado
 */
export async function getSession() {
  const supabase = await createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Busca o usuário autenticado do Supabase
 * @returns Usuário do Supabase ou null se não autenticado
 */
export async function getSupabaseUser(): Promise<User | null> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Busca o usuário completo (Supabase + Prisma)
 * @returns Dados do usuário do Prisma ou null se não autenticado
 */
export async function getUser() {
  const supabaseUser = await getSupabaseUser();
  
  if (!supabaseUser) {
    return null;
  }

  // Buscar dados adicionais do Prisma
  const user = await prisma.user.findUnique({
    where: { supabaseUserId: supabaseUser.id },
    include: {
      adminRole: true,
      workspacesOwned: true,
      workspaceMemberships: {
        include: {
          workspace: true,
          workspaceRole: true,
        },
      },
    },
  });

  return user;
}

/**
 * Verifica se o usuário está autenticado
 * @returns true se autenticado, false caso contrário
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session;
}

/**
 * Helper para proteger rotas
 * Redireciona para /sign-in se não autenticado
 * @returns Usuário autenticado
 */
export async function requireAuth() {
  const user = await getUser();
  
  if (!user) {
    redirect('/sign-in');
  }
  
  return user;
}

/**
 * Helper para verificar se usuário tem role de admin
 * @returns true se for admin, false caso contrário
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getUser();
  
  if (!user || !user.adminRole) {
    return false;
  }
  
  return ['super_admin', 'admin'].includes(user.adminRole.name);
}

/**
 * Helper para verificar se usuário é super admin
 * @returns true se for super_admin, false caso contrário
 */
export async function isSuperAdmin(): Promise<boolean> {
  const user = await getUser();
  
  if (!user || !user.adminRole) {
    return false;
  }
  
  return user.adminRole.name === 'super_admin';
}

