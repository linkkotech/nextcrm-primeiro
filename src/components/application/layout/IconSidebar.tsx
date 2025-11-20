"use client";
import { navigationModules } from "@/config/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface IconSidebarProps {
  workspaceSlug: string;
  locale: string;
  activeModule?: string | null;
}

/**
 * IconSidebar - Barra lateral de ícones para navegação entre módulos
 * 
 * Renderiza uma barra vertical de 64px de largura com ícones representando
 * cada módulo principal da aplicação. Cada ícone possui um tooltip e estado ativo.
 * 
 * Características:
 * - Width: 64px (w-16)
 * - Background: bg-muted
 * - Border: border-r
 * - Responsive: hidden md:flex (oculta em mobile)
 * - Tooltips: Mostram o nome do módulo ao hover
 * - Estado ativo: bg-primary text-primary-foreground quando activeModule corresponde
 * - NO fixed positioning - funciona no fluxo normal do layout
 * 
 * @param workspaceSlug - Slug do workspace atual para construção de URLs
 * @param locale - Locale atual para internacionalização de rotas
 * @param activeModule - Key do módulo atualmente ativo (derivado do pathname)
 */
export function IconSidebar({ 
  workspaceSlug, 
  locale, 
  activeModule 
}: IconSidebarProps) {
  return (
    <aside className="hidden md:flex w-16 h-full flex-col items-center justify-center gap-4 bg-background py-4">
      <TooltipProvider delayDuration={0}>
        {/* Lista de módulos */}
        <nav className="flex flex-col items-center gap-4">
          {navigationModules.map((module) => {
            const Icon = module.icon;
            const isActive = activeModule === module.key;
            const href = `/${locale}/app/${workspaceSlug}${module.href}`;

            return (
              <Tooltip key={module.key}>
                <TooltipTrigger asChild>
                  <a
                    href={href}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-white text-foreground hover:bg-primary hover:text-primary-foreground"
                    )}
                    aria-label={module.title}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {module.title}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </TooltipProvider>
    </aside>
  );
}