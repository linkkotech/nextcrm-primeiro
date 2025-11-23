"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyInspectorStateProps {
  /**
   * Callback acionado quando o usuário clica em "Adicionar Elemento"
   * Responsável por abrir o BlockBuilderModal
   */
  onAddElement: () => void;
}

/**
 * EmptyInspectorState - Componente exibido quando nenhum elemento está selecionado
 * 
 * Renderiza uma mensagem amigável indicando que o usuário deve selecionar
 * ou adicionar um elemento para editar suas propriedades.
 * 
 * Inclui um botão "Adicionar Elemento" que abre o BlockBuilderModal
 * 
 * @example
 * <EmptyInspectorState onAddElement={() => setIsBuilderOpen(true)} />
 */
export function EmptyInspectorState({ onAddElement }: EmptyInspectorStateProps) {
  return (
    <div className="flex flex-col h-full items-center justify-center p-6 text-center space-y-4">
      {/* Ícone */}
      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
        <Plus className="h-8 w-8 text-muted-foreground" />
      </div>

      {/* Título */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Nenhum elemento selecionado</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Selecione um elemento no canvas ou crie um novo para editar suas propriedades
        </p>
      </div>

      {/* Botão de Ação */}
      <Button onClick={onAddElement} className="mt-2">
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Elemento
      </Button>
    </div>
  );
}
