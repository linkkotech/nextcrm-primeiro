"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { createWorkspace } from "@/lib/actions/workspace.actions";

// Zod Schema
const createWorkspaceSchema = z.object({
  workspaceName: z
    .string()
    .min(1, "Nome do workspace é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres"),
  clientType: z.enum(["pf", "pj"], {
    errorMap: () => ({ message: "Selecione um tipo de cliente" }),
  }),
  document: z.string().min(1, "Documento é obrigatório"),
  adminName: z
    .string()
    .min(1, "Nome completo é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres"),
  adminEmail: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
  planId: z.string().min(1, "A seleção de um plano é obrigatória."),
});

type CreateWorkspaceFormData = z.infer<typeof createWorkspaceSchema>;

interface Plan {
  id: string;
  name: string;
  price: number;
  billingCycle?: string;
}

interface CreateWorkspaceFormProps {
  onSubmit: (data: CreateWorkspaceFormData) => void;
  onCancel: () => void;
  availablePlans: Plan[];
}

function CreateWorkspaceForm({
  onSubmit,
  onCancel,
  availablePlans,
}: CreateWorkspaceFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateWorkspaceFormData>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      workspaceName: "",
      clientType: "pj",
      document: "",
      adminName: "",
      adminEmail: "",
      password: "",
      planId: "",
    },
  });

  const clientType = form.watch("clientType");
  const isPersonalClient = clientType === "pf";

  const handleFormSubmit = async (data: CreateWorkspaceFormData) => {
    setError(null);
    
    startTransition(async () => {
      const result = await createWorkspace(data);
      
      if (!result.success) {
        setError(result.error || result.message);
      } else {
        // Sucesso - fechar dialog e chamar callback
        onSubmit(data);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Workspace Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Informações do Workspace</h3>

          <FormField
            control={form.control}
            name="workspaceName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Workspace *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Acme Corporation"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="clientType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Cliente *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pj">Pessoa Jurídica</SelectItem>
                      <SelectItem value="pf">Pessoa Física</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="document"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isPersonalClient ? "CPF" : "CNPJ"} *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        isPersonalClient
                          ? "000.000.000-00"
                          : "00.000.000/0000-00"
                      }
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Plan Selection */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Plano de Assinatura</h3>

          <FormField
            control={form.control}
            name="planId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selecione um Plano *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha um plano..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availablePlans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        <span className="font-medium">{plan.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Administrator Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Administrador do Workspace</h3>

          <FormField
            control={form.control}
            name="adminName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: João Silva"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="adminEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Ex: admin@empresa.com"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha Provisória *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres, 1 letra e 1 número"
                      disabled={isPending}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <p className="text-xs text-muted-foreground mt-2">
                  Esta senha será usada pelo administrador para o primeiro acesso ao sistema
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Dialog Footer */}
        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Criando..." : "Criar Workspace"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

interface CreateClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availablePlans: Plan[];
}

export function CreateClientDialog({
  open,
  onOpenChange,
  availablePlans,
}: CreateClientDialogProps) {
  const handleSubmit = (data: CreateWorkspaceFormData) => {
    console.log("Novo workspace:", data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo Workspace</DialogTitle>
          <DialogDescription>
            Crie um novo workspace e configure o primeiro administrador
          </DialogDescription>
        </DialogHeader>

        <CreateWorkspaceForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          availablePlans={availablePlans}
        />
      </DialogContent>
    </Dialog>
  );
}
