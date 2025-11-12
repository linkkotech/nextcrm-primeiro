"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { createTemplateSchema } from "@/schemas/template.schemas";
import { createDigitalTemplateAction } from "@/lib/actions/template.actions";
import { AlertCircle } from "lucide-react";

type CreateTemplateFormData = {
  templateName: string;
  description?: string;
  templateType: "profile_template" | "content_block";
};

interface CreateTemplateFormProps {
  onSubmit: (data: CreateTemplateFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string;
}

function CreateTemplateForm({
  onSubmit,
  onCancel,
  isLoading = false,
  error,
}: CreateTemplateFormProps) {
  const form = useForm<CreateTemplateFormData>({
    resolver: zodResolver(createTemplateSchema),
    defaultValues: {
      templateName: "",
      description: "",
      templateType: "profile_template",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Template Name */}
        <FormField
          control={form.control}
          name="templateName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Template *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Perfil de Advogado"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva brevemente o propósito deste template..."
                  className="resize-none"
                  rows={4}
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Template Type */}
        <FormField
          control={form.control}
          name="templateType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Template *</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="profile_template">
                    Template de Perfil Completo
                  </SelectItem>
                  <SelectItem value="content_block">Bloco de Conteúdo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Dialog Footer */}
        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar e Continuar"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

interface CreateTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTemplateDialog({
  open,
  onOpenChange,
}: CreateTemplateDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async (data: CreateTemplateFormData) => {
    setError(undefined);
    setIsLoading(true);

    try {
      // IMPORTANTE: Chamar Server Action com os dados validados
      const result = await createDigitalTemplateAction(data);

      if (result.error) {
        setError(result.error);
        return;
      }

      // Sucesso: fechar modal
      onOpenChange(false);
      setError(undefined);
    } catch (err) {
      console.error("Error submitting template form:", err);
      setError("Ocorreu um erro ao salvar o template. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Novo Item</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <CreateTemplateForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
          error={error}
        />
      </DialogContent>
    </Dialog>
  );
}
