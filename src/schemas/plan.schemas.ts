import { z } from "zod";

/**
 * Schema Zod para criação e edição de planos
 * Validações completas para todos os campos do modelo Plan
 */
export const createPlanSchema = z.object({
  name: z
    .string()
    .min(1, "Nome do plano é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome não pode exceder 100 caracteres"),
  
  description: z
    .string()
    .max(500, "Descrição não pode exceder 500 caracteres")
    .optional()
    .nullable(),
  
  operationMode: z.enum(["Comercial", "RedeApoio", "Hibrido"], {
    errorMap: () => ({ message: "Selecione um modo de operação válido" }),
  }),
  
  subscriptionType: z.enum(["Recorrente", "Contrato"], {
    errorMap: () => ({ message: "Selecione um tipo de assinatura válido" }),
  }),
  
  billingCycle: z
    .enum(["Monthly", "Semiannual", "Yearly", "OneTime"], {
      errorMap: () => ({ message: "Selecione um ciclo de cobrança válido" }),
    })
    .optional()
    .nullable(),
  
  price: z
    .number()
    .min(0, "O preço não pode ser negativo")
    .refine((val) => val >= 0, {
      message: "Preço deve ser um valor válido",
    }),
  
  userLimit: z
    .number()
    .int("Número de usuários deve ser um inteiro")
    .min(1, "Deve haver pelo menos 1 usuário permitido")
    .max(10000, "Limite de usuários não pode exceder 10.000"),
  
  features: z
    .array(z.string())
    .min(1, "Selecione pelo menos uma feature")
    .max(10, "Não pode exceder 10 features"),
  
  isActive: z.boolean().default(true),
}).refine(
  (data) => {
    // billingCycle é obrigatório para qualquer tipo de assinatura
    if (!data.billingCycle) {
      return false;
    }
    // Se Contrato, deve ser OneTime
    if (data.subscriptionType === "Contrato" && data.billingCycle !== "OneTime") {
      return false;
    }
    // Se Recorrente, não pode ser OneTime
    if (data.subscriptionType === "Recorrente" && data.billingCycle === "OneTime") {
      return false;
    }
    return true;
  },
  {
    message: "Ciclo de cobrança inválido para o tipo de assinatura selecionado",
    path: ["billingCycle"],
  }
);

export type CreatePlanFormData = z.infer<typeof createPlanSchema>;

/**
 * Array de features disponíveis para seleção no formulário
 */
export const availablePlanFeatures = [
  "Agentes de IA",
  "Análise de Dados",
  "Integração API",
  "Backup Automático",
  "App Mobile",
  "Relatórios Avançados",
  "Suporte Prioritário",
] as const;

/**
 * Opções de modo de operação
 */
export const operationModeOptions = [
  { value: "Comercial", label: "Comercial" },
  { value: "RedeApoio", label: "Rede de Apoio" },
  { value: "Hibrido", label: "Híbrido" },
] as const;

/**
 * Opções de tipo de assinatura
 */
export const subscriptionTypeOptions = [
  { value: "Recorrente", label: "Recorrente" },
  { value: "Contrato", label: "Contrato" },
] as const;

/**
 * Opções de ciclo de cobrança para assinatura Recorrente
 */
export const billingCycleRecurrentOptions = [
  { value: "Monthly", label: "Mensal" },
  { value: "Semiannual", label: "Semestral" },
  { value: "Yearly", label: "Anual" },
] as const;

/**
 * Opções de ciclo de cobrança para assinatura Contrato
 */
export const billingCycleContractOptions = [
  { value: "OneTime", label: "Pagamento Único" },
] as const;
