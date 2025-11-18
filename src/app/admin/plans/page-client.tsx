"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreatePlanDialog } from "@/components/admin/plans/CreatePlanDialog";
import { Plus } from "lucide-react";
import type { Plan } from "@prisma/client";

/**
 * Componente Cliente para gerenciar modais de criação/edição de planos
 * Separado do Server Component para manter interatividade
 */
export function PlansPageClient() {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  return (
    <>
      {/* Create Plan Dialog */}
      <CreatePlanDialog
        open={isCreateModalOpen}
        onOpenChange={setCreateModalOpen}
      />

      {/* Edit Plan Dialog */}
      <CreatePlanDialog
        open={!!editingPlan}
        onOpenChange={(open) => !open && setEditingPlan(null)}
        initialData={editingPlan}
        isEditMode={true}
      />
    </>
  );
}
