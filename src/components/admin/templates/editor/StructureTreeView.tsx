"use client";

import { Layers2 } from "lucide-react";
import { TreeNode } from "./TreeNode";
import { TemplateBlock } from "@prisma/client";

/**
 * Interface para representar um elemento na hierarquia de blocos
 *
 * Cada elemento tem um ID único, tipo, e pode ter filhos (children)
 * para formar uma estrutura de árvore.
 */
interface TreeElement {
  id: string;
  type: string;
  children?: TreeElement[];
  [key: string]: any;
}

interface StructureTreeViewProps {
  block?: TemplateBlock;
  onDelete?: (elementId: string) => void;
}

/**
 * StructureTreeView - Componente contenedor para visualização da árvore de elementos
 *
 * Responsabilidades:
 * - Recebe um TemplateBlock completo
 * - Extrai os elements do campo content (JSON)
 * - Valida se há elements válidos
 * - Renderiza um TreeNode para cada elemento raiz
 * - Exibe empty state se não há elementos
 *
 * Props:
 * - block?: O TemplateBlock que contém o content JSON com a hierarquia
 *
 * @example
 * <StructureTreeView block={templateBlock} />
 */
export function StructureTreeView({ block, onDelete }: StructureTreeViewProps) {
  // Extrair elements do content JSON
  const content = block?.content as any;
  const elements: TreeElement[] = content?.elements || [];

  // Empty state
  if (!elements || elements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <Layers2 className="h-8 w-8 mb-2" />
        <p className="text-xs text-center">
          Nenhum elemento encontrado.
          <br />
          Comece arrastando um elemento para o Canvas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-0 select-none">
      {elements.map((element) => (
        <TreeNode key={element.id} element={element} level={0} onDelete={onDelete} />
      ))}
    </div>
  );
}