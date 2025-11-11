"use client";

import Link from "next/link";
import {
  Building2,
  Settings,
  Shield,
  Users,
  Zap,
  CreditCard,
  Code,
  Clock,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsSidebarProps {
  pathname: string;
}

const settingsMenu = [
  {
    title: "Empresa",
    href: "/admin/settings",
    icon: Building2,
    description: "Dados da empresa",
  },
  {
    title: "Geral",
    href: "/admin/settings/general",
    icon: Settings,
    description: "Configurações gerais",
  },
  {
    title: "Segurança",
    href: "/admin/settings/security",
    icon: Shield,
    description: "Segurança e privacidade",
  },
  {
    title: "Roles & Permissões",
    href: "/admin/settings/roles",
    icon: Users,
    description: "Gerenciar papéis",
  },
  {
    title: "Autenticação e E-mail",
    href: "/admin/settings/auth",
    icon: FileText,
    description: "Configurar autenticação",
  },
  {
    title: "Storage e Uploads",
    href: "/admin/settings/storage",
    icon: Zap,
    description: "Gerenciar arquivos",
  },
  {
    title: "Módulos e Integrações",
    href: "/admin/settings/modules",
    icon: Code,
    description: "Ativar/desativar módulos",
  },
  {
    title: "Credenciais de Pagamento",
    href: "/admin/settings/payment",
    icon: CreditCard,
    description: "Configurar pagamentos",
  },
  {
    title: "Custom Fields",
    href: "/admin/settings/custom-fields",
    icon: Settings,
    description: "Adicionar campos personalizados",
  },
  {
    title: "Agendamentos (Cron Job)",
    href: "/admin/settings/scheduler",
    icon: Clock,
    description: "Agendar tarefas",
  },
  {
    title: "Logs e Auditoria",
    href: "/admin/settings/logs",
    icon: FileText,
    description: "Visualizar logs",
  },
];

export function SettingsSidebar({ pathname }: SettingsSidebarProps) {
  return (
    <div className="space-y-1">
      {settingsMenu.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link key={item.href} href={item.href}>
            <div
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                isActive && "bg-muted font-medium text-foreground"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="font-medium text-sm">{item.title}</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
