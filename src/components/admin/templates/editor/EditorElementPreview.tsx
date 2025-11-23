"use client";

import { EditorElement } from "@/types/editor";
import { cn } from "@/lib/utils";

interface EditorElementPreviewProps {
  /**
   * O elemento EditorElement a ser renderizado
   */
  element: EditorElement;

  /**
   * Se este elemento está atualmente selecionado no Inspector
   */
  isSelected?: boolean;

  /**
   * Callback acionado quando o usuário clica no elemento
   * Responsável por atualizar o selectedElementId no editor
   */
  onSelect?: (elementId: string) => void;
}

/**
 * EditorElementPreview - Componente para renderizar um EditorElement no canvas
 * 
 * Renderiza visualmente o elemento baseado no seu type (Section, Container, etc)
 * Suporta interação de seleção via onClick
 * 
 * Estilos base aplicados com base nas props do elemento:
 * - backgroundColor, padding, margin, borderRadius, etc
 * 
 * @example
 * <EditorElementPreview 
 *   element={sectionElement} 
 *   isSelected={selectedElementId === sectionElement.id}
 *   onSelect={setSelectedElementId}
 * />
 */
export function EditorElementPreview({
  element,
  isSelected,
  onSelect,
}: EditorElementPreviewProps) {
  // Estilos inline baseados nas props do elemento
  const getElementStyles = () => {
    const styles: React.CSSProperties = {};

    // Type narrowing para Section
    if (element.type === "Section") {
      const props = element.props;
      
      // Background
      if (props.style?.background?.type === "solid") {
        styles.backgroundColor = props.style.background.solidColor || "#ffffff";
      }

      // Layout/Spacing
      if (props.style?.layout?.padding) {
        const p = props.style.layout.padding;
        styles.padding = `${p.top}px ${p.right}px ${p.bottom}px ${p.left}px`;
      }

      if (props.style?.layout?.margin) {
        const m = props.style.layout.margin;
        styles.margin = `${m.top}px ${m.right}px ${m.bottom}px ${m.left}px`;
      }

      // Border
      if (props.style?.border?.width && props.style.border.width > 0) {
        styles.border = `${props.style.border.width}px ${props.style.border.style || "solid"} ${
          props.style.border.color || "#000000"
        }`;
        if (props.style.border.radius && props.style.border.radius > 0) {
          styles.borderRadius = `${props.style.border.radius}px`;
        }
      }
    }

    // Type narrowing para Container
    if (element.type === "Container") {
      const props = element.props;
      
      if (props.padding) {
        const p = props.padding;
        styles.padding = `${p.top}px ${p.right}px ${p.bottom}px ${p.left}px`;
      }
    }

    // Min Height para elementos vazios ficarem visíveis
    styles.minHeight = "100px";

    return styles;
  };

  // Renderização específica por tipo de elemento
  const renderContent = () => {
    switch (element.type) {
      case "Section":
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            {element.props.layerName || "Section"}
          </div>
        );

      case "Container":
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            {element.props.layerName || "Container"}
          </div>
        );

      case "Heading":
        return (
          <div className="font-bold">
            {element.type === "Heading" && (element.props.text || element.props.content || "Novo Título")}
          </div>
        );

      case "Text":
        return (
          <div className="text-sm">
            {element.type === "Text" && (element.props.content || "Clique para editar")}
          </div>
        );

      case "Button":
        return (
          <button
            disabled
            className="px-6 py-2 rounded text-white font-medium cursor-not-allowed opacity-90"
            style={{
              backgroundColor: element.type === "Button" ? (element.props.backgroundColor || "#000000") : "#000000",
              color: element.type === "Button" ? (element.props.textColor || "#ffffff") : "#ffffff",
            }}
          >
            {element.type === "Button" && (element.props.text || element.props.label || "Botão")}
          </button>
        );

      default:
        return (
          <div className="text-muted-foreground text-xs">
            {element.type} (não renderizável)
          </div>
        );
    }
  };

  return (
    <div
      className={cn(
        "relative transition-all cursor-pointer group",
        isSelected
          ? "ring-2 ring-primary shadow-lg"
          : "hover:ring-1 hover:ring-muted-foreground/50"
      )}
      style={getElementStyles()}
      onClick={() => onSelect?.(element.id)}
      title={`Clique para selecionar: ${
        (element.type === "Section" || element.type === "Container" || element.type === "Heading" || element.type === "Text" || element.type === "Button")
          ? element.props.layerName
          : element.type
      }`}
    >
      {renderContent()}

      {/* Children recursivamente */}
      {element.children && element.children.length > 0 && (
        <div className="space-y-2 mt-2">
          {element.children.map((child) => (
            <EditorElementPreview
              key={child.id}
              element={child}
              isSelected={isSelected}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
