"use server";

import { getAuthSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { heroContentSchema } from "@/schemas/block-content.schemas";
import { BlockType } from "@prisma/client";

/**
 * Atualiza o conteúdo de um bloco de template.
 * Valida os dados com base no tipo do bloco e verifica permissões de admin.
 * 
 * @param blockId - ID do bloco a ser atualizado
 * @param blockType - Tipo do bloco (para selecionar o schema correto)
 * @param newContent - Novos dados do conteúdo
 */
export async function updateBlockContent(
    blockId: string,
    blockType: BlockType,
    newContent: unknown
) {
    try {
        // 1. Auth Check (Admin only)
        const session = await getAuthSession();
        const userRole = session?.user?.adminRole?.name;

        if (!session || !["super_admin", "admin", "manager"].includes(userRole || "")) {
            return { error: "Acesso negado. Permissão de administrador necessária." };
        }

        // 2. Validation based on Type
        let validatedContent;

        try {
            switch (blockType) {
                case "HERO":
                    validatedContent = heroContentSchema.parse(newContent);
                    break;
                // Futuros tipos:
                // case "BIO":
                //     validatedContent = bioContentSchema.parse(newContent);
                //     break;
                default:
                    // Se não tiver schema específico, aceita como está (cuidado em prod)
                    // ou lança erro. Para desenvolvimento incremental, vamos aceitar.
                    console.warn(`Schema de validação não encontrado para tipo: ${blockType}`);
                    validatedContent = newContent;
            }
        } catch (validationError) {
            console.error("Erro de validação:", validationError);
            return { error: "Dados inválidos para este tipo de bloco." };
        }

        // 3. Persistence
        await prisma.templateBlock.update({
            where: { id: blockId },
            data: {
                content: validatedContent as any // Prisma JSON type workaround
            },
        });

        // 4. Revalidate
        // Revalidar a página do editor
        revalidatePath(`/admin/editor/${blockId}`);

        // Revalidar também a página do template pai se possível, mas não temos o ID aqui facilmente
        // sem fazer outra query. O editor é o mais importante agora.

        return { success: true };

    } catch (error) {
        console.error("Erro ao atualizar bloco:", error);
        return { error: "Erro interno ao salvar alterações." };
    }
}

/**
 * Cria um novo bloco de template.
 * 
 * @param templateId - ID do template ao qual o bloco será adicionado
 * @param blockType - Tipo do bloco a ser criado
 */
export async function createTemplateBlock(
    templateId: string,
    blockType: BlockType
) {
    try {
        // 1. Auth Check (Admin only)
        const session = await getAuthSession();
        const userRole = session?.user?.adminRole?.name;

        if (!session || !["super_admin", "admin", "manager"].includes(userRole || "")) {
            return { error: "Acesso negado. Permissão de administrador necessária." };
        }

        // 2. Buscar template para validar existência
        const template = await prisma.digitalTemplate.findUnique({
            where: { id: templateId },
            select: {
                id: true,
                blocks: {
                    select: { sortOrder: true },
                    orderBy: { sortOrder: 'desc' },
                    take: 1
                }
            }
        });

        if (!template) {
            return { error: "Template não encontrado." };
        }

        // 3. Calcular próximo sortOrder
        const nextSortOrder = template.blocks.length > 0
            ? template.blocks[0].sortOrder + 1
            : 0;

        // 4. Definir conteúdo inicial baseado no tipo
        let initialContent = {};
        switch (blockType) {
            case "HERO":
                initialContent = {
                    title: "Novo Hero",
                    subtitle: "Descrição do hero",
                    backgroundColor: "#ffffff"
                };
                break;
            default:
                initialContent = {};
        }

        // 5. Criar bloco
        const newBlock = await prisma.templateBlock.create({
            data: {
                templateId,
                type: blockType,
                content: initialContent,
                sortOrder: nextSortOrder,
                isActive: true
            }
        });

        // 6. Revalidate
        revalidatePath(`/admin/digital-templates/${templateId}`);
        revalidatePath("/admin/digital-templates");

        return { success: true, blockId: newBlock.id };

    } catch (error) {
        console.error("Erro ao criar bloco:", error);
        return { error: "Erro interno ao criar bloco." };
    }
}
