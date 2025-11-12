"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreVertical, Pencil, Copy, Trash2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteTemplateDialog } from "./DeleteTemplateDialog";
import { duplicateTemplateAction } from "@/lib/actions/template.actions";
import { toast } from "sonner";

interface Template {
  id: string;
  name: string;
  description: string | null;
  type: string;
  createdAt: Date;
}

interface TemplateCardProps {
  template: Template;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  /**
   * Duplica o template atual criando uma cópia com "Cópia de" no nome
   */
  const handleDuplicate = async () => {
    setIsDuplicating(true);
    try {
      const result = await duplicateTemplateAction(template.id);
      
      if (result.error) {
        toast.error(result.error);
      } else if (result.success && result.data) {
        toast.success(`Template "${result.data.name}" criado com sucesso!`);
      }
    } catch (error) {
      console.error("Erro ao duplicar template:", error);
      toast.error("Erro ao duplicar template. Tente novamente.");
    } finally {
      setIsDuplicating(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-4 space-y-3">
          {/* Header: Nome + Menu */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base line-clamp-1 flex-1">
              {template.name}
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/admin/digital-templates/${template.id}`}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDuplicate} 
                  disabled={isDuplicating}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {isDuplicating ? "Duplicando..." : "Duplicar"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setDeleteDialogOpen(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remover
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
            {template.description || "Sem descrição"}
          </p>
          
          {/* Preview Image */}
          <div className="bg-muted rounded h-32 flex items-center justify-center text-xs text-muted-foreground">
            Preview (em breve)
          </div>

          {/* Footer: Data (esquerda) + Tag (direita) */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
            <span className="text-xs text-muted-foreground">
              Criado em: {new Date(template.createdAt).toLocaleDateString("pt-BR")}
            </span>
            <Badge variant="secondary" className="text-xs">
              {template.type}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <DeleteTemplateDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        templateId={template.id}
        templateName={template.name}
      />
    </>
  );
}
