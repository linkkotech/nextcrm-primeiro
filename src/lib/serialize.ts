/**
 * Funções utilitárias para serializar dados do Prisma
 * Remove tipos não-serializáveis como Decimal e Date
 */

/**
 * Converte um plano do Prisma para um objeto serializável
 * Remove Decimal e Date que não podem ser passados para Client Components
 */
export function serializePlan(plan: any): Record<string, any> {
  if (!plan) return {};

  return {
    id: String(plan.id),
    name: String(plan.name),
    description: plan.description ? String(plan.description) : null,
    operationMode: String(plan.operationMode),
    subscriptionType: String(plan.subscriptionType),
    billingCycle: plan.billingCycle ? String(plan.billingCycle) : null,
    price: serializeDecimal(plan.price),
    userLimit: Number(plan.userLimit),
    features: plan.features,
    isActive: Boolean(plan.isActive),
    createdAt: serializeDate(plan.createdAt),
    updatedAt: serializeDate(plan.updatedAt),
  };
}

/**
 * Serializa um Decimal do Prisma para número
 */
export function serializeDecimal(value: any): number {
  if (typeof value === "number") return value;
  if (value === null || value === undefined) return 0;

  // Tentar usar o método toNumber() do Prisma Decimal
  if (typeof value.toNumber === "function") {
    return value.toNumber();
  }

  // Fallback: converter para string e depois para número
  const numValue = Number(String(value));
  return isNaN(numValue) ? 0 : numValue;
}

/**
 * Serializa uma Date para ISO string
 */
export function serializeDate(value: any): string {
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  if (value && typeof value === "object" && typeof value.toISOString === "function") {
    return value.toISOString();
  }
  return new Date().toISOString();
}

/**
 * Serializa um array de planos
 */
export function serializePlans(plans: any[]): Record<string, any>[] {
  if (!Array.isArray(plans)) return [];
  return plans.map(serializePlan);
}
