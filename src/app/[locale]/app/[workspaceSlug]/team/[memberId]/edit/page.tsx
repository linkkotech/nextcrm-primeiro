import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { validateWorkspaceMembership } from '@/lib/workspace-validation';

interface MemberEditPageProps {
  params: Promise<{
    locale: string;
    workspaceSlug: string;
    memberId: string;
  }>;
}

export const metadata = {
  title: 'Editar Membro | NextCRM',
  description: 'Edite as informações do membro da equipe',
};

/**
 * Página de Edição do Membro da Equipe (Workspace)
 * 
 * PLACEHOLDER: Esta página será implementada com formulário de edição completo.
 * 
 * TODO:
 * - Implementar formulário com react-hook-form + Zod
 * - Criar server action para atualizar membro (role, unidades)
 * - Adicionar validações e feedback de erro
 * - Implementar permissões de acesso (work_admin/work_manager)
 */
export default async function MemberEditPage({ params }: MemberEditPageProps) {
  const { workspaceSlug, memberId } = await params;

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

  // 3. Buscar membro específico do workspace
  const member = await prisma.workspaceMember.findFirst({
    where: {
      id: memberId,
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
        },
      },
      workspaceRole: true,
    },
  });

  if (!member) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header com botão Voltar */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/app/${workspaceSlug}/team/${memberId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Membro</h1>
          <p className="text-muted-foreground">
            Atualize as informações de {member.user.name || member.user.email}
          </p>
        </div>
      </div>

      {/* Card Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Formulário em Construção</CardTitle>
          <CardDescription>
            Esta página está sendo desenvolvida e em breve terá um formulário completo de edição.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Membro:</strong> {member.user.name || member.user.email}
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Role Atual:</strong> {member.workspaceRole.name}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              <strong>Member ID:</strong> {memberId}
            </p>
            <p className="text-xs text-muted-foreground">
              A navegação está funcionando corretamente. O formulário de edição será implementado em breve.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/app/${workspaceSlug}/team/${memberId}`}>
                Cancelar e Voltar
              </Link>
            </Button>
            <Button disabled>
              Salvar Alterações (Em breve)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
