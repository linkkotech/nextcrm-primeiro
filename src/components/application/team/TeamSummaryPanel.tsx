import { TeamMember } from './TeamDataTable';

interface TeamSummaryPanelProps {
  member: TeamMember;
  workspaceSlug: string;
}

/**
 * Painel de resumo e detalhes adicionais do membro da equipe.
 * Exibido quando uma linha é expandida na TeamDataTable.
 * 
 * @param member - Dados do membro da equipe
 * @param workspaceSlug - Slug do workspace para ações
 */
export function TeamSummaryPanel({ member, workspaceSlug }: TeamSummaryPanelProps) {
  return (
    <div className="p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="font-semibold text-sm">Informações do Membro</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Nome:</span>
            <p className="font-medium">{member.user.name || '—'}</p>
          </div>
          <div>
            <span className="text-muted-foreground">E-mail:</span>
            <p className="font-medium">{member.user.email || '—'}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Role:</span>
            <p className="font-medium">{member.workspaceRole.name}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Unidade:</span>
            <p className="font-medium">
              {member.user.unitMemberships[0]?.unit.name || '—'}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t space-y-2">
        <p className="text-xs text-muted-foreground">
          ID do Membro: <code className="bg-muted px-2 py-1 rounded text-xs">{member.id}</code>
        </p>
        <p className="text-xs text-muted-foreground">
          Criado em: {new Date(member.createdAt).toLocaleDateString('pt-BR')}
        </p>
      </div>

      {/* Placeholder para ações futuras */}
      <div className="pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          Ações adicionais serão adicionadas em breve.
        </p>
      </div>
    </div>
  );
}
