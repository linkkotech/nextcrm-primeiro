import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getAuthSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { BlockEditorClient } from "@/components/admin/templates/editor/BlockEditorClient";

/**
 * Block Editor Page - Server Component
 * 
 * Página do editor de blocos de conteúdo. Busca dados do TemplateBlock
 * via Prisma e renderiza a interface de edição com layout de 3 colunas.
 * 
 * @param params - Parâmetros dinâmicos da rota (blockId, locale)
 */
export default async function BlockEditorPage({
    params,
}: {
    params: { blockId: string; locale: string };
}) {
    const { blockId, locale } = params;

    // EDGE CASE: Validação de autenticação
    const session = await getAuthSession();
    if (!session?.user) {
        redirect(`/${locale}/sign-in`);
    }

    // EDGE CASE: Validação de permissões de admin
    const userRole = session.user.adminRole?.name;
    const isAdmin = ["super_admin", "admin", "manager"].includes(userRole || "");

    if (!isAdmin) {
        redirect(`/${locale}/app`);
    }

    // Buscar dados do bloco com relação ao template pai
    const block = await prisma.templateBlock.findUnique({
        where: { id: blockId },
        include: {
            template: {
                select: {
                    id: true,
                    name: true,
                    type: true,
                },
            },
        },
    });

    // EDGE CASE: Bloco não encontrado
    if (!block) {
        notFound();
    }

    // Buscar traduções para a UI
    const t = await getTranslations("admin.blockEditor");

    return (
        <BlockEditorClient
            block={block}
            translations={{
                canvas: t("canvas", { defaultValue: "Canvas de Edição" }),
                properties: t("properties", { defaultValue: "Painel de Propriedades" }),
                save: t("save", { defaultValue: "Salvar" }),
            }}
        />
    );
}
