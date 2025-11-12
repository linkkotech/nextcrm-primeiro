import { GripVertical, MoreHorizontal, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

interface ContentBlockProps {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  clickCount?: number;
  isActive: boolean;
  isDraggable: boolean;
  onToggle: (active: boolean) => void;
  onDelete?: () => void;
  children: ReactNode;
  icon: ReactNode;
}

export function ContentBlock({
  id,
  type,
  title,
  subtitle,
  clickCount = 0,
  isActive,
  isDraggable,
  onToggle,
  onDelete,
  children,
  icon,
}: ContentBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    disabled: !isDraggable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isSpecialBlock = type === "hero" || type === "menu";

  return (
    <AccordionItem
      value={id}
      ref={setNodeRef}
      style={style}
      className={cn(
        "border rounded-xl overflow-hidden",
        isSpecialBlock ? "bg-primary text-primary-foreground" : "bg-card"
      )}
    >
      {/* Header Container */}
      <div className="flex w-full items-center justify-between gap-4">
        {/* Accordion Trigger - Grupo Esquerdo (Identidade) */}
        <AccordionTrigger
          className={cn(
            "flex-1 px-4 py-3 hover:no-underline [&[data-state=open]>svg]:rotate-180",
            "flex items-center gap-3",
            isSpecialBlock ? "hover:bg-primary/90" : "hover:bg-accent"
          )}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Alça de Arrastar */}
            <div
              {...(isDraggable ? { ...attributes, ...listeners } : {})}
              className={cn(
                "flex-shrink-0 text-muted-foreground",
                isDraggable ? "cursor-grab active:cursor-grabbing" : "cursor-default opacity-60"
              )}
              aria-label={isDraggable ? "Arrastar bloco" : undefined}
              aria-hidden={isDraggable ? undefined : true}
              style={isDraggable ? undefined : { filter: "blur(0.5px)" }}
            >
              <GripVertical className="h-4 w-4" />
            </div>

            {/* Ícone Principal com Fundo */}
            <div className="p-2 rounded-md flex-shrink-0 bg-white shadow-sm">
              <div className="flex items-center justify-center text-primary">
                {icon}
              </div>
            </div>

            {/* Título e Descrição */}
            <div className="flex flex-col items-start gap-0.5 flex-1 min-w-0">
              <span
                className={cn(
                  "text-sm font-medium",
                  isSpecialBlock ? "text-primary-foreground" : "text-foreground"
                )}
              >
                {title}
              </span>
              {subtitle && (
                <span
                  className={cn(
                    "text-xs",
                    isSpecialBlock
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  )}
                >
                  {subtitle}
                </span>
              )}
            </div>

            {/* Click Counter (apenas para links) */}
            {type === "link" && (
              <div className="flex items-center gap-1 text-xs flex-shrink-0 ml-2">
                <Link2 className="h-3 w-3" />
                <span>{clickCount}</span>
              </div>
            )}
          </div>
        </AccordionTrigger>

        {/* Grupo Direito - Controles de Ação (FORA do Trigger) */}
        <div className="flex items-center gap-4 px-4 flex-shrink-0">
          {/* Switch */}
          <Switch
            checked={isActive}
            onCheckedChange={onToggle}
            onClick={(e) => e.stopPropagation()}
            className="data-[state=checked]:bg-muted data-[state=checked]:border-muted"
          />

          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8",
                  isSpecialBlock
                    ? "hover:bg-primary-foreground/20"
                    : "hover:bg-accent"
                )}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Editar</DropdownMenuItem>
              {onDelete && (
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                >
                  Remover
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AccordionContent
        className={cn(
          "px-4 py-4",
          isSpecialBlock ? "bg-gray-50" : "bg-background"
        )}
      >
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}
