import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlanCard } from "@/components/admin/plans/PlanCard";
import { prisma } from "@/lib/prisma";
import { serializePlans } from "@/lib/serialize";
import { PlansPageContent } from "./plans-content";

/**
 * Página de listagem de planos - Server Component
 * Busca dados reais do banco de dados via Prisma
 */
export default async function PlansPage() {
  let plans: any[] = [];
  let error = null;

  try {
    // Buscar todos os planos ordenados por data de criação (mais recentes primeiro)
    const dbPlans = await prisma.plan.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    
    // Serializar planos removendo tipos não-serializáveis
    plans = serializePlans(dbPlans);
  } catch (err) {
    console.error("Erro ao buscar planos:", err);
    error = "Não foi possível carregar os planos. Tente novamente mais tarde.";
  }

  return (
    <PlansPageContent plans={plans} error={error} />
  );
}
