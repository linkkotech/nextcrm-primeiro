"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { getElementIcon } from "@/config/editor-elements";
import { clsx } from "clsx";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TreeElement {
  id: string;
  type: string;
  children?: TreeElement[];
  [key: string]: any;
}

interface TreeNodeProps {
  element: TreeElement;
  level?: number;
  onDelete?: (elementId: string) => void;
}

export function TreeNode({ element, level = 0, onDelete }: TreeNodeProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete?.(element.id);
    setIsDeleteDialogOpen(false);
  };

  const hasChildren = element.children && element.children.length > 0;
  const shortId = element.id.substring(0, 6);
  const Icon = getElementIcon(element.type);

  return (
    <div className="space-y-0">
      <div
        className={clsx(
          "flex items-center gap-1 py-1.5 px-2 rounded hover:bg-muted/50 transition-colors cursor-default select-none group relative",
          "text-sm"
        )}
        style={{
          paddingLeft: `${level * 16 + 8}px`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {hasChildren ? (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-0 h-5 w-5 flex items-center justify-center hover:bg-muted transition-colors rounded flex-shrink-0"
            title={isOpen ? "Recolher" : "Expandir"}
          >
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        ) : (
          <div className="w-5 flex-shrink-0" />
        )}

        <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />

        <span className="font-medium text-foreground truncate">
          {element.type}
        </span>
        <span className="text-xs text-muted-foreground ml-auto flex-shrink-0">
          #{shortId}
        </span>

        {isHovered && onDelete && (
          <button
            onClick={handleDeleteClick}
            className="ml-2 p-1 hover:bg-destructive/10 rounded transition-colors flex-shrink-0"
            title="Excluir elemento"
          >
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </button>
        )}
      </div>

      {hasChildren && isOpen && (
        <div className="space-y-0">
          {element.children!.map((child) => (
            <TreeNode key={child.id} element={child} level={level + 1} onDelete={onDelete} />
          ))}
        </div>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja excluir?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O elemento "{element.type} (#{shortId})" será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Não</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
