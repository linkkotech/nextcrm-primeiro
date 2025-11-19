import type { UnknownData, PrismaSerializable } from '@/types';

/**
 * Funções utilitárias para serializar dados do Prisma
 * Remove tipos não-serializáveis como Decimal e Date
 */

/**
 * Converte um plano do Prisma para um objeto serializável
 * Remove Decimal e Date que não podem ser passados para Client Components
 * 
 * @param plan - Dados brutos do Prisma (podem conter tipos não-serializáveis)
 * @returns Objeto com valores que podem ser serializados para JSON
 */
export function serializePlan(plan: UnknownData): PrismaSerializable {
  if (!plan || typeof plan !== 'object') return {};

  const planObj = plan as Record<string, unknown>;

  return {
    id: String(planObj.id),
    name: String(planObj.name),
    description: planObj.description ? String(planObj.description) : null,
    operationMode: String(planObj.operationMode),
    subscriptionType: String(planObj.subscriptionType),
    billingCycle: planObj.billingCycle ? String(planObj.billingCycle) : null,
    price: serializeDecimal(planObj.price),
    userLimit: Number(planObj.userLimit),
    features: Array.isArray(planObj.features) ? planObj.features : [],
    isActive: Boolean(planObj.isActive),
    createdAt: serializeDate(planObj.createdAt),
    updatedAt: serializeDate(planObj.updatedAt),
  } as PrismaSerializable;
}

/**
 * Serializa um Decimal do Prisma para número
 * 
 * @param value - Valor que pode ser Decimal, número ou string
 * @returns Número ou 0 se a conversão falhar
 */
export function serializeDecimal(value: unknown): number {
  if (typeof value === "number") return value;
  if (value === null || value === undefined) return 0;

  // Tentar usar o método toNumber() do Prisma Decimal
  if (typeof value === 'object' && value !== null && 'toNumber' in value && typeof (value as Record<string, unknown>).toNumber === "function") {
    return ((value as Record<string, unknown>).toNumber as () => number)();
  }

  // Fallback: converter para string e depois para número
  const numValue = Number(String(value));
  return isNaN(numValue) ? 0 : numValue;
}

/**
 * Serializa uma Date para ISO string
 * 
 * @param value - Pode ser Date, string ISO, ou objeto com método toISOString
 * @returns String no formato ISO 8601
 */
export function serializeDate(value: unknown): string {
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  if (value && typeof value === "object" && 'toISOString' in value && typeof (value as Record<string, unknown>).toISOString === "function") {
    return ((value as Record<string, unknown>).toISOString as () => string)();
  }
  return new Date().toISOString();
}

/**
 * Serializa um array de planos
 * 
 * @param plans - Array de dados brutos do Prisma
 * @returns Array de objetos serializáveis
 */
export function serializePlans(plans: unknown[]): PrismaSerializable[] {
  if (!Array.isArray(plans)) return [];
  return plans.map((plan) => serializePlan(plan as UnknownData));
}
