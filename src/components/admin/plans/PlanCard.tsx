"use client";

import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatBillingCycle,
  formatPrice,
  formatOperationMode,
  getOperationModeBadgeColor,
  formatFeatures,
} from "@/lib/plan-formatters";

interface PlanCardProps {
  plan: {
    id: string;
    name: string;
    description: string | null;
    operationMode: string;
    subscriptionType: string;
    billingCycle: string | null;
    price: number;
    userLimit: number;
    features: unknown;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  onEditClick: (planId: string) => void;
}

/**
 * Card para exibir informações de um plano
 * Renderiza dinamicamente dados do plano com formatações amigáveis
 */
export function PlanCard({ plan, onEditClick }: PlanCardProps) {
  const features = formatFeatures(plan.features);
  const operationModeColor = getOperationModeBadgeColor(plan.operationMode);
  const billingCycleLabel = formatBillingCycle(plan.billingCycle);
  const priceFormatted = formatPrice(plan.price, plan.billingCycle);

  return (
    <Card className="relative bg-card overflow-hidden flex flex-col h-full border border-border hover:border-primary/50 transition-colors">
      {/* Status Badge - Canto Superior Direito */}
      <div className="absolute top-4 right-4">
        <Badge
          variant={plan.isActive ? "default" : "secondary"}
          className={plan.isActive ? "bg-primary text-primary-foreground" : ""}
        >
          {plan.isActive ? "Ativo" : "Inativo"}
        </Badge>
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col h-full">
        {/* Plan Name */}
        <h3 className="text-lg font-semibold mb-2 pr-20">{plan.name}</h3>

        {/* Description */}
        {plan.description && (
          <p className="text-xs text-muted-foreground mb-4">{plan.description}</p>
        )}

        {/* Price and Billing Cycle */}
        <div className="mb-6">
          <p className="text-2xl font-bold text-primary">{priceFormatted}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Ciclo: {billingCycleLabel}
          </p>
        </div>

        {/* Operation Mode Badge */}
        <div className="mb-6">
          <Badge variant={operationModeColor}>
            {formatOperationMode(plan.operationMode)}
          </Badge>
        </div>

        {/* User Limit */}
        <div className="mb-6">
          <p className="text-xs text-muted-foreground mb-1">Limite de Usuários</p>
          <p className="text-sm font-medium">{plan.userLimit} usuários</p>
        </div>

        {/* Features */}
        <div className="mb-6 flex-1">
          <p className="text-xs text-muted-foreground mb-3 font-semibold">
            Recursos Inclusos
          </p>
          {features.length > 0 ? (
            <ul className="space-y-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground">Nenhum recurso definido</p>
          )}
        </div>

        {/* Edit Button */}
        <Button
          variant="outline"
          className="w-full mt-auto"
          onClick={() => onEditClick(plan.id)}
        >
          Editar
        </Button>
      </div>
    </Card>
  );
}
