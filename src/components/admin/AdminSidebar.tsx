"use client"

import * as React from "react"
import {
  Command,
  LayoutDashboard,
  Users,
  Package,
  CreditCard,
  UsersRound,
  FileText,
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

const data = {
  navMain: [
    { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard, isActive: true },
    { title: "Clientes", url: "/admin/clients", icon: Users },
    {
      title: "Planos",
      url: "/admin/plans",
      icon: Package,
      items: [
        { title: "Produtos", url: "/admin/products" },
        { title: "Cupons", url: "/admin/coupons" },
        { title: "Pedidos", url: "/admin/orders" },
      ],
    },
    { title: "Pagamentos", url: "/admin/payments", icon: CreditCard },
    { title: "Equipe", url: "/admin/team", icon: UsersRound },
    { title: "Templates Digitais", url: "/admin/digital-templates", icon: FileText },
    { title: "Templates de E-mail", url: "/admin/email-templates", icon: Mail },
    { title: "Usuários Workspace", url: "/admin/workspace-users", icon: Building2 },
    { title: "Módulos", url: "/admin/modules", icon: Blocks },
  ],
  navSecondary: [
    { title: "Suporte", url: "/admin/support", icon: LifeBuoy },
  ],
}

interface AdminSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userName?: string | null
  userEmail?: string | null
  userImage?: string | null
}

export function AdminSidebar({ userName, userEmail, userImage, ...props }: AdminSidebarProps) {
  const user = {
    name: userName || "Admin User",
    email: userEmail || "admin@example.com",
    avatar: userImage || "/avatars/shadcn.jpg",
  }

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
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
