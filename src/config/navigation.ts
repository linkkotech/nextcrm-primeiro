import { LucideIcon, Rocket, Users, Bot, CreditCard, Briefcase, Megaphone, BarChart3, LayoutDashboard } from "lucide-react";

/**
 * Configuração Centralizada de Navegação
 * 
 * Define a estrutura de módulos da aplicação e seus metadados.
 * Utilizado pela IconSidebar e disponível para navegação contextual na AppSidebar.
 */

export interface NavigationModule {
  key: string;
  title: string;
  icon: LucideIcon;
  href: string;
  description?: string;
}

/**
 * Módulos principais da aplicação
 * Cada módulo representa uma área funcional do sistema
 */
export const navigationModules: NavigationModule[] = [
  {
    key: 'onboarding',
    title: 'Onboarding',
    icon: Rocket,
    href: '/onboarding',
    description: 'Configuração inicial e boas-vindas'
  },
  {
    key: 'dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    description: 'Visão geral e métricas'
  },
  {
    key: 'crm',
    title: 'Smart CRM',
    icon: Briefcase,
    href: '/crm',
    description: 'Gestão de relacionamento com clientes'
  },
  {
    key: 'ai-agents',
    title: 'AI Agents',
    icon: Bot,
    href: '/ai-agents',
    description: 'Agentes de inteligência artificial'
  },
  {
    key: 'payments',
    title: 'Payments',
    icon: CreditCard,
    href: '/payments',
    description: 'Gestão de pagamentos e assinaturas'
  },
  {
    key: 'projects',
    title: 'Projects',
    icon: Users,
    href: '/projects',
    description: 'Gestão de projetos'
  },
  {
    key: 'marketing',
    title: 'Marketing',
    icon: Megaphone,
    href: '/marketing',
    description: 'Campanhas e automações'
  },
  {
    key: 'reports',
    title: 'Reports',
    icon: BarChart3,
    href: '/reports',
    description: 'Relatórios e análises'
  }
];

/**
 * Helper para obter módulo por key
 */
export function getModuleByKey(key: string): NavigationModule | undefined {
  return navigationModules.find(module => module.key === key);
}
