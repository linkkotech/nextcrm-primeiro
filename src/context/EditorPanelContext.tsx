'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Contexto para gerenciar o estado dos painéis flutuantes do editor.
 * 
 * Responsável por:
 * - Visibilidade do painel de estrutura (hierarquia de blocos)
 * - Coordenadas de posição do painel flutuante
 * - Métodos para alternar e repositicionar painéis
 * 
 * @example
 * const { isStructurePanelOpen, toggleStructurePanel } = useEditorPanel();
 */
interface EditorPanelContextType {
  // Estado de visibilidade
  isStructurePanelOpen: boolean;
  toggleStructurePanel: () => void;
  
  // Posição do painel flutuante
  structurePanelPosition: { x: number; y: number };
  setStructurePanelPosition: (pos: { x: number; y: number }) => void;
}

const EditorPanelContext = createContext<EditorPanelContextType | undefined>(undefined);

/**
 * Provider do contexto de painéis do editor.
 * Deve envolver a árvore de componentes do editor que precisam acessar painéis flutuantes.
 */
export function EditorPanelProvider({ children }: { children: ReactNode }) {
  const [isStructurePanelOpen, setIsStructurePanelOpen] = useState<boolean>(true);
  const [structurePanelPosition, setStructurePanelPosition] = useState({ x: 100, y: 100 });

  const toggleStructurePanel = () => {
    setIsStructurePanelOpen((prev) => !prev);
  };

  return (
    <EditorPanelContext.Provider
      value={{
        isStructurePanelOpen,
        toggleStructurePanel,
        structurePanelPosition,
        setStructurePanelPosition,
      }}
    >
      {children}
    </EditorPanelContext.Provider>
  );
}

/**
 * Hook customizado para acessar o contexto de painéis do editor.
 * Deve ser usado apenas em Client Components dentro do EditorPanelProvider.
 * 
 * @returns {EditorPanelContextType} Objeto com estado e setters dos painéis
 * @throws {Error} Se usado fora do EditorPanelProvider
 * 
 * @example
 * const { isStructurePanelOpen, toggleStructurePanel } = useEditorPanel();
 */
export function useEditorPanel(): EditorPanelContextType {
  const context = useContext(EditorPanelContext);
  if (context === undefined) {
    throw new Error(
      'useEditorPanel deve ser usado dentro de um EditorPanelProvider'
    );
  }
  return context;
}