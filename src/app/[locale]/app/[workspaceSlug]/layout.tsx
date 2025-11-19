import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import { validateWorkspaceMembership } from "@/lib/workspace-validation";
import { AppLayoutClient } from "@/components/application/AppLayoutClient";
import { HeaderProvider } from "@/context/HeaderContext";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    workspaceSlug: string;
  }>;
}

export const metadata: Metadata = {
  title: "NextCRM | Workspace",
};

/**
 * Layout raiz do Workspace (Multi-tenant)
 * Responsável por:
 * 1. Validar que o usuário tem acesso ao workspace
 * 2. Fornecer dados do workspace aos componentes filhos
 * 3. Estruturar o layout com sidebar e headers
 *
 * SEGURANÇA:
 * - Middleware já protege rotas /app/*
 * - Este layout valida acesso específico ao workspace
 * - Dados são isolados por workspaceId em toda a aplicação
 */
export default async function WorkspaceLayout({
  children,
  params,
}: WorkspaceLayoutProps) {
  // Resolver params (Next.js 15 pattern)
  const { workspaceSlug } = await params;

  // 1. Obter usuário autenticado
  let user = null;
  try {
    user = await getUser();
  } catch (error) {
    console.error("Error fetching user in workspace layout:", error);
    redirect("/sign-in");
  }

  // Garantir que user existe
  if (!user) {
    redirect("/sign-in");
  }

  // 2. Validar que usuário tem acesso ao workspace
  const validation = await validateWorkspaceMembership(user.id, workspaceSlug);

  // Se validação falhou, redirecionar
  if (!validation) {
    console.warn(
      `User ${user.id} tried to access workspace ${workspaceSlug} without permission`
    );
    redirect("/admin/dashboard");
  }

  const { workspace } = validation;

  return (
    <HeaderProvider>
      <AppLayoutClient
        workspaceSlug={workspaceSlug}
        workspaceName={workspace.name}
        userName={user.name}
        userEmail={user.email}
        userImage={user.image}
      >
        {children}
      </AppLayoutClient>
    </HeaderProvider>
  );
}
