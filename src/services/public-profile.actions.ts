"use server";

import { prisma } from "@/lib/prisma";
import { captureLeadSchema, type CaptureLeadInput } from "@/schemas/public-profile.schemas";
import { revalidatePath } from "next/cache";

/**
 * Busca um perfil digital pelo slug.
 * Incrementa o contador de visualizações.
 */
export async function getProfileBySlug(slug: string) {
    try {
        const profile = await prisma.digitalProfile.findUnique({
            where: { slug },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                        celular: true,
                        email: true,
                    },
                },
                sourceTemplate: true,
            },
        });

        if (!profile) return null;

        // Increment view count (fire and forget, don't await to not block response)
        // Using updateMany to avoid error if record was deleted in between (though unlikely with findUnique check)
        prisma.digitalProfile.update({
            where: { id: profile.id },
            data: { views: { increment: 1 } },
        }).catch(console.error);

        return profile;
    } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        return null;
    }
}

/**
 * Captura um lead através do perfil digital.
 * Cria um novo contato no workspace do dono do perfil.
 */
export async function captureLead(data: CaptureLeadInput) {
    try {
        const validatedData = captureLeadSchema.parse(data);

        // 1. Buscar o perfil para saber o workspace e o dono
        const profile = await prisma.digitalProfile.findUnique({
            where: { id: validatedData.profileId },
            select: {
                workspaceId: true,
                userId: true,
                slug: true,
            },
        });

        if (!profile) {
            return {
                success: false,
                message: "Perfil não encontrado",
            };
        }

        // 2. Criar o contato
        await prisma.contact.create({
            data: {
                fullName: validatedData.name,
                phone: validatedData.phone,
                notes: validatedData.interest ? `Interesse: ${validatedData.interest}` : undefined,
                origin: "digital_profile",
                workspaceId: profile.workspaceId,
            },
        });

        return {
            success: true,
            message: "Contato salvo com sucesso!",
        };
    } catch (error) {
        console.error("Erro ao capturar lead:", error);
        return {
            success: false,
            message: "Erro ao salvar contato",
        };
    }
}
