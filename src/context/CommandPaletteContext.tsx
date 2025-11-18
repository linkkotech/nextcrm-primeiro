"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { CommandDialog } from "@/components/global/CommandDialog";
import { useCommandPaletteHotkey } from "@/hooks/use-command-palette-hotkey";

/**
 * Context para gerenciar o estado global da Paleta de Comandos.
 * Fornece acesso ao hook useCommandPalette em toda a árvore de componentes.
 */
interface CommandPaletteContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextType | undefined>(
  undefined
);

/**
 * Provedor da Paleta de Comandos.
 * Gerencia o estado de visibilidade do modal e renderiza o CommandDialog.
 * Deve ser colocado no topo da árvore de componentes da aplicação.
 */
export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  // Registrar atalho de teclado (Cmd+K / Ctrl+K)
  useCommandPaletteHotkey(setIsOpen);

  return (
    <CommandPaletteContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
      <CommandDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </CommandPaletteContext.Provider>
  );
}

/**
 * Hook para acessar o contexto da Paleta de Comandos.
 * Permite abrir/fechar a paleta de qualquer componente descendente.
 *
 * @example
 * const { setIsOpen } = useCommandPalette();
 * const handleClick = () => setIsOpen(true);
 *
 * @throws {Error} Se usado fora do CommandPaletteProvider
 */
export function useCommandPalette() {
  const context = useContext(CommandPaletteContext);
  if (context === undefined) {
    throw new Error(
      "useCommandPalette deve ser usado dentro de um CommandPaletteProvider"
    );
  }
  return context;
}
