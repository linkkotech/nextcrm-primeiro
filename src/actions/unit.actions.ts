'use server';

import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/session";

export async function getWorkspaceUnits(workspaceSlug: string) {
    const session = await getAuthSession();

    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const workspace = await prisma.workspace.findUnique({
        where: { slug: workspaceSlug },
        select: { id: true },
    });

    if (!workspace) {
        throw new Error("Workspace not found");
    }

    // Verify if user is a member of the workspace
    const isMember = await prisma.workspaceMember.findUnique({
        where: {
            userId_workspaceId: {
                userId: session.user.id,
                workspaceId: workspace.id,
            },
        },
    });

    if (!isMember) {
        throw new Error("Unauthorized access to workspace");
    }

    const units = await prisma.unit.findMany({
        where: {
            workspaceId: workspace.id,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return units;
}

/**
 * Busca templates e endereços do workspace para população de forms
 * 
 * @param workspaceSlug - Slug do workspace
 * @returns Objeto com arrays de templates e addresses
 */
export async function getWorkspaceTemplatesAndAddresses(workspaceSlug: string) {
    const session = await getAuthSession();

    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const workspace = await prisma.workspace.findUnique({
        where: { slug: workspaceSlug },
        select: { id: true },
    });

    if (!workspace) {
        throw new Error("Workspace not found");
    }

    // Verify if user is a member of the workspace
    const isMember = await prisma.workspaceMember.findUnique({
        where: {
            userId_workspaceId: {
                userId: session.user.id,
                workspaceId: workspace.id,
            },
        },
    });

    if (!isMember) {
        throw new Error("Unauthorized access to workspace");
    }

    const [templates, addresses] = await Promise.all([
        prisma.digitalTemplate.findMany({
            where: {
                workspaceId: workspace.id,
            },
            orderBy: {
                createdAt: 'desc',
            },
        }),
        prisma.address.findMany({
            where: {
                workspaceId: workspace.id,
            },
            orderBy: {
                createdAt: 'desc',
            },
        }),
    ]);

    return { templates, addresses };
}

/**
 * Cria ou atualiza uma unidade.
 * IMPORTANTE: Garante isolamento por workspace - apenas membros do workspace podem criar/editar.
 * 
 * @param workspaceSlug - Slug do workspace
 * @param data - Dados da unidade validados pelo schema
 * 
 * @throws Error se usuário não autenticado ou não for membro do workspace
 * @returns Unidade criada/atualizada
 */
export async function upsertUnit(
    workspaceSlug: string,
    data: {
        id?: string;
        name: string;
        description?: string;
        templateId?: string | null;
        addressId?: string | null;
        isActive: boolean;
    }
) {
    const session = await getAuthSession();

    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    const workspace = await prisma.workspace.findUnique({
        where: { slug: workspaceSlug },
        select: { id: true },
    });

    if (!workspace) {
        throw new Error('Workspace not found');
    }

    // Verify if user is a member of the workspace
    const isMember = await prisma.workspaceMember.findUnique({
        where: {
            userId_workspaceId: {
                userId: session.user.id,
                workspaceId: workspace.id,
            },
        },
    });

    if (!isMember) {
        throw new Error('Unauthorized access to workspace');
    }

    const { id, ...unitData } = data;

    // Se ID existe, atualizar; senão, criar
    if (id) {
        // Verificar se a unidade pertence ao workspace antes de atualizar
        const existingUnit = await prisma.unit.findUnique({
            where: { id },
            select: { workspaceId: true },
        });

        if (!existingUnit || existingUnit.workspaceId !== workspace.id) {
            throw new Error('Unit not found or access denied');
        }

        const updatedUnit = await prisma.unit.update({
            where: { id },
            data: unitData,
        });

        return updatedUnit;
    } else {
        // Criar nova unidade
        const newUnit = await prisma.unit.create({
            data: {
                ...unitData,
                workspaceId: workspace.id,
            },
        });

        return newUnit;
    }
}

/**
 * Deleta uma unidade.
 * IMPORTANTE: Garante que apenas membros do workspace podem deletar.
 * 
 * @param workspaceSlug - Slug do workspace
 * @param unitId - ID da unidade a deletar
 * 
 * @throws Error se usuário não autenticado, não for membro, ou unidade não encontrada
 */
export async function deleteUnit(
    workspaceSlug: string,
    unitId: string
) {
    const session = await getAuthSession();

    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    const workspace = await prisma.workspace.findUnique({
        where: { slug: workspaceSlug },
        select: { id: true },
    });

    if (!workspace) {
        throw new Error('Workspace not found');
    }

    // Verify if user is a member of the workspace
    const isMember = await prisma.workspaceMember.findUnique({
        where: {
            userId_workspaceId: {
                userId: session.user.id,
                workspaceId: workspace.id,
            },
        },
    });

    if (!isMember) {
        throw new Error('Unauthorized access to workspace');
    }

    // Verificar se a unidade pertence ao workspace antes de deletar
    const unit = await prisma.unit.findUnique({
        where: { id: unitId },
        select: { workspaceId: true },
    });

    if (!unit || unit.workspaceId !== workspace.id) {
        throw new Error('Unit not found or access denied');
    }

    await prisma.unit.delete({
        where: { id: unitId },
    });
}
