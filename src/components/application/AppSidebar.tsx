"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  CheckSquare,
  Mail,
  BarChart3,
  Settings,
  Zap,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  workspaceSlug: string;
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
}

/**
 * Sidebar da Área de Cliente (Multi-tenant)
 * Exibe navegação específica dos módulos disponíveis para o workspace.
 *
 * Características:
 * - Links para Dashboard, Contatos, Projetos, Tarefas, Campanhas, Relatórios
 * - Ícones intuitivos para cada módulo
 * - Nav secundária para ações rápidas
 * - Footer com dados do usuário
 */
export function AppSidebar({
  workspaceSlug,
  userName,
  userEmail,
  userImage,
}: AppSidebarProps) {
  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: `/app/${workspaceSlug}/dashboard`,
        icon: LayoutDashboard,
        isActive: true,
      },
      {
        title: "Contatos",
        url: `/app/${workspaceSlug}/contacts`,
        icon: Users,
      },
      {
        title: "Projetos",
        url: `/app/${workspaceSlug}/projects`,
        icon: FolderOpen,
      },
      {
        title: "Tarefas",
        url: `/app/${workspaceSlug}/tasks`,
        icon: CheckSquare,
      },
      {
        title: "Campanhas",
        url: `/app/${workspaceSlug}/campaigns`,
        icon: Mail,
      },
      {
        title: "Relatórios",
        url: `/app/${workspaceSlug}/reports`,
        icon: BarChart3,
      },
    ],
    navSecondary: [
      {
        title: "Automações",
        url: `/app/${workspaceSlug}/automations`,
        icon: Zap,
      },
      {
        title: "Configurações",
        url: `/app/${workspaceSlug}/settings`,
        icon: Settings,
      },
    ],
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/admin/dashboard" className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <span className="font-semibold">N</span>
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">NextCRM</span>
                  <span className="text-xs text-muted-foreground">Client</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: userName || "Usuário",
            email: userEmail || "user@example.com",
            avatar: userImage || "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
