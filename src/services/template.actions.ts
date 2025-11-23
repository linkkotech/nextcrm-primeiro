"use server";

import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { TemplateType, BlockType } from "@prisma/client";

/**
 * Creates a new Digital Template (container).
 * 
 * Para type='content_block':
 * - Cria automaticamente o primeiro TemplateBlock
 * - Retorna { template, firstBlockId } para redirecionar ao Block Editor
 * 
 * Para outros types:
 * - Retorna { template, firstBlockId: null }
 * - Cliente deve redirecionar para Template Editor
 * 
 * @param data - { name, description, type }
 * @returns Object with template and optional firstBlockId
 */
export async function createDigitalTemplate(data: {
    name: string;
    description?: string;
    type: TemplateType;
}) {
    const session = await getAuthSession();
    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    // Criar o template
    const template = await prisma.digitalTemplate.create({
        data: {
            name: data.name,
            description: data.description,
            type: data.type,
            createdByUserId: session.user.id,
        },
    });

    let firstBlockId: string | null = null;

    // LÓGICA ESPECIAL: Para content_block, criar o primeiro TemplateBlock automaticamente
    if (data.type === 'content_block') {
        const initialContent = {
            elements: [],
            metadata: {
                name: data.name,
                description: data.description || undefined,
            },
        };

        const block = await prisma.templateBlock.create({
            data: {
                type: 'SECTION' as BlockType, // Tipo padrão para content_blocks
                content: initialContent,
                sortOrder: 0,
                templateId: template.id,
            },
        });

        firstBlockId = block.id;
    }

    revalidatePath("/admin/digital-templates");
    
    return { 
        template, 
        firstBlockId, // null para profile_template, blockId para content_block
    };
}

/**
 * Fetches all Digital Templates.
 * 
 * @returns Array of templates with creator info and counts.
 */
export async function getDigitalTemplates() {
    const session = await getAuthSession();
    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const templates = await prisma.digitalTemplate.findMany({
        include: {
            createdByUser: {
                select: {
                    name: true,
                    email: true,
                },
            },
            blocks: {
                take: 1,
                select: {
                    id: true,
                },
            },
            usedInProfiles: {
                select: {
                    id: true,
                },
            },
            _count: {
                select: {
                    blocks: true,
                    usedInProfiles: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return templates;
}

/**
 * Fetches a single Digital Template by ID, including its blocks.
 * 
 * @param id - Template ID
 * @returns Template object with blocks or null.
 */
export async function getDigitalTemplateById(id: string) {
    const session = await getAuthSession();
    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const template = await prisma.digitalTemplate.findUnique({
        where: { id },
        include: {
            blocks: {
                orderBy: {
                    sortOrder: "asc",
                },
            },
        },
    });

    return template;
}
