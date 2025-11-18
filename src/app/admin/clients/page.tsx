import { prisma } from '@/lib/prisma';
import { serializePlans } from '@/lib/serialize';
import { ClientsPageClient } from './ClientsPageClient';

/**
 * Serializa dados de clientes para remover Decimal e outras propriedades não-serializáveis.
 * Necessário para passar dados de Server Component para Client Component.
 */
function serializeClients(clients: any[]) {
  return clients.map((client) => ({
    id: client.id,
    name: client.name,
    email: client.email,
    image: client.image,
    createdAt: client.createdAt,
    workspaceMemberships: client.workspaceMemberships.map((membership: any) => ({
      workspace: {
        id: membership.workspace.id,
        name: membership.workspace.name,
        slug: membership.workspace.slug,
        subscription: {
          status: membership.workspace.subscription.status,
          plan: {
            id: membership.workspace.subscription.plan.id,
            name: membership.workspace.subscription.plan.name,
            price: Number(membership.workspace.subscription.plan.price), // Converter Decimal para number
          },
        },
      },
      workspaceRole: {
        id: membership.workspaceRole.id,
        name: membership.workspaceRole.name,
      },
    })),
  }));
}

/**
 * Página de listagem de clientes (Server Component).
 * Responsabilidade: Buscar dados do banco de dados com filtros aplicados.
 * O componente ClientsPageClient fica responsável pela renderização e headers dinâmicos.
 * 
 * @param searchParams - Parâmetros de URL incluindo termo de busca
 */
export default async function ClientsPage({ 
  searchParams 
}: { 
  searchParams?: Promise<{ search?: string }> 
}) {
  // Await searchParams conforme required no Next.js 15
  const params = await searchParams;
  const searchTerm = params?.search || '';

  // Buscar clientes com todos os dados aninhados (workspace, role, plano)
  const rawClients = await prisma.user.findMany({
    where: {
      adminRoleId: null,  // Apenas usuários que NÃO são membros da equipe
      deletedAt: null,    // Excluir usuários deletados (soft delete)
      // Filtro de busca por nome (case-insensitive)
      ...(searchTerm && {
        name: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      }),
    },
    include: {
      workspaceMemberships: {
        include: {
          workspace: {
            include: {
              subscription: {
                include: {
                  plan: true,
                },
              },
            },
          },
          workspaceRole: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Serializar dados para passagem ao Client Component
  const clients = serializeClients(rawClients);

  // Buscar planos ativos disponíveis para assinatura
  const dbPlans = await prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" },
  });
  
  const availablePlans = serializePlans(dbPlans);

  // Passar dados serializados para o Client Component com termo de busca inicial
  return <ClientsPageClient clients={clients} availablePlans={availablePlans} initialSearch={searchTerm} />;
}
