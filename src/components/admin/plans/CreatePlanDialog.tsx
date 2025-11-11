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
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
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

// Available features constant
const availableFeatures = [
  "Agentes de IA",
  "Análise de Dados",
  "Integração API",
  "Backup Automático",
  "App Mobile",
  "Relatórios Avançados",
  "Suporte Prioritário",
  "Múltiplos Usuários",
];

// Zod Schema
const createPlanSchema = z.object({
  planName: z
    .string()
    .min(1, "Nome do plano é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres"),
  operationMode: z.enum(["comercial", "rede_apoio", "hibrido"], {
    errorMap: () => ({ message: "Selecione um modo de operação válido" }),
  }),
  numUsers: z.coerce
    .number()
    .min(1, "Número de usuários deve ser pelo menos 1"),
  features: z.array(z.string()).min(1, "Selecione pelo menos uma feature"),
  isActive: z.boolean(),
});

type CreatePlanFormData = z.infer<typeof createPlanSchema>;

interface CreatePlanFormProps {
  onSubmit: (data: CreatePlanFormData) => void;
  onCancel: () => void;
}

function CreatePlanForm({ onSubmit, onCancel }: CreatePlanFormProps) {
  const form = useForm<CreatePlanFormData>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: {
      planName: "",
      operationMode: "comercial",
      numUsers: 1,
      features: [],
      isActive: true,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Plan Name */}
        <FormField
          control={form.control}
          name="planName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Plano</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Plano Profissional" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Operation Mode */}
        <FormField
          control={form.control}
          name="operationMode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modo de Operação</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="comercial">Comercial</SelectItem>
                  <SelectItem value="rede_apoio">Rede de Apoio</SelectItem>
                  <SelectItem value="hibrido">Híbrido</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Number of Users */}
        <FormField
          control={form.control}
          name="numUsers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Usuários</FormLabel>
              <FormControl>
                <Input type="number" min="1" placeholder="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Features Included */}
        <FormField
          control={form.control}
          name="features"
          render={() => (
            <FormItem>
              <FormLabel>Features Incluídas</FormLabel>
              <div className="grid grid-cols-2 gap-4">
                {availableFeatures.map((feature) => (
                  <FormField
                    key={feature}
                    control={form.control}
                    name="features"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(feature)}
                            onCheckedChange={(checked) => {
                              const updatedFeatures = checked
                                ? [...(field.value || []), feature]
                                : field.value?.filter((f) => f !== feature) ||
                                  [];
                              field.onChange(updatedFeatures);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          {feature}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Plan Active Toggle */}
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3">
              <FormLabel className="mb-0">Plano Ativo</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Dialog Footer */}
        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

interface CreatePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePlanDialog({
  open,
  onOpenChange,
}: CreatePlanDialogProps) {
  const handleSubmit = (data: CreatePlanFormData) => {
    console.log("Novo plano:", data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo Plano</DialogTitle>
          <DialogDescription>
            Crie um novo plano para os clientes
          </DialogDescription>
        </DialogHeader>

        <CreatePlanForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
