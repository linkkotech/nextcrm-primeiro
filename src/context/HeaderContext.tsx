'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Contexto para gerenciar o conteúdo dinâmico dos headers primário e secundário.
 * Permite que páginas "controlem" o que é exibido nos headers de forma centralizada.
 */
interface HeaderContextType {
  primaryTitle: string;
  secondaryHeaderContent: ReactNode;
  setPrimaryTitle: (title: string) => void;
  setSecondaryHeaderContent: (content: ReactNode) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

/**
 * Provider do contexto de headers.
 * Deve envolver a árvore de componentes que precisa acessar o contexto.
 */
export function HeaderProvider({ children }: { children: ReactNode }) {
  const [primaryTitle, setPrimaryTitle] = useState<string>('');
  const [secondaryHeaderContent, setSecondaryHeaderContent] = useState<ReactNode>(null);

  return (
    <HeaderContext.Provider
      value={{
        primaryTitle,
        secondaryHeaderContent,
        setPrimaryTitle,
        setSecondaryHeaderContent,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
}

/**
 * Hook customizado para acessar o contexto de headers.
 * Deve ser usado apenas em Client Components.
 * 
 * @returns {HeaderContextType} Objeto com estado e setters dos headers
 * @throws {Error} Se usado fora do HeaderProvider
 * 
 * @example
 * const { primaryTitle, setPrimaryTitle } = useHeader();
 */
export function useHeader(): HeaderContextType {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeader deve ser usado dentro de um HeaderProvider');
  }
  return context;
}
