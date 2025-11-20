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
  ChevronRight,
  MapPin,
  Building2,
} from "lucide-react";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
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
 * Utiliza componentes nativos do shadcn/ui para consistência com AdminSidebar.
 * Padrão: SidebarMenu (gap-1), SidebarMenuButton (h-8, gap-2), SidebarMenuSub (com borda).
 * Suporta estado collapsed/expanded com tooltips automáticos.
 * Integrado com next-intl para i18n.
 * 
 * Layout em 3 zonas:
 * - Header: Logo/marca + seletor de workspace
 * - Content: Grupos de menu com SidebarGroup + Collapsible para sub-itens
 * - Footer: Links de configuração + card de uso + perfil do usuário
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
  const t = useTranslations();
  const locale = useLocale();

  return (
    <>
      {/* ===== ZONA SUPERIOR (HEADER) ===== */}
      <SidebarHeader className="border-b border-sidebar-border">
        {/* Bloco 1: Marca */}
        <div className="flex h-12 items-center px-2">
          <a href={`/${locale}/app/${workspaceSlug}`} className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
              S
            </div>
            <div className="flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-semibold text-sidebar-foreground">SmartHub</span>
              <span className="text-xs text-sidebar-foreground/60">Cliente</span>
            </div>
          </a>
        </div>

        {/* Bloco 2: Seletor de Workspace */}
        <div className="px-2 pb-2 group-data-[collapsible=icon]:hidden">
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
        </div>
      </SidebarHeader>

      {/* ===== ZONA CENTRAL (CONTENT) ===== */}
      <SidebarContent>
        {/* Grupo 1: Menus Principais */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t("navigation.dashboard")}>
                <a href={`/${locale}/app/${workspaceSlug}/dashboard`}>
                  <LayoutDashboard />
                  <span>{t("navigation.dashboard")}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t("navigation.tasks")}>
                <a href={`/${locale}/app/${workspaceSlug}/tasks`}>
                  <CheckSquare />
                  <span>{t("navigation.tasks")}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t("navigation.inbox")}>
                <a href={`/${locale}/app/${workspaceSlug}/inbox`}>
                  <Mail />
                  <span>{t("navigation.inbox")}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Equipe (Collapsible) */}
            <Collapsible asChild defaultOpen className="group/collapsible">
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={t("navigation.team")}>
                  <a href={`/${locale}/app/${workspaceSlug}/team`}>
                    <Users />
                    <span>{t("navigation.team")}</span>
                  </a>
                </SidebarMenuButton>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction className="data-[state=open]:rotate-90">
                    <ChevronRight />
                    <span className="sr-only">Toggle</span>
                  </SidebarMenuAction>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <a href={`/${locale}/app/${workspaceSlug}/team`}>
                          <span>{t("navigation.team_members")}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <a href={`/${locale}/app/${workspaceSlug}/addresses`}>
                          <span>{t("navigation.addresses")}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <a href={`/${locale}/app/${workspaceSlug}/units`}>
                          <span>{t("navigation.units")}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>

        {/* Grupo 2: Menus Avançados com Collapsible */}
        <SidebarGroup>
          <SidebarMenu>
            {/* Smart CRM */}
            <Collapsible asChild defaultOpen className="group/collapsible">
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Smart CRM">
                  <a href={`/${locale}/app/${workspaceSlug}/crm`}>
                    <Briefcase />
                    <span>Smart CRM</span>
                  </a>
                </SidebarMenuButton>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction className="data-[state=open]:rotate-90">
                    <ChevronRight />
                    <span className="sr-only">Toggle</span>
                  </SidebarMenuAction>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <a href={`/${locale}/app/${workspaceSlug}/crm/prospection`}>
                          <span>Prospecção</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <a href={`/${locale}/app/${workspaceSlug}/crm/leads`}>
                          <span>Leads</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <a href={`/${locale}/app/${workspaceSlug}/crm/contacts`}>
                          <span>Contatos</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

            {/* AI Agente Hub */}
            <Collapsible asChild className="group/collapsible">
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="AI Agente Hub">
                  <a href={`/${locale}/app/${workspaceSlug}/ia`}>
                    <Zap />
                    <span>AI Agente Hub</span>
                  </a>
                </SidebarMenuButton>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction className="data-[state=open]:rotate-90">
                    <ChevronRight />
                    <span className="sr-only">Toggle</span>
                  </SidebarMenuAction>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <a href={`/${locale}/app/${workspaceSlug}/ia/workflows`}>
                          <span>Workflows</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <a href={`/${locale}/app/${workspaceSlug}/ia/knowledge`}>
                          <span>Bases de Conhecimento</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

            {/* Cartões Inteligentes */}
            <Collapsible asChild className="group/collapsible">
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Cartões Inteligentes">
                  <a href={`/${locale}/app/${workspaceSlug}/tools`}>
                    <BarChart3 />
                    <span>Cartões Inteligentes</span>
                  </a>
                </SidebarMenuButton>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction className="data-[state=open]:rotate-90">
                    <ChevronRight />
                    <span className="sr-only">Toggle</span>
                  </SidebarMenuAction>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <a href={`/${locale}/app/${workspaceSlug}/tools/smart-cards/digital-profiles`}>
                          <span>Perfis Digitais</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <a href={`/${locale}/app/${workspaceSlug}/tools/smart-cards/templates`}>
                          <span>Templates</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <a href={`/${locale}/app/${workspaceSlug}/tools/smart-cards/google-wallet`}>
                          <span>Google Wallet</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <a href={`/${locale}/app/${workspaceSlug}/tools/smart-cards/nfc-devices`}>
                          <span>Dispositivos NFC</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>

        {/* Grupo 3: Links Secundários */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t("navigation.calendar")}>
                <a href={`/${locale}/app/${workspaceSlug}/calendar`}>
                  <Calendar />
                  <span>{t("navigation.calendar")}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t("navigation.integrations")}>
                <a href={`/${locale}/app/${workspaceSlug}/integrations`}>
                  <Link2 />
                  <span>{t("navigation.integrations")}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* ===== ZONA INFERIOR (FOOTER) ===== */}
      <SidebarFooter className="border-t border-sidebar-border">
        {/* Grupo 1: Links de Configuração */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t("navigation.settings")}>
                <a href={`/${locale}/app/${workspaceSlug}/settings`}>
                  <Settings />
                  <span>{t("navigation.settings")}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t("navigation.support")}>
                <a href={`/${locale}/app/${workspaceSlug}/support`}>
                  <HelpCircle />
                  <span>{t("navigation.support")}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Grupo 2: Card de Armazenamento */}
        <Card className="bg-sidebar-accent border-sidebar-border mx-2 group-data-[collapsible=icon]:hidden">
          <CardContent className="p-3">
            <div className="text-xs font-semibold text-sidebar-foreground mb-1">
              Armazenamento
            </div>
            <div className="text-xs text-sidebar-foreground/60 mb-2">
              2.3 GB / 10 GB
            </div>
            <Progress value={23} className="mb-3 h-1.5" />
            <button className="w-full text-xs h-8 px-3 rounded-md bg-sidebar text-sidebar-foreground border border-sidebar-border hover:bg-sidebar-accent transition-colors font-medium">
              Upgrade
            </button>
          </CardContent>
        </Card>

        {/* Grupo 3: UserProfile */}
        <UserProfile
          name={userName}
          email={userEmail}
          image={userImage}
          isCollapsed={state === "collapsed"}
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
