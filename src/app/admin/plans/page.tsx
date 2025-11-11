"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreatePlanDialog } from "@/components/admin/plans/CreatePlanDialog";

// Mock data for plans
const mockPlans = [
  {
    id: "1",
    name: "teste de plano",
    status: "Ativo",
    operationMode: "Comercial",
    users: 1,
    features: [
      "Agentes de IA",
      "Análise de Dados",
      "Integração API",
      "Backup Automático",
    ],
  },
  {
    id: "2",
    name: "Plano Profissional",
    status: "Ativo",
    operationMode: "Profissional",
    users: 5,
    features: [
      "Agentes de IA",
      "Análise Avançada",
      "Integração API",
      "Suporte Prioritário",
    ],
  },
  {
    id: "3",
    name: "Plano Enterprise",
    status: "Ativo",
    operationMode: "Corporativo",
    users: 50,
    features: [
      "Agentes de IA",
      "Analytics Completo",
      "Integrações Ilimitadas",
      "Backup Premium",
      "Acesso VIP",
    ],
  },
];

interface Plan {
  id: string;
  name: string;
  status: string;
  operationMode: string;
  users: number;
  features: string[];
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <Card className="relative bg-muted/40 overflow-hidden flex flex-col h-full">
      {/* Status Badge - Canto Superior Direito */}
      <div className="absolute top-4 right-4">
        <Badge className="bg-yellow-400 text-black hover:bg-yellow-500">
          {plan.status}
        </Badge>
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col h-full">
        {/* Plan Name */}
        <h3 className="text-lg font-semibold mb-6 pr-20">{plan.name}</h3>

        {/* Operation Mode */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-1">
            Modo de Operação
          </p>
          <p className="text-sm font-medium">{plan.operationMode}</p>
        </div>

        {/* Users */}
        <div className="mb-6">
          <p className="text-xs text-muted-foreground mb-1">Usuários</p>
          <p className="text-sm font-medium">{plan.users}</p>
        </div>

        {/* Features */}
        <div className="mb-6 flex-1">
          <p className="text-xs text-muted-foreground mb-3">Features</p>
          <div className="flex flex-wrap gap-2">
            {plan.features.map((feature) => (
              <Badge
                key={feature}
                variant="secondary"
                className="text-xs font-normal"
              >
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        {/* Edit Button */}
        <Button variant="outline" className="w-full mt-auto">
          Editar
        </Button>
      </div>
    </Card>
  );
}

export default function PlansPage() {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <header>
          <h1 className="text-3xl font-semibold">Planos</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Gerencie todos os planos da plataforma
          </p>
        </header>
        <Button className="gap-2" onClick={() => setCreateModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Adicionar Plano
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPlans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>

      {/* Create Plan Dialog */}
      <CreatePlanDialog
        open={isCreateModalOpen}
        onOpenChange={setCreateModalOpen}
      />
    </section>
  );
}
