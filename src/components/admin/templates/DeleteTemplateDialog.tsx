"use client";

import { useState } from "react";
import { deleteTemplateAction } from "@/lib/actions/template.actions";
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

interface DeleteTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateId: string;
  templateName: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * DeleteTemplateDialog - Diálogo de confirmação para remover templates
 * 
 * Usa deleteTemplateAction do lib/actions/template.actions.ts que:
 * - Verifica permissões (platform admin ou workspace admin)
 * - Deleta template via Prisma (cascade delete nos blocks)
 * - Revalida cache
 * 
 * @param onSuccess - Callback executado após delete bem-sucedido (para toast/refresh)
 * @param onError - Callback executado se delete falhar (para toast de erro)
 */
export function DeleteTemplateDialog({
  open,
  onOpenChange,
  templateId,
  templateName,
  onSuccess,
  onError,
}: DeleteTemplateDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);

    const result = await deleteTemplateAction(templateId);

    if (result.error) {
      onError?.(result.error);
    } else if (result.success) {
      onSuccess?.();
    }

    setIsDeleting(false);
    onOpenChange(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. O template &quot;{templateName}&quot; será
            removido permanentemente do banco de dados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Removendo..." : "Remover"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
