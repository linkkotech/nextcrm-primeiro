"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";

// Zod Schema
const createTemplateSchema = z.object({
  templateName: z
    .string()
    .min(1, "Nome do template é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  templateType: z.enum(["profile_complete", "content_block"], {
    errorMap: () => ({ message: "Selecione um tipo de template válido" }),
  }),
});

type CreateTemplateFormData = z.infer<typeof createTemplateSchema>;

interface CreateTemplateFormProps {
  onSubmit: (data: CreateTemplateFormData) => void;
  onCancel: () => void;
}

function CreateTemplateForm({ onSubmit, onCancel }: CreateTemplateFormProps) {
  const form = useForm<CreateTemplateFormData>({
    resolver: zodResolver(createTemplateSchema),
    defaultValues: {
      templateName: "",
      description: "",
      templateType: "profile_complete",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Template Name */}
        <FormField
          control={form.control}
          name="templateName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Template *</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Perfil de Advogado" {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="profile_complete">
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
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Salvar e Continuar</Button>
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
  const handleSubmit = (data: CreateTemplateFormData) => {
    console.log("Novo template:", data);
    onOpenChange(false);
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
        />
      </DialogContent>
    </Dialog>
  );
}
