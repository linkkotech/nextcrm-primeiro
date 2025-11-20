/**
 * Componente Client para Equipe do Workspace
 * 
 * Responsabilidades:
 * - Gerenciar alternância entre visão de lista e cards
 * - Gerenciar busca com debounce
 * - Filtrar dados de membros
 * - Renderizar conteúdo conforme visão selecionada
 * - Usar useTranslations() para i18n no cliente
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useHeader } from '@/context/HeaderContext';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, List, Grid3x3 } from 'lucide-react';
import { TeamDataTable, type TeamMember } from '@/components/application/team/TeamDataTable';
import { TeamCardView } from '@/components/application/team/TeamCardView';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AddTeamMemberDialog } from '@/components/application/team/AddTeamMemberDialog';

interface TeamWorkspaceClientProps {
  data: TeamMember[];
  workspaceSlug: string;
  organizationName: string;
  availableUnits: Array<{ id: string; name: string }>;
  availableRoles: Array<{ id: string; name: string }>;
  error: string | null;
}

/**
 * Renderiza a página de equipe do workspace com suporte a múltiplas visões
 * 
 * Exemplo de uso:
 * ```tsx
 * <TeamWorkspaceClient
 *   data={formattedMembers}
 *   workspaceSlug="smarthub-workspace"
 *   organizationName="SmartHub Inc."
 *   availableUnits={[{ id: '1', name: 'Vendas' }]}
 *   availableRoles={[{ id: '1', name: 'work_admin' }]}
 *   error={null}
 * />
 * ```
 */
export function TeamWorkspaceClient({
  data,
  workspaceSlug,
  organizationName,
  availableUnits,
  availableRoles,
  error,
}: TeamWorkspaceClientProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setPrimaryTitle, setSecondaryHeaderContent } = useHeader();

  // Estados
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Debounce para atualizar URL ao digitar
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (searchTerm) {
        params.set('search', searchTerm);
      } else {
        params.delete('search');
      }
      router.replace(`${pathname}?${params.toString()}`);
    }, 300); // 300ms de delay

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, pathname, router, searchParams]);

  /**
   * Atualizar headers dinâmicos ao montar/desmontar o componente.
   * Responsável por setar título primário e conteúdo secundário (pesquisa + controles).
   */
  useEffect(() => {
    // Definir título primário
    setPrimaryTitle(t('navigation.team_members'));

    // Definir conteúdo secundário com barra de pesquisa e controles
    setSecondaryHeaderContent(
      <div className="flex w-full items-center justify-between gap-6">
        {/* Lado Esquerdo - Barra de Pesquisa */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>

        {/* Lado Direito - Toggle Group + Botão */}
        <div className="flex items-center gap-3">
          {/* Toggle Group para Visão */}
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value) => {
              if (value) setViewMode(value as 'list' | 'card');
            }}
            className="border rounded-md py-1.5 px-0 h-10"
          >
            <ToggleGroupItem value="list" aria-label="Visão de Lista" title="Visão de Lista">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="card" aria-label="Visão de Cards" title="Visão de Cards">
              <Grid3x3 className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>

          {/* Botão Adicionar Membro */}
          <Button
            className="gap-2"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            {t('workspace.team.invite_member')}
          </Button>
        </div>
      </div>
    );

    // Cleanup: Resetar headers ao desmontar
    return () => {
      setPrimaryTitle('');
      setSecondaryHeaderContent(null);
    };
  }, [setPrimaryTitle, setSecondaryHeaderContent, viewMode, searchTerm, setSearchTerm, t]);

  // Filtrar dados por busca
  const filteredData = data.filter((member) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (member.user.name?.toLowerCase().includes(searchLower)) ||
      (member.user.email?.toLowerCase().includes(searchLower))
    );
  });

  const handleEditMember = (member: TeamMember) => {
    // TODO: Implementar lógica de edição
    console.log('Editar membro:', member);
  };

  const handleDeleteMember = (member: TeamMember) => {
    // TODO: Implementar lógica de remover/ver perfil
    console.log('Remover/Ver perfil do membro:', member);
  };

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Renderização Condicional das Visões */}
      {viewMode === 'list' ? (
        <TeamDataTable
          data={filteredData}
          workspaceSlug={workspaceSlug}
        />
      ) : (
        <TeamCardView
          data={filteredData}
          workspaceSlug={workspaceSlug}
          onEdit={handleEditMember}
          onDelete={handleDeleteMember}
        />
      )}

      {/* Dialog Adicionar Membro */}
      <AddTeamMemberDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        workspaceSlug={workspaceSlug}
        organizationName={organizationName}
        availableUnits={availableUnits}
        availableRoles={availableRoles}
      />
    </div>
  );
}
