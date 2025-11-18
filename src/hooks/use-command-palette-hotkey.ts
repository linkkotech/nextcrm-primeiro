import { useEffect, useCallback } from "react";

/**
 * Hook customizado para registrar o atalho de teclado global (Cmd+K / Ctrl+K).
 * Abre a Paleta de Comandos quando o usuário pressiona o atalho.
 *
 * IMPORTANTE: Este hook deve ser chamado dentro do CommandPaletteProvider
 * para que o listener esteja sempre ativo.
 *
 * @param setIsOpen - Função para abrir/fechar a paleta de comandos
 *
 * @example
 * useCommandPaletteHotkey(setIsOpen);
 */
export function useCommandPaletteHotkey(setIsOpen: (open: boolean) => void) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Detectar Cmd+K (macOS) ou Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }

      // Permitir ESC para fechar (será tratado pelo Dialog)
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    },
    [setIsOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
}
