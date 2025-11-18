"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlanCard } from "@/components/admin/plans/PlanCard";
import { CreatePlanDialog } from "@/components/admin/plans/CreatePlanDialog";

interface SerializedPlan {
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
}

interface PlansPageContentProps {
  plans: SerializedPlan[];
  error: string | null;
}

/**
 * Conteúdo da página de planos - Client Component
 * Gerencia estado dos modais e interações do usuário
 */
export function PlansPageContent({ plans, error }: PlansPageContentProps) {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SerializedPlan | null>(null);

  const handleEditClick = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    if (plan) {
      setEditingPlan(plan);
    }
  };

  const handleCloseEdit = () => {
    setEditingPlan(null);
  };

  const handleCloseCreate = (open: boolean) => {
    setCreateModalOpen(open);
  };

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

      {/* Error State */}
      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
          <p>{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!error && plans.length === 0 && (
        <div className="rounded-lg border border-border p-12 text-center">
          <p className="text-muted-foreground mb-4">
            Nenhum plano criado ainda.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Comece a criar planos clicando no botão "Adicionar Plano" acima.
          </p>
        </div>
      )}

      {/* Plans Grid */}
      {!error && plans.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onEditClick={handleEditClick}
            />
          ))}
        </div>
      )}

      {/* Create Plan Dialog */}
      <CreatePlanDialog
        open={isCreateModalOpen}
        onOpenChange={handleCloseCreate}
      />

      {/* Edit Plan Dialog */}
      <CreatePlanDialog
        open={!!editingPlan}
        onOpenChange={(open) => !open && handleCloseEdit()}
        initialData={editingPlan}
        isEditMode={true}
      />
    </section>
  );
}
