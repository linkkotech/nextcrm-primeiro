'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreHorizontal, ChevronDown } from 'lucide-react';
import { TeamSummaryPanel } from './TeamSummaryPanel';

export interface TeamMember {
  id: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    cargo: string | null;
    celular: string | null;
    unitMemberships: Array<{
      unit: {
        id: string;
        name: string;
      };
    }>;
  };
  workspaceRole: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface TeamDataTableProps {
  data: TeamMember[];
  workspaceSlug: string;
}

/**
 * Tabela interativa de membros da equipe com linhas expansíveis.
 * Exibe informações do membro, role, unidade e status.
 * Permite expandir para ver painel de resumo com ações rápidas.
 * A busca é gerenciada pelo componente pai (TeamWorkspaceClient).
 */
export function TeamDataTable({ data, workspaceSlug }: TeamDataTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [activeStatuses, setActiveStatuses] = useState<Map<string, boolean>>(
    new Map(data.map(member => [member.id, true]))
  );

  const toggleExpanded = (memberId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(memberId)) {
      newExpanded.delete(memberId);
    } else {
      newExpanded.add(memberId);
    }
    setExpandedRows(newExpanded);
  };

  const toggleSelected = (memberId: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(memberId)) {
      newSelected.delete(memberId);
    } else {
      newSelected.add(memberId);
    }
    setSelectedRows(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map((d) => d.id)));
    }
  };

  const toggleActiveStatus = (memberId: string) => {
    const newStatus = new Map(activeStatuses);
    newStatus.set(memberId, !newStatus.get(memberId));
    setActiveStatuses(newStatus);
    // TODO: Implementar lógica de atualização no servidor
  };

  // Formatar data para formato BR (DD/MM/YYYY)
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Gerar iniciais para avatar fallback
  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join('');
  };

  // Formatar label do role com nome amigável
  const getRoleLabel = (roleName: string) => {
    const roleMap: Record<string, string> = {
      work_admin: 'Administrador',
      work_manager: 'Gerente',
      work_user: 'Usuário',
    };
    return roleMap[roleName] || roleName;
  };

  return (
    <div className="space-y-4">
      {/* Tabela */}
      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedRows.size === data.length && data.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Membro</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Ativo</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                  Nenhum membro cadastrado
                </TableCell>
              </TableRow>
            ) : (
              data.flatMap((member) => {
                const isExpanded = expandedRows.has(member.id);
                const isSelected = selectedRows.has(member.id);
                const unitName = member.user.unitMemberships[0]?.unit.name || '—';
                const isActive = activeStatuses.get(member.id) ?? true;

                const rows: React.ReactNode[] = [];

                // Linha Principal
                rows.push(
                  <TableRow key={`main-${member.id}`} className={isSelected ? 'bg-muted/50' : ''}>
                    {/* Expandir */}
                    <TableCell className="cursor-pointer" onClick={() => toggleExpanded(member.id)}>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </TableCell>

                    {/* Selecionar */}
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelected(member.id)}
                      />
                    </TableCell>

                    {/* Membro */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={member.user.image || undefined} alt={member.user.name || 'Membro'} />
                          <AvatarFallback>{getInitials(member.user.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{member.user.name || 'Sem nome'}</span>
                          {member.user.cargo && (
                            <span className="text-xs text-muted-foreground">{member.user.cargo}</span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* E-mail */}
                    <TableCell className="text-sm">{member.user.email || '—'}</TableCell>

                    {/* Telefone */}
                    <TableCell className="text-sm">{member.user.celular || '—'}</TableCell>

                    {/* Unidade */}
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {unitName}
                      </Badge>
                    </TableCell>

                    {/* Role */}
                    <TableCell>
                      <Badge variant="secondary" className="font-normal text-xs">
                        {getRoleLabel(member.workspaceRole.name)}
                      </Badge>
                    </TableCell>

                    {/* Ativo */}
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Switch
                        checked={isActive}
                        onCheckedChange={() => toggleActiveStatus(member.id)}
                      />
                    </TableCell>

                    {/* Ações */}
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Visualizar detalhes</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Remover do workspace</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );

                // Linha Expandida
                if (isExpanded) {
                  rows.push(
                    <TableRow key={`expand-${member.id}`} className="bg-muted/50 hover:bg-muted/50">
                      <TableCell colSpan={9} className="p-0">
                        <TeamSummaryPanel member={member} workspaceSlug={workspaceSlug} />
                      </TableCell>
                    </TableRow>
                  );
                }

                return rows;
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
