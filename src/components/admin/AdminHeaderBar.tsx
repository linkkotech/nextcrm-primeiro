"use client";

import { useEffect, useState } from "react";
import { Bell, Moon, Sun, Sparkles, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { useHeader } from "@/context/HeaderContext";
import { useCommandPalette } from "@/context/CommandPaletteContext";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminHeaderBarProps {
  onToggleAiSidebar?: () => void;
}

/**
 * Header Primário - Exibe título principal, trigger de sidebar e controles globais.
 * Consome contexto para exibir o título dinâmico da página atual.
 */
export function AdminHeaderBar({ onToggleAiSidebar }: AdminHeaderBarProps) {
  const { setTheme, theme } = useTheme();
  const { primaryTitle } = useHeader();
  const { setIsOpen } = useCommandPalette();
  const [mounted, setMounted] = useState(false);

  // Aguardar montagem para evitar hydration mismatch no tema
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-6">
      <div className="flex items-center gap-2 flex-1">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        
        {/* Título Primário Dinâmico */}
        {primaryTitle ? (
          <h2 className="text-lg font-semibold text-foreground">{primaryTitle}</h2>
        ) : (
          <span className="text-sm text-muted-foreground">Admin</span>
        )}
      </div>

      {/* Search Button - Trigger da Paleta de Comandos */}
      <Button
        variant="outline"
        className="h-10 w-[300px] justify-between px-3 py-2 text-sm text-muted-foreground bg-white"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <span>Pesquisar...</span>
        </div>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Right side: AI Assistant | Notifications | Theme Toggle */}
      <div className="flex items-center gap-2">
        {/* AI Assistant */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleAiSidebar}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Sparkles className="h-5 w-5" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[300px]">
            <div className="p-2">
              <p className="text-sm font-semibold mb-2">Notificações</p>
              <div className="space-y-2">
                <DropdownMenuItem>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">Nova mensagem</p>
                    <p className="text-xs text-muted-foreground">
                      Você tem uma nova mensagem de um cliente
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">Atualização do sistema</p>
                    <p className="text-xs text-muted-foreground">
                      Uma atualização está disponível
                    </p>
                  </div>
                </DropdownMenuItem>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle - Renderiza placeholder até montar no cliente */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {mounted ? (
            theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )
          ) : (
            <div className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
}

