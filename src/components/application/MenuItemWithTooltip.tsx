"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface MenuItemWithTooltipProps {
  href: string;
  icon: ReactNode;
  label: string;
  isCollapsed: boolean;
}

/**
 * Componente auxiliar para itens de menu que se adaptam ao estado collapsed.
 * 
 * Expandido: Mostra ícone + texto
 * Recolhido: Mostra apenas ícone + tooltip ao hover
 * 
 * @param href - URL do link
 * @param icon - Ícone do item (ReactNode)
 * @param label - Texto do item (usado como tooltip quando recolhido)
 * @param isCollapsed - Se a sidebar está recolhida
 */
export function MenuItemWithTooltip({
  href,
  icon,
  label,
  isCollapsed,
}: MenuItemWithTooltipProps) {
  const button = (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isCollapsed && "justify-center"
      )}
      asChild
    >
      <a href={href}>{icon}</a>
    </Button>
  );

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right" className="bg-sidebar-foreground text-sidebar-background">
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button
      variant="ghost"
      className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      asChild
    >
      <a href={href}>
        {icon}
        <span>{label}</span>
      </a>
    </Button>
  );
}
