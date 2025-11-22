"use server";

import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { TemplateType } from "@prisma/client";

/**
 * Creates a new Digital Template (container).
 * 
 * @param data - { name, description, type }
 * @returns The created template object or throws error.
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

    const template = await prisma.digitalTemplate.create({
        data: {
            name: data.name,
            description: data.description,
            type: data.type,
            createdByUserId: session.user.id,
        },
    });

    revalidatePath("/admin/digital-templates");
    return template;
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
