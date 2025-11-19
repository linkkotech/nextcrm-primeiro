"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import {
  Command,
  LayoutDashboard,
  Users,
  Package,
  CreditCard,
  UsersRound,
  Mail,
  Building2,
  Blocks,
  LifeBuoy,
  Settings2,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

/**
 * Admin Sidebar com suporte a i18n
 * 
 * Renderiza navegação administrativo com traduções dinâmicas
 * baseado no locale da requisição.
 * 
 * Integrado com next-intl para suporte a pt/en/es.
 */
interface AdminSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userName?: string | null
  userEmail?: string | null
  userImage?: string | null
}

export function AdminSidebar({ userName, userEmail, userImage, ...props }: AdminSidebarProps) {
  const t = useTranslations()
  const locale = useLocale()
  
  const user = {
    name: userName || "Admin User",
    email: userEmail || "admin@example.com",
    avatar: userImage || "/avatars/shadcn.jpg",
  }

  const data = {
    navMain: [
      { 
        title: t("navigation.dashboard"), 
        url: `/${locale}/admin/dashboard`, 
        icon: LayoutDashboard, 
        isActive: true 
      },
      { 
        title: "Clientes", 
        url: `/${locale}/admin/clients`, 
        icon: Users 
      },
      { 
        title: t("navigation.team"), 
        url: `/${locale}/admin/team`, 
        icon: UsersRound 
      },
      {
        title: "Planos",
        url: `/${locale}/admin/plans`,
        icon: Package,
        items: [
          { title: "Produtos", url: `/${locale}/admin/products` },
          { title: "Cupons", url: `/${locale}/admin/coupons` },
          { title: "Pedidos", url: `/${locale}/admin/orders` },
        ],
      },
      { 
        title: "Pagamentos", 
        url: `/${locale}/admin/payments`, 
        icon: CreditCard 
      },
      // { 
      //   title: "Templates Digitais", 
      //   url: `/${locale}/admin/digital-templates`, 
      //   icon: FileText 
      // },
      { 
        title: "Templates de E-mail", 
        url: `/${locale}/admin/email-templates`, 
        icon: Mail 
      },
      { 
        title: "Usuários Workspace", 
        url: `/${locale}/admin/workspace-users`, 
        icon: Building2 
      },
      { 
        title: "Módulos", 
        url: `/${locale}/admin/modules`, 
        icon: Blocks 
      },
    ],
    navSecondary: [
      { 
        title: t("navigation.support"), 
        url: `/${locale}/admin/support`, 
        icon: LifeBuoy 
      },
      { 
        title: "Configurações", 
        url: `/${locale}/admin/settings`, 
        icon: Settings2 
      },
    ],
  }

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href={`/${locale}/admin`}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Linkko</span>
                  <span className="truncate text-xs">AI Studio</span>
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
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
