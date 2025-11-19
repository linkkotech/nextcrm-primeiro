import type { Prisma } from '@prisma/client';
import { getTranslations } from 'next-intl/server';
import { getUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { validateWorkspaceMembership } from '@/lib/workspace-validation';

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

  // 3. Buscar membros do workspace
  type WorkspaceMemberWithRelations = Prisma.WorkspaceMemberGetPayload<{
    include: {
      user: {
        select: {
          id: true;
          name: true;
          email: true;
          image: true;
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
  const formattedMembers = teamMembers.map((member) => ({
    id: member.id,
    name: member.user?.name || '—',
    email: member.user?.email || '—',
    role: member.workspaceRole?.name || '—',
    image: member.user?.image,
  }));

  // Para agora, renderizar JSON em vez de componente inexistente
  // TODO: Criar TeamWorkspaceClient component
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{t('workspace.team.title')}</h1>
      <p className="mt-2 text-gray-600">{t('workspace.team.description')}</p>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">{t('workspace.team.team_members')}</h2>
        {formattedMembers.length === 0 ? (
          <p className="text-gray-500">{t('workspace.team.no_members')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">{t('workspace.team.name')}</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">{t('workspace.team.email')}</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">{t('workspace.team.role')}</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">{t('workspace.team.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {formattedMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{member.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{member.email}</td>
                    <td className="border border-gray-300 px-4 py-2">{member.role}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button className="text-blue-600 hover:underline">Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
