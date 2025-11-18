'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreHorizontal, ChevronDown, Search } from 'lucide-react';
import { ClientSummaryPanel } from './ClientSummaryPanel';

export interface Client {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: Date;
  workspaceMemberships: Array<{
    workspace: {
      id: string;
      name: string;
      slug: string;
      subscription: {
        status: string;
        plan: {
          id: string;
          name: string;
          price: number;
        };
      };
    };
    workspaceRole: {
      id: string;
      name: string;
    };
  }>;
}

interface ClientsDataTableProps {
  data: Client[];
  initialSearch?: string;
}

/**
 * Tabela interativa de clientes com linhas expansíveis e busca por nome.
 * Exibe informações do cliente, workspace, role e plano.
 * Permite expandir para ver painel de resumo com ações rápidas.
 * Implementa busca com debounce para otimizar atualizações de URL.
 */
export function ClientsDataTable({ data, initialSearch = '' }: ClientsDataTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState(initialSearch);

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

  const toggleExpanded = (clientId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(clientId)) {
      newExpanded.delete(clientId);
    } else {
      newExpanded.add(clientId);
    }
    setExpandedRows(newExpanded);
  };

  const toggleSelected = (clientId: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(clientId)) {
      newSelected.delete(clientId);
    } else {
      newSelected.add(clientId);
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

  return (
    <div className="space-y-4">
      {/* Campo de Busca */}
      <div className="relative w-fit">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Pesquisar por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 max-w-sm bg-white"
        />
      </div>

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
              <TableHead>Cliente</TableHead>
              <TableHead>Workspace</TableHead>
              <TableHead>Role</TableHead>
            <TableHead>Plano</TableHead>
            <TableHead>Data de Cadastro</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                Nenhum cliente cadastrado
              </TableCell>
            </TableRow>
          ) : (
            data.flatMap((client) => {
              const membership = client.workspaceMemberships[0];
              const workspace = membership?.workspace;
              const plan = workspace?.subscription.plan;
              const isExpanded = expandedRows.has(client.id);
              const isSelected = selectedRows.has(client.id);

              const rows: React.ReactNode[] = [];

              // Linha Principal
              rows.push(
                <TableRow key={`main-${client.id}`} className={isSelected ? 'bg-muted/50' : ''}>
                  {/* Expandir */}
                  <TableCell className="cursor-pointer" onClick={() => toggleExpanded(client.id)}>
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
                      onCheckedChange={() => toggleSelected(client.id)}
                    />
                  </TableCell>

                  {/* Cliente */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={client.image || undefined} alt={client.name || 'Cliente'} />
                        <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{client.name || 'Sem nome'}</span>
                        <span className="text-xs text-muted-foreground">{client.email || 'Sem e-mail'}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Workspace */}
                  <TableCell>
                    {workspace ? (
                      <Badge variant="outline" className="font-normal">
                        {workspace.name}
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  {/* Role */}
                  <TableCell>
                    {membership ? (
                      <Badge variant="secondary" className="font-normal">
                        {membership.workspaceRole.name}
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  {/* Plano */}
                  <TableCell>
                    {plan ? (
                      <Badge variant="outline" className="font-normal">
                        {plan.name}
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  {/* Data de Cadastro */}
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(client.createdAt)}
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
                        <DropdownMenuItem className="text-destructive">Deletar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );

              // Linha Expandida
              if (isExpanded) {
                rows.push(
                  <TableRow key={`expand-${client.id}`} className="bg-muted/50 hover:bg-muted/50">
                    <TableCell colSpan={8} className="p-0">
                      <ClientSummaryPanel client={client} />
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
