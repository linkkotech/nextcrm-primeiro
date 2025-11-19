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
  const content = (
    <a 
      href={href}
      className="flex items-center w-full h-9"
    >
      {/* 🎯 ZONA DE ÍCONE - Largura Fixa (32px) */}
      <div className="w-8 flex items-center justify-start flex-shrink-0">
        {icon}
      </div>
      
      {/* 📝 ZONA DE TEXTO - Flex-grow */}
      {!isCollapsed && (
        <span className="flex-1 text-sm">{label}</span>
      )}
    </a>
  );

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start px-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              asChild
            >
              {content}
            </Button>
          </TooltipTrigger>
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
      className="w-full justify-start px-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      asChild
    >
      {content}
    </Button>
  );
}
