import type { Prisma } from '@prisma/client';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { validateWorkspaceMembership } from '@/lib/workspace-validation';
import { MemberDetailsClient } from './member-details-client';

interface MemberDetailsPageProps {
  params: Promise<{
    locale: string;
    workspaceSlug: string;
    memberId: string;
  }>;
}

export const metadata = {
  title: 'Detalhes do Membro | NextCRM',
  description: 'Visualize e edite os detalhes do membro da equipe',
};

export default async function MemberDetailsPage({ params }: MemberDetailsPageProps) {
  const { workspaceSlug, memberId } = await params;
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

  // 3. Buscar membro específico do workspace com validação de segurança multi-tenant
  type WorkspaceMemberWithRelations = Prisma.WorkspaceMemberGetPayload<{
    include: {
      user: {
        select: {
          id: true;
          name: true;
          email: true;
          image: true;
          cargo: true;
          celular: true;
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
      createdAt: true;
    };
  }>;

  const member: WorkspaceMemberWithRelations | null = await prisma.workspaceMember.findFirst({
    where: {
      id: memberId,
      workspaceId: workspace.id, // ⚠️ CRITICAL: Multi-tenant isolation
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
  });

  // 4. Validação de segurança: retornar 404 se membro não pertencer ao workspace
  if (!member) {
    notFound();
  }

  // 5. Formatar dados para o cliente
  const memberData = {
    id: member.id,
    name: member.user.name,
    email: member.user.email,
    image: member.user.image,
    cargo: member.user.cargo,
    celular: member.user.celular,
    role: member.workspaceRole.name,
    units: member.user.unitMemberships.map((um) => um.unit.name),
    createdAt: member.createdAt,
  };

  return (
    <MemberDetailsClient
      member={memberData}
      workspaceSlug={workspaceSlug}
    />
  );
}
