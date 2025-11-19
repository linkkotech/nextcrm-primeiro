import * as React from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  LayoutDashboard,
  CheckSquare,
  Mail,
  Users,
  Zap,
  Settings,
  HelpCircle,
  BarChart3,
  Briefcase,
  Calendar,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { MenuItemWithTooltip } from "./MenuItemWithTooltip";
import { UserProfile } from "@/components/admin/UserProfile";

interface AppSidebarProps {
  workspaceSlug: string;
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
}

/**
 * Sidebar de Navegação da Área de Cliente (Multi-tenant)
 * 
 * Reutiliza o componente Sidebar do shadcn/ui para consistência com AdminSidebar.
 * Suporta estado expandido/collapsed com renderização condicional e tooltips.
 * Integrado com next-intl para i18n.
 * 
 * Layout em 3 zonas:
 * - Header (fixa): Logo/marca + seletor de workspace
 * - Content (rolável): Menus principais + menus secundários com accordion
 * - Footer (fixa): Links fixos + card de uso + card do usuário
 * 
 * @param workspaceSlug - Slug do workspace atual
 * @param userName - Nome do usuário logado
 * @param userEmail - Email do usuário logado
 * @param userImage - URL da imagem do avatar do usuário
 */
function AppSidebarContent({
  workspaceSlug,
  userName,
  userEmail,
  userImage,
}: AppSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const t = useTranslations();
  const locale = useLocale();

  return (
    <>
      {/* ===== ZONA SUPERIOR (HEADER) ===== */}
      <SidebarHeader className="space-y-4 border-b border-sidebar-border">
        {/* Bloco 1: Marca */}
        {!isCollapsed ? (
          // Expandido: Logo com texto
          <a href={`/${locale}/app/${workspaceSlug}`} className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
              S
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-sidebar-foreground">SmartHub</span>
              <span className="text-xs text-sidebar-foreground/60">Cliente</span>
            </div>
          </a>
        ) : (
          // Recolhido: Apenas ícone centralizado
          <a href={`/${locale}/app/${workspaceSlug}`} className="flex justify-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
              S
            </div>
          </a>
        )}

        {/* Bloco 2: Seletor de Workspace */}
        {!isCollapsed && (
          <Select defaultValue="workspace-principal">
            <SelectTrigger className="w-full bg-transparent border-none shadow-none text-sidebar-foreground hover:bg-sidebar-accent/50">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="workspace-principal">Workspace Principal</SelectItem>
              <SelectItem value="workspace-secundario">Workspace Secundário</SelectItem>
            </SelectContent>
          </Select>
        )}
      </SidebarHeader>

      {/* ===== ZONA CENTRAL (CONTENT) ===== */}
      <SidebarContent className="space-y-4">
        {/* Grupo 1: Menus Principais */}
        <div className="space-y-1">
          <MenuItemWithTooltip
            href={`/${locale}/app/${workspaceSlug}/dashboard`}
            icon={<LayoutDashboard className="w-4 h-4" />}
            label={t("navigation.dashboard")}
            isCollapsed={isCollapsed}
          />

          <MenuItemWithTooltip
            href={`/${locale}/app/${workspaceSlug}/tasks`}
            icon={<CheckSquare className="w-4 h-4" />}
            label={t("navigation.tasks")}
            isCollapsed={isCollapsed}
          />

          <MenuItemWithTooltip
            href={`/${locale}/app/${workspaceSlug}/inbox`}
            icon={<Mail className="w-4 h-4" />}
            label={t("navigation.inbox")}
            isCollapsed={isCollapsed}
          />

          <MenuItemWithTooltip
            href={`/${locale}/app/${workspaceSlug}/team`}
            icon={<Users className="w-4 h-4" />}
            label={t("navigation.team")}
            isCollapsed={isCollapsed}
          />
        </div>

        {/* Grupo 2: Menus Secundários com Accordion - Só renderiza se expandido */}
        {!isCollapsed && (
          <Accordion type="multiple" className="w-full">
            {/* VENDAS */}
            <AccordionItem value="vendas" className="border-none">
              <AccordionTrigger className="px-2 py-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground [&[data-state=open]>svg]:rotate-90">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4" />
                  <span>Smart CRM</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="space-y-1 ml-4 mt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs text-sidebar-foreground/80 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
                    asChild
                  >
                    <a href={`/app/${workspaceSlug}/crm/prospection`}>Prospecção</a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs text-sidebar-foreground/80 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
                    asChild
                  >
                    <a href={`/app/${workspaceSlug}/crm/leads`}>Leads</a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs text-sidebar-foreground/80 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
                    asChild
                  >
                    <a href={`/app/${workspaceSlug}/crm/contacts`}>Contatos</a>
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* RECURSOS DE IA */}
            <AccordionItem value="ia" className="border-none">
              <AccordionTrigger className="px-2 py-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground [&[data-state=open]>svg]:rotate-90">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4" />
                  <span>AI Agente Hub</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="space-y-1 ml-4 mt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs text-sidebar-foreground/80 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
                    asChild
                  >
                    <a href={`/app/${workspaceSlug}/ia/workflows`}>Workflows</a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs text-sidebar-foreground/80 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
                    asChild
                  >
                    <a href={`/app/${workspaceSlug}/ia/knowledge`}>Bases de Conhecimento</a>
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* FERRAMENTAS */}
            <AccordionItem value="ferramentas" className="border-none">
              <AccordionTrigger className="px-2 py-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground [&[data-state=open]>svg]:rotate-90">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-4 h-4" />
                  <span>Cartões Inteligentes</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="space-y-1 ml-4 mt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs text-sidebar-foreground/80 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
                    asChild
                  >
                    <a href={`/app/${workspaceSlug}/tools/smart-cards`}>Gerenciar Cartões</a>
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {/* Links Secundários Simples */}
        <div className="space-y-1">
          <MenuItemWithTooltip
            href={`/${locale}/app/${workspaceSlug}/calendar`}
            icon={<Calendar className="w-4 h-4" />}
            label={t("navigation.calendar")}
            isCollapsed={isCollapsed}
          />

          <MenuItemWithTooltip
            href={`/${locale}/app/${workspaceSlug}/integrations`}
            icon={<Link2 className="w-4 h-4" />}
            label={t("navigation.integrations")}
            isCollapsed={isCollapsed}
          />
        </div>
      </SidebarContent>

      {/* ===== ZONA INFERIOR (FOOTER) ===== */}
      <SidebarFooter className="space-y-2 border-t border-sidebar-border">
        {/* Grupo 1: Links Fixos */}
        <div className="space-y-1">
          <MenuItemWithTooltip
            href={`/${locale}/app/${workspaceSlug}/settings`}
            icon={<Settings className="w-4 h-4" />}
            label={t("navigation.settings")}
            isCollapsed={isCollapsed}
          />

          <MenuItemWithTooltip
            href={`/${locale}/app/${workspaceSlug}/support`}
            icon={<HelpCircle className="w-4 h-4" />}
            label={t("navigation.support")}
            isCollapsed={isCollapsed}
          />
        </div>

        {/* Grupo 2: Card de Armazenamento - Só renderiza se expandido */}
        {!isCollapsed && (
          <Card className="bg-sidebar-accent border-sidebar-border">
            <CardContent className="p-3">
              <div className="text-xs font-semibold text-sidebar-foreground mb-1">
                Armazenamento
              </div>
              <div className="text-xs text-sidebar-foreground/60 mb-2">
                2.3 GB / 10 GB
              </div>
              <Progress value={23} className="mb-3 h-1.5" />
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs h-8 border-sidebar-border text-sidebar-foreground hover:bg-sidebar-background"
              >
                Upgrade
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Grupo 3: UserProfile Component */}
        <UserProfile
          name={userName}
          email={userEmail}
          image={userImage}
          isCollapsed={isCollapsed}
        />
      </SidebarFooter>
    </>
  );
}

export function AppSidebar({
  workspaceSlug,
  userName,
  userEmail,
  userImage,
}: AppSidebarProps) {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <AppSidebarContent
        workspaceSlug={workspaceSlug}
        userName={userName}
        userEmail={userEmail}
        userImage={userImage}
      />
    </Sidebar>
  );
}
