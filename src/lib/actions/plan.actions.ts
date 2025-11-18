"use server";

import { prisma } from "@/lib/prisma";
import { createPlanSchema, type CreatePlanFormData } from "@/schemas/plan.schemas";
import { serializePlan } from "@/lib/serialize";
import { revalidatePath } from "next/cache";

/**
 * Cria um novo plano.
 * 
 * @param data - Dados do plano a ser criado (validado com createPlanSchema)
 * @returns Objeto com sucesso e dados do plano criado
 * @throws Error se houver problema na validação ou criação
 * 
 * @example
 * const result = await createPlan({
 *   name: "Profissional",
 *   description: "Plano para profissionais",
 *   operationMode: "Comercial",
 *   subscriptionType: "Recorrente",
 *   billingCycle: "Monthly",
 *   price: 99.90,
 *   userLimit: 50,
 *   features: ["IA", "API", "Relatórios"],
 *   isActive: true
 * });
 */
export async function createPlan(data: CreatePlanFormData) {
  try {
    // Validar dados com o Zod schema
    const validatedData = createPlanSchema.parse(data);

    // Criar o plano no banco de dados
    const newPlan = await prisma.plan.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || null,
        operationMode: validatedData.operationMode,
        subscriptionType: validatedData.subscriptionType,
        billingCycle: validatedData.billingCycle,
        price: validatedData.price,
        userLimit: validatedData.userLimit,
        features: validatedData.features, // JSON array
        isActive: validatedData.isActive,
      },
    });

    // Revalidar a página de planos para refletir as mudanças
    revalidatePath("/admin/plans");

    return {
      success: true,
      message: "Plano criado com sucesso",
      data: serializePlan(newPlan),
    };
  } catch (error) {
    console.error("Erro ao criar plano:", error);
    
    if (error instanceof Error && error.message.includes("Zod")) {
      return {
        success: false,
        message: "Dados inválidos: verifique todos os campos obrigatórios",
        error: error.message,
      };
    }

    return {
      success: false,
      message: "Falha ao criar plano. Tente novamente.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

/**
 * Busca um plano específico pelo ID.
 * 
 * @param planId - ID do plano a ser recuperado
 * @returns O plano encontrado ou null se não existir
 * @throws Error se houver problema na busca
 */
export async function getPlanById(planId: string) {
  try {
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });
    return plan;
  } catch (error) {
    console.error("Erro ao buscar plano:", error);
    throw new Error("Falha ao buscar plano");
  }
}

/**
 * Atualiza um plano existente com todos os campos.
 * 
 * @param planId - ID do plano a ser atualizado
 * @param data - Dados a serem atualizados (validado com createPlanSchema)
 * @returns Objeto com sucesso e dados do plano atualizado
 * @throws Error se houver problema na validação ou atualização
 * 
 * @example
 * const result = await updatePlan(planId, {
 *   name: "Profissional Plus",
 *   price: 149.90,
 *   userLimit: 100,
 *   isActive: true
 * });
 */
export async function updatePlan(planId: string, data: CreatePlanFormData) {
  try {
    // Validar dados com o Zod schema
    const validatedData = createPlanSchema.parse(data);

    // Verificar se o plano existe
    const existingPlan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!existingPlan) {
      return {
        success: false,
        message: "Plano não encontrado",
      };
    }

    // Atualizar o plano
    const updatedPlan = await prisma.plan.update({
      where: { id: planId },
      data: {
        name: validatedData.name,
        description: validatedData.description || null,
        operationMode: validatedData.operationMode,
        subscriptionType: validatedData.subscriptionType,
        billingCycle: validatedData.billingCycle,
        price: validatedData.price,
        userLimit: validatedData.userLimit,
        features: validatedData.features, // JSON array
        isActive: validatedData.isActive,
      },
    });

    // Revalidar a página de planos para refletir as mudanças
    revalidatePath("/admin/plans");

    return {
      success: true,
      message: "Plano atualizado com sucesso",
      data: serializePlan(updatedPlan),
    };
  } catch (error) {
    console.error("Erro ao atualizar plano:", error);

    if (error instanceof Error && error.message.includes("Zod")) {
      return {
        success: false,
        message: "Dados inválidos: verifique todos os campos obrigatórios",
        error: error.message,
      };
    }

    return {
      success: false,
      message: "Falha ao atualizar plano. Tente novamente.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}
