import { getTranslations } from "next-intl/server";
import { getUser } from "@/lib/session";
import { validateWorkspaceMembership } from "@/lib/workspace-validation";
import { DashboardClient } from "./dashboard-client";

interface DashboardPageProps {
  params: Promise<{ workspaceSlug: string; locale: string }>;
}

/**
 * Dashboard Page - Server Component
 * 
 * Responsabilidades:
 * - Validar autenticação do usuário
 * - Buscar dados do workspace do banco de dados
 * - Carregar traduções no servidor
 * - Passar dados ao Client Component
 * 
 * Rota: /[locale]/app/[workspaceSlug]/dashboard
 */
export const runtime = "nodejs";
export const revalidate = 60; // Revalidar a cada 60 segundos

export default async function DashboardPage({
  params,
}: DashboardPageProps) {
  // ✅ Await params (Next.js 15 breaking change)
  const { workspaceSlug, locale } = await params;

  // ✅ Buscar traduções no servidor
  const t = await getTranslations();

  // ✅ Validar autenticação
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized: User not authenticated");
  }

  // ✅ Validar membership no workspace
  const workspace = await validateWorkspaceMembership(
    user.id,
    workspaceSlug
  );

  // ✅ Preparar traduções serializáveis para o client
  const translations = {
    title: t("navigation.dashboard") || "Dashboard",
    welcome: t("workspace.dashboard.welcome") || "Bem-vindo ao seu Workspace",
    members: t("navigation.team") || "Membros",
    activities: t("workspace.dashboard.activities") || "Atividades",
    recentContacts: t("workspace.dashboard.recent_contacts") || "Novos Contatos",
    pendingTasks: t("workspace.dashboard.pending_tasks") || "Tarefas Pendentes",
    activeProjects: t("workspace.dashboard.active_projects") || "Projetos Ativos",
    growth: t("workspace.dashboard.growth") || "Crescimento",
    recentActivity: t("workspace.dashboard.recent_activity") || "Atividade Recente",
    nextSteps: t("workspace.dashboard.next_steps") || "Próximos Passos",
    addContacts: t("workspace.dashboard.add_contacts") || "Adicione seus primeiros contatos",
    addContactsDesc: t("workspace.dashboard.add_contacts_desc") || "Comece adicionando clientes e prospects à sua base",
    createProject: t("workspace.dashboard.create_project") || "Crie seu primeiro projeto",
    createProjectDesc: t("workspace.dashboard.create_project_desc") || "Organize seu trabalho em projetos estruturados",
    configureAutomations: t("workspace.dashboard.configure_automations") || "Configure automações",
    configureAutomationsDesc: t("workspace.dashboard.configure_automations_desc") || "Automatize tarefas repetitivas para aumentar produtividade",
    last7Days: t("common.last_7_days") || "Últimos 7 dias",
    inProgress: t("common.in_progress") || "Em progresso",
    thisMonth: t("common.this_month") || "Este mês",
    comparedToPreviousMonth: t("common.compared_to_previous_month") || "Comparado ao mês anterior",
  };

  return (
    <DashboardClient
      workspaceSlug={workspaceSlug}
      locale={locale}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      workspace={workspace as any}
      translations={translations}
    />
  );
}
