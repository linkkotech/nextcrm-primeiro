import { prisma } from "@/lib/prisma";
import { TemplatesClient } from "@/components/admin/digital-templates/TemplatesClient";

/**
 * Página de gerenciamento de Templates Digitais (Server Component)
 * 
 * Busca apenas templates globais (workspaceId: null) criados por administradores da plataforma.
 * Templates globais estão disponíveis para todos os workspaces do sistema.
 * 
 * A página é automaticamente revalidada quando um novo template é criado
 * via revalidatePath('/admin/digital-templates') na Server Action.
 */
export default async function DigitalTemplatesPage() {
  // Busca templates globais (workspaceId = null) do banco de dados
  const templates = await prisma.digitalTemplate.findMany({
    where: { workspaceId: null },
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
