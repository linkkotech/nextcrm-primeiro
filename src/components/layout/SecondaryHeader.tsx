"use client";

import { useHeader } from "@/context/HeaderContext";

/**
 * Header Secundário - Segunda linha do cabeçalho da aplicação admin.
 * Renderiza conteúdo dinâmico definido pela página atual via contexto.
 * Utilizado para breadcrumbs, filtros e ações contextuais.
 * 
 * Características:
 * - Altura: h-16 (64px) - Mesma do Header Primário
 * - Borda inferior para separação visual
 * - Conteúdo dinâmico via React Context
 */
export function SecondaryHeader() {
  const { secondaryHeaderContent } = useHeader();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-6">
      {secondaryHeaderContent ? (
        secondaryHeaderContent
      ) : (
        <div className="text-sm text-muted-foreground">
          [Selecione uma página para ver o conteúdo do header secundário]
        </div>
      )}
    </header>
  );
}

