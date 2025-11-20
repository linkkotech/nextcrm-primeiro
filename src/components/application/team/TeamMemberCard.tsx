import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TeamMember } from './TeamDataTable';

interface TeamMemberCardProps {
  member: TeamMember;
  onEdit?: (member: TeamMember) => void;
  onDelete?: (member: TeamMember) => void;
}

/**
 * Card de apresentação do membro da equipe
 * Exibe avatar com badge de status, informações e ações
 * 
 * @param member - Dados do membro da equipe
 * @param onEdit - Callback para editar membro
 * @param onDelete - Callback para remover/ver perfil do membro
 */
export function TeamMemberCard({ member, onEdit, onDelete }: TeamMemberCardProps) {
  // Gerar iniciais para avatar fallback
  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join('');
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full text-center hover:shadow-lg transition-shadow">
      {/* Avatar Section with Badge */}
      <div className="h-32 bg-muted flex items-center justify-center p-4">
        <div className="relative">
          <Avatar className="h-20 w-20">
            <AvatarImage 
              src={member.user.image || undefined} 
              alt={member.user.name || 'Membro'} 
            />
            <AvatarFallback>{getInitials(member.user.name)}</AvatarFallback>
          </Avatar>
          <Badge className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white">
            Ativo
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardContent className="flex-1 p-4 space-y-2">
        <h3 className="font-semibold text-base text-primary line-clamp-2">
          {member.user.name || 'Sem nome'}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {member.workspaceRole.name || 'Sem cargo'}
        </p>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {member.user.unitMemberships[0]?.unit.name || 'Sem unidade'}
        </p>
        <p className="text-xs text-muted-foreground truncate hover:text-foreground" title={member.user.email || ''}>
          {member.user.email || 'Sem e-mail'}
        </p>
      </CardContent>

      {/* Footer / Actions */}
      <CardFooter className="p-3 flex gap-2 border-t bg-muted/10 mt-auto">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onEdit?.(member)}
        >
          Editar
        </Button>
        <Button
          size="sm"
          className="flex-1"
          onClick={() => onDelete?.(member)}
        >
          Ver Perfil
        </Button>
      </CardFooter>
    </Card>
  );
}
