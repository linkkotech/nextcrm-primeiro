"use server";

import { getAuthSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { blockContentSchema, BlockContent } from "@/schemas/editor.schemas";
import { ZodError } from "zod";

/**
 * Page Builder Server Actions
 * 
 * Actions para salvar e gerenciar o conteúdo completo de um TemplateBlock
 * usando a arquitetura de Page Builder com elements[] e metadata.
 */

/**
 * Salva o conteúdo completo de um TemplateBlock (Page Builder)
 * 
 * Valida toda a estrutura elements[] + metadata e atualiza o banco.
 * Esta é a ÚNICA Server Action necessária para o Page Builder.
 * 
 * @param blockId - ID do bloco a ser atualizado
 * @param content - Objeto BlockContent completo { elements, metadata }
 * @returns { success: true } ou { error: string, zodError?: ... }
 */
export async function saveBlockContent(
    blockId: string,
    content: BlockContent
) {
    console.log("🚀 [saveBlockContent] Iniciando salvamento...");
    console.log("📦 Block ID:", blockId);
    console.log("📊 Total de elementos:", content?.elements?.length || 0);
    console.log("📝 Metadados:", content?.metadata);
    console.log("🔍 Conteúdo completo:", JSON.stringify(content, null, 2));
    
    try {
        // 1. Auth Check (Admin only)
        const session = await getAuthSession();
        const userRole = session?.user?.adminRole?.name;

        if (!session || !["super_admin", "admin", "manager"].includes(userRole || "")) {
            return { error: "Acesso negado. Permissão de administrador necessária." };
        }

        // 2. Validation using blockContentSchema
        let validatedContent: BlockContent;
        
        try {
            validatedContent = blockContentSchema.parse(content);
            console.log("✅ [saveBlockContent] Validação Zod passou!");
        } catch (error) {
            if (error instanceof ZodError) {
                const flattenedErrors = error.flatten();
                console.error("❌ [saveBlockContent] Erro de validação Zod:", flattenedErrors);
                console.error("Dados recebidos:", JSON.stringify(content, null, 2));
                return {
                    error: "Estrutura de dados inválida. Verifique os elementos e metadados.",
                    zodError: flattenedErrors,
                    fieldErrors: flattenedErrors.fieldErrors,
                };
            }
            throw error;
        }

        // 3. Persistence - Atualiza APENAS o campo content
        console.log("💾 [saveBlockContent] Salvando no banco de dados...");
        const updatedBlock = await prisma.templateBlock.update({
            where: { id: blockId },
            data: {
                content: validatedContent as any, // Prisma JSON type workaround
            },
        });
        console.log("✅ [saveBlockContent] Salvo com sucesso!");
        console.log("📄 Bloco atualizado:", updatedBlock.id);

        // 4. Revalidate
        revalidatePath(`/admin/editor/${blockId}`);
        console.log("🔄 [saveBlockContent] Cache revalidado");

        return { success: true };

    } catch (error) {
        console.error("Erro ao salvar conteúdo do bloco:", error);
        return { error: "Erro interno ao salvar alterações." };
    }
}

/**
 * Cria um novo TemplateBlock com estrutura Page Builder vazia
 * 
 * @param templateId - ID do template ao qual o bloco será adicionado
 * @returns { success: true, blockId: string } ou { error: string }
 */
export async function createPageBuilderBlock(
    templateId: string
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

        // 4. Conteúdo inicial Page Builder (canvas vazio)
        const initialContent: BlockContent = {
            elements: [],
            metadata: {
                name: "Novo Bloco",
                description: ""
            }
        };

        // 5. Criar bloco (Page Builder não define type, apenas elements)
        const newBlock = await prisma.templateBlock.create({
            data: {
                templateId,
                type: null as any, // TEMP: Aguardando prisma generate para reconhecer BlockType?
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
        console.error("Erro ao criar bloco Page Builder:", error);
        return { error: "Erro interno ao criar bloco." };
    }
}
