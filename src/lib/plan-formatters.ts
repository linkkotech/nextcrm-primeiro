/**
 * Formatadores e utilitários para exibição de dados de Planos
 */

/**
 * Formata ciclo de cobrança para exibição amigável ao usuário
 * @param billingCycle - Valor do ciclo de cobrança (Monthly, Semiannual, Yearly, OneTime)
 * @returns String formatada em português
 */
export function formatBillingCycle(billingCycle?: string | null): string {
  const billingCycleMap: Record<string, string> = {
    Monthly: "Mensal",
    Semiannual: "Semestral",
    Yearly: "Anual",
    OneTime: "Pagamento Único",
  };
  return billingCycle ? billingCycleMap[billingCycle] || billingCycle : "-";
}

/**
 * Formata preço com moeda e ciclo de cobrança
 * @param price - Preço em valor decimal ou string
 * @param billingCycle - Ciclo de cobrança (opcional)
 * @returns String formatada (ex: "R$ 99,90 / mês")
 */
export function formatPrice(
  price: number | string,
  billingCycle?: string | null
): string {
  // Garantir que temos um número válido
  let numPrice: number;
  
  if (typeof price === "string") {
    numPrice = parseFloat(price);
  } else if (typeof price === "number") {
    numPrice = price;
  } else {
    // Se for objeto (Decimal), converter para string primeiro
    numPrice = parseFloat(String(price)) || 0;
  }

  // Fallback para 0 se NaN
  if (isNaN(numPrice)) {
    numPrice = 0;
  }

  // Formatar como moeda brasileira
  const formatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numPrice);

  if (!billingCycle || billingCycle === "OneTime") {
    return formatted;
  }

  const cycleShort = billingCycle === "Monthly" 
    ? "mês" 
    : billingCycle === "Semiannual" 
    ? "6 meses" 
    : "ano";
  
  return `${formatted} / ${cycleShort}`;
}

/**
 * Formata modo de operação para exibição amigável
 * @param mode - Modo de operação (Comercial, RedeApoio, Hibrido)
 * @returns String formatada em português
 */
export function formatOperationMode(mode?: string | null): string {
  const modeMap: Record<string, string> = {
    Comercial: "Comercial",
    RedeApoio: "Rede de Apoio",
    Hibrido: "Híbrido",
  };
  return mode ? modeMap[mode] || mode : "-";
}

/**
 * Retorna cor de badge para modo de operação
 * @param mode - Modo de operação
 * @returns Classe Tailwind para cor
 */
export function getOperationModeBadgeColor(
  mode?: string | null
): "default" | "secondary" | "destructive" | "outline" {
  const colorMap: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    Comercial: "default",
    RedeApoio: "secondary",
    Hibrido: "outline",
  };
  return mode ? colorMap[mode] || "outline" : "outline";
}

/**
 * Formata tipo de assinatura para exibição amigável
 * @param type - Tipo de assinatura (Recorrente, Contrato)
 * @returns String formatada em português
 */
export function formatSubscriptionType(type?: string | null): string {
  const typeMap: Record<string, string> = {
    Recorrente: "Recorrente",
    Contrato: "Contrato",
  };
  return type ? typeMap[type] || type : "-";
}

/**
 * Extrai e formata features de um objeto JSON armazenado
 * @param features - Array de features (pode vir como JSON ou array)
 * @returns Array de strings com features
 */
export function formatFeatures(features: unknown): string[] {
  if (!features) return [];
  if (Array.isArray(features)) return features.filter((f) => typeof f === "string");
  if (typeof features === "string") {
    try {
      const parsed = JSON.parse(features);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}
