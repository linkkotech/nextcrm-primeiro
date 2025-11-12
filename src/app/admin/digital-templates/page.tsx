import { prisma } from "@/lib/prisma";
import { TemplatesClient } from "@/components/admin/digital-templates/TemplatesClient";

/**
 * Página de gerenciamento de Templates Digitais (Server Component)
 * 
 * Busca templates globais (sem associação a workspaces específicos) do banco.
 * Templates globais são aqueles que não possuem registros em WorkspaceTemplate,
 * tornando-os disponíveis para toda a plataforma.
 * 
 * A página é automaticamente revalidada quando um novo template é criado
 * via revalidatePath('/admin/digital-templates') na Server Action.
 */
export default async function DigitalTemplatesPage() {
  // Busca todos os templates do banco de dados
  // NOTA: Type assertion temporária até regeneração do Prisma Client
  const templates = await (prisma as any).digitalTemplate.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      description: true,
      type: true,
      createdAt: true,
    },
  });

  return <TemplatesClient templates={templates} />;
}
