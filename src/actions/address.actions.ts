'use server';

import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/session";

export async function getWorkspaceAddresses(workspaceSlug: string) {
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

    const addresses = await prisma.address.findMany({
        where: {
            workspaceId: workspace.id,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return addresses;
}

/**
 * Cria ou atualiza um endereço.
 * IMPORTANTE: Garante isolamento por workspace - apenas membros do workspace podem criar/editar.
 * 
 * @param workspaceSlug - Slug do workspace
 * @param data - Dados do endereço validados pelo schema
 * 
 * @throws Error se usuário não autenticado ou não for membro do workspace
 * @returns Endereço criado/atualizado
 */
export async function upsertAddress(
    workspaceSlug: string,
    data: {
        id?: string;
        name: string;
        label?: string;
        street: string;
        number: string;
        complement?: string;
        district: string;
        city: string;
        stateCode: string;
        country: string;
        postalCode: string;
        type: 'comercial' | 'residencial';
        isActive: boolean;
        latitude?: number;
        longitude?: number;
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

    const { id, ...addressData } = data;

    // Se ID existe, atualizar; senão, criar
    if (id) {
        // Verificar se o endereço pertence ao workspace antes de atualizar
        const existingAddress = await prisma.address.findUnique({
            where: { id },
            select: { workspaceId: true },
        });

        if (!existingAddress || existingAddress.workspaceId !== workspace.id) {
            throw new Error('Address not found or access denied');
        }

        const updatedAddress = await prisma.address.update({
            where: { id },
            data: addressData,
        });

        return updatedAddress;
    } else {
        // Criar novo endereço
        const newAddress = await prisma.address.create({
            data: {
                ...addressData,
                workspaceId: workspace.id,
                createdById: session.user.id,
            },
        });

        return newAddress;
    }
}
