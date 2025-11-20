import type { Prisma } from '@prisma/client';
import { getTranslations } from 'next-intl/server';
import { getUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { validateWorkspaceMembership } from '@/lib/workspace-validation';
import { TeamWorkspaceClient } from './team-workspace-client';
import { type TeamMember } from '@/components/application/team/TeamDataTable';

interface TeamPageProps {
  params: Promise<{
    locale: string;
    workspaceSlug: string;
  }>;
}

export const metadata = {
  title: 'Equipe | NextCRM',
  description: 'Gerencie os membros do seu workspace',
};

export default async function TeamPage({ params }: TeamPageProps) {
  const { workspaceSlug } = await params;
  const t = await getTranslations();

  // 1. Validar autenticação
  const user = await getUser();
  if (!user) {
    throw new Error('Unauthorized: User not authenticated');
  }

  // 2. Validar membership no workspace
  const validationResult = await validateWorkspaceMembership(
    user.id,
    workspaceSlug
  );

  if (!validationResult || !validationResult.isMember) {
    throw new Error('Unauthorized: User not a member of this workspace');
  }

  const workspace = validationResult.workspace;

  // 3. Buscar organização e unidades do workspace
  const workspaceWithDetails = await prisma.workspace.findUnique({
    where: { id: workspace.id },
    select: {
      organization: {
        select: {
          name: true,
        },
      },
      units: {
        where: { isActive: true },
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: 'asc',
        },
      },
    },
  });

  const organizationName = workspaceWithDetails?.organization?.name || '';
  const availableUnits = workspaceWithDetails?.units || [];

  // 3.1. Buscar roles disponíveis para o workspace
  const availableRoles = await prisma.workspaceRole.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  // 4. Buscar membros do workspace
  type WorkspaceMemberWithRelations = Prisma.WorkspaceMemberGetPayload<{
    include: {
      user: {
        select: {
          id: true;
          name: true;
          email: true;
          image: true;
          unitMemberships: {
            select: {
              unit: {
                select: {
                  id: true;
                  name: true;
                };
              };
            };
          };
        };
      };
      workspaceRole: true;
    };
  }>;

  let teamMembers: WorkspaceMemberWithRelations[] = [];
  let error: string | null = null;

  try {
    teamMembers = await prisma.workspaceMember.findMany({
      where: {
        workspaceId: workspace.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            cargo: true,
            celular: true,
            unitMemberships: {
              select: {
                unit: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        workspaceRole: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (err: unknown) {
    console.error('[TeamPage] Erro ao buscar membros:', err);
    error = t('workspace.team.error') || 'Erro ao carregar membros da equipe';
  }

  // Transformar dados para o cliente
  const formattedMembers: TeamMember[] = teamMembers.map((member) => ({
    id: member.id,
    user: {
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
      image: member.user.image,
      cargo: member.user.cargo,
      celular: member.user.celular,
      unitMemberships: member.user.unitMemberships,
    },
    workspaceRole: member.workspaceRole,
    createdAt: member.createdAt,
    updatedAt: member.updatedAt,
  }));

  return (
    <TeamWorkspaceClient
      data={formattedMembers}
      workspaceSlug={workspaceSlug}
      organizationName={organizationName}
      availableUnits={availableUnits}
      availableRoles={availableRoles}
      error={error}
    />
  );
}
