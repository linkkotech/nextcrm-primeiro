import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/session";
import { TemplatesClient } from "./templates-client";
import type { Template } from "@/types/template";

interface TemplatesPageProps {
  params: {
    locale: string;
    workspaceSlug: string;
  };
}

export default async function TemplatesPage({ params }: TemplatesPageProps) {
  const { locale, workspaceSlug } = params;

  // 1. Autenticação
  const { user } = await getAuthSession();

  if (!user) {
    notFound();
  }

  // 2. Buscar workspace pelo slug
  const workspace = await prisma.workspace.findUnique({
    where: { slug: workspaceSlug },
    select: { 
      id: true, 
      name: true,
      organizationId: true,
    },
  });

  if (!workspace) {
    notFound();
  }

  // 3. Verificar se usuário pertence ao workspace
  const membership = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId: workspace.id,
      userId: user.id,
    },
    include: {
      workspaceRole: true,
    },
  });

  if (!membership && user.adminRole?.name !== "super_admin" && user.adminRole?.name !== "admin") {
    notFound();
  }

  // 4. Buscar templates (globais + workspace-específicos)
  const rawTemplates = await prisma.digitalTemplate.findMany({
    where: {
      OR: [
        { workspaceId: null },           // Templates globais (criados por admins)
        { workspaceId: workspace.id },   // Templates específicos deste workspace
      ],
    },
    select: {
      id: true,
      name: true,
      description: true,
      type: true,
      workspaceId: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // 5. Transformar para o tipo Template esperado pelos componentes
  const templates: Template[] = rawTemplates.map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    type: t.type,
    createdAt: t.createdAt,
    // Adicionar workspaceId para controle de permissões no client
    workspaceId: t.workspaceId,
  })) as Template[];

  // 6. Buscar traduções (preparação para i18n futuro)
  const t = await getTranslations({ locale, namespace: "templates" });

  return (
    <TemplatesClient 
      templates={templates} 
      workspaceId={workspace.id}
    />
  );
}
