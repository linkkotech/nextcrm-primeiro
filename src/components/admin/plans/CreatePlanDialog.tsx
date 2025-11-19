"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  FormDescription,
} from "@/components/ui/form";
import {
  createPlanSchema,
  type CreatePlanFormData,
  availablePlanFeatures,
  operationModeOptions,
  subscriptionTypeOptions,
  billingCycleRecurrentOptions,
  billingCycleContractOptions,
} from "@/schemas/plan.schemas";
import { createPlan, updatePlan } from "@/lib/actions/plan.actions";

interface PlanData {
  id?: string;
  name: string;
  description?: string;
  operationMode: string;
  subscriptionType: string;
  billingCycle?: string;
  price: number;
  userLimit: number;
  features: string[];
  isActive?: boolean;
  users?: number;
}

interface CreatePlanFormProps {
  onSubmit: (data: CreatePlanFormData) => void;
  onCancel: () => void;
  initialData?: PlanData;
  isEditMode?: boolean;
  isLoading?: boolean;
}

/**
 * Componente de formulário para criação/edição de planos
 * Contém todos os campos necessários para um plano completo
 */
function CreatePlanForm({
  onSubmit,
  onCancel,
  initialData,
  isEditMode,
  isLoading = false,
}: CreatePlanFormProps) {
  const form = useForm<CreatePlanFormData>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: {
      name: "",
      description: "",
      operationMode: "Comercial",
      subscriptionType: "Recorrente",
      billingCycle: "Monthly",
      price: 0,
      userLimit: 1,
      features: [],
      isActive: true,
    },
  });

  const subscriptionType = form.watch("subscriptionType");

  // Atualizar formulário quando initialData muda
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name || "",
        description: initialData.description || "",
        operationMode: (initialData.operationMode || "Comercial") as "Comercial" | "RedeApoio" | "Hibrido",
        subscriptionType: (initialData.subscriptionType || "Recorrente") as "Recorrente" | "Contrato",
        billingCycle: (initialData.billingCycle || "Monthly") as "Monthly" | "Semiannual" | "Yearly" | "OneTime",
        price: Number(initialData.price) || 0,
        userLimit: Number(initialData.userLimit || initialData.users) || 1,
        features: Array.isArray(initialData.features) ? initialData.features : [],
        isActive: initialData.isActive !== false,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        operationMode: "Comercial",
        subscriptionType: "Recorrente",
        billingCycle: "Monthly",
        price: 0,
        userLimit: 1,
        features: [],
        isActive: true,
      });
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* SEÇÃO 1: INFORMAÇÕES BÁSICAS */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Informações Básicas</h3>

          {/* Nome do Plano */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Plano *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Plano Profissional"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Descrição */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição (opcional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva brevemente as características deste plano..."
                    className="resize-none"
                    rows={3}
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* SEÇÃO 2: CONFIGURAÇÃO DE SERVIÇO */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Configuração de Serviço</h3>

          {/* Modo de Operação */}
          <FormField
            control={form.control}
            name="operationMode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modo de Operação *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {operationModeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tipo de Assinatura */}
          <FormField
            control={form.control}
            name="subscriptionType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Assinatura *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subscriptionTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Ciclo de Cobrança (Condicional) */}
          <FormField
            control={form.control}
            name="billingCycle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {subscriptionType === "Recorrente" 
                    ? "Ciclo de Cobrança *" 
                    : "Tipo de Pagamento *"}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o ciclo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subscriptionType === "Recorrente" ? (
                      billingCycleRecurrentOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))
                    ) : (
                      billingCycleContractOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* SEÇÃO 3: PLANO DE PREÇO */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Plano de Preço</h3>

          <div className="grid grid-cols-2 gap-4">
            {/* Valor do Plano */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor do Plano (R$) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Número de Usuários */}
            <FormField
              control={form.control}
              name="userLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Usuários *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="1"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* SEÇÃO 4: FEATURES INCLUÍDAS */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="features"
            render={() => (
              <FormItem>
                <FormLabel>Features Incluídas *</FormLabel>
                <FormDescription>
                  Selecione pelo menos uma feature para este plano
                </FormDescription>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  {availablePlanFeatures.map((feature) => (
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
        </div>

        {/* SEÇÃO 5: STATUS */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3 space-y-0">
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
        </div>

        {/* Dialog Footer */}
        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Salvando..."
              : isEditMode
              ? "Atualizar Plano"
              : "Criar Plano"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

interface CreatePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: PlanData;
  isEditMode?: boolean;
}

/**
 * Dialog para criação/edição de planos
 * Encapsula o formulário CreatePlanForm
 */
export function CreatePlanDialog({
  open,
  onOpenChange,
  initialData,
  isEditMode,
}: CreatePlanDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreatePlanFormData) => {
    setIsLoading(true);
    try {
      let result;
      if (isEditMode && initialData?.id) {
        // Chamar updatePlan server action
        result = await updatePlan(initialData.id, data);
        if (result.success) {
          alert("✅ " + result.message);
        } else {
          alert("❌ Erro: " + (result.message || result.error));
        }
      } else {
        // Chamar createPlan server action
        result = await createPlan(data);
        if (result.success) {
          alert("✅ " + result.message);
        } else {
          alert("❌ Erro: " + (result.message || result.error));
        }
      }
      // Fechar dialog apenas se sucesso
      if (result?.success) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Erro ao salvar plano:", error);
      alert("❌ Erro ao salvar plano. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Plano" : "Novo Plano"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Atualize os dados do plano"
              : "Crie um novo plano com todas as configurações"}
          </DialogDescription>
        </DialogHeader>

        <CreatePlanForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          initialData={initialData}
          isEditMode={isEditMode}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
