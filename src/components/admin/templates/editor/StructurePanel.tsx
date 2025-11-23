"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Layers } from "lucide-react";
import { useEditorPanel } from "@/context/EditorPanelContext";
import { StructureTreeView } from "./StructureTreeView";
import { TemplateBlock } from "@prisma/client";

interface StructurePanelProps {
  block?: TemplateBlock;
  onDelete?: (elementId: string) => void;
}

/**
 * StructurePanel - Painel flutuante e arrastável com a hierarquia de blocos
 * 
 * Componente que renderiza um painel flutuante (position: fixed) contendo
 * a StructureTreeView. O painel é arrastável pelo header.
 * 
 * Características:
 * - Position: fixed (não afeta o layout normal)
 * - Z-index: z-50 (fica acima de outros elementos)
 * - Dimensões: w-72, max-h-96 com overflow-y-auto
 * - Arrastável via header
 * 
 * @example
 * <StructurePanel block={block} />
 */
export function StructurePanel({ block, onDelete }: StructurePanelProps) {
  const { 
    isStructurePanelOpen, 
    toggleStructurePanel,
    structurePanelPosition, 
    setStructurePanelPosition 
  } = useEditorPanel();
  
  const panelRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef(structurePanelPosition);

  // IMPORTANTE: Manter posição atualizada em ref para não causar re-render do useEffect
  useEffect(() => {
    positionRef.current = structurePanelPosition;
  }, [structurePanelPosition]);

  // IMPORTANTE: Implementar drag simples sem dnd-kit
  // Capturar mousedown no header, mousemove global e mouseup global
  // Usar dependencies vazias para que listeners sejam adicionados apenas uma vez
  useEffect(() => {
    if (!isStructurePanelOpen) return;

    const panel = panelRef.current;
    if (!panel) return;

    const handleMouseDown = (e: MouseEvent) => {
      // Verificar se o clique foi no header (não em botões)
      const header = (e.target as HTMLElement).closest('[data-draggable="true"]');
      if (!header || (e.target as HTMLElement).closest('button')) return;

      isDraggingRef.current = true;
      dragOffsetRef.current = {
        x: e.clientX - positionRef.current.x,
        y: e.clientY - positionRef.current.y,
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const newPosition = {
        x: e.clientX - dragOffsetRef.current.x,
        y: e.clientY - dragOffsetRef.current.y,
      };

      setStructurePanelPosition(newPosition);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    panel.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      panel.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isStructurePanelOpen, setStructurePanelPosition]);

  if (!isStructurePanelOpen) {
    return null;
  }

  return (
    <Card
      ref={panelRef}
      className="fixed z-50 w-72 shadow-lg border border-border"
      style={{
        top: `${structurePanelPosition.y}px`,
        left: `${structurePanelPosition.x}px`,
      }}
    >
      {/* Header Arrastável */}
      <CardHeader 
        data-draggable="true"
        className="cursor-grab active:cursor-grabbing pb-3 select-none hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            <Layers className="h-4 w-4 flex-shrink-0" />
            <CardTitle className="text-base">Estrutura</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 flex-shrink-0"
            onClick={() => toggleStructurePanel()}
            title="Fechar painel de estrutura"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="max-h-96 overflow-y-auto pb-4">
        <StructureTreeView block={block} onDelete={onDelete} />
      </CardContent>
    </Card>
  );
}