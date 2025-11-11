"use client";

import { Fragment, useState } from "react";
import { Search, Plus, MoreHorizontal, ChevronDown, User, FilePen, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateClientDialog } from "@/components/admin/clients/CreateClientDialog";

// Mock data for workspaces
const mockWorkspaces = [
  {
    id: "1",
    name: "Tech Solutions",
    type: "Pessoa Jurídica",
    document: "12.345.678/0001-90",
    adminName: "João Silva",
    adminEmail: "joao@techsolutions.com",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Digital Marketing Pro",
    type: "Pessoa Jurídica",
    document: "98.765.432/0001-10",
    adminName: "Maria Santos",
    adminEmail: "maria@digitalmarket.com",
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    name: "Consulting Group",
    type: "Pessoa Jurídica",
    document: "45.678.901/0001-23",
    adminName: "Carlos Oliveira",
    adminEmail: "carlos@consulting.com",
    createdAt: "2024-03-10",
  },
  {
    id: "4",
    name: "Creative Studio",
    type: "Pessoa Física",
    document: "123.456.789-00",
    adminName: "Ana Costa",
    adminEmail: "ana@creativestudio.com",
    createdAt: "2024-01-25",
  },
  {
    id: "5",
    name: "Enterprise Systems",
    type: "Pessoa Jurídica",
    document: "11.222.333/0001-44",
    adminName: "Roberto Ferreira",
    adminEmail: "roberto@enterprise.com",
    createdAt: "2024-03-05",
  },
];

interface ClientDetailsRowProps {
  workspace: typeof mockWorkspaces[0];
}

function ClientDetailsRow({ workspace }: ClientDetailsRowProps) {
  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Nome do Workspace</p>
          <p className="text-sm font-semibold">{workspace.name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Tipo</p>
          <p className="text-sm font-semibold">{workspace.type}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Documento</p>
          <p className="text-sm font-semibold">{workspace.document}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Proprietário</p>
          <p className="text-sm font-semibold">{workspace.adminName}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">E-mail do Proprietário</p>
          <p className="text-sm font-semibold">{workspace.adminEmail}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Criado em</p>
          <p className="text-sm font-semibold">
            {new Date(workspace.createdAt).toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t">
        <Button variant="outline" size="sm" className="gap-2">
          <ExternalLink className="h-4 w-4" />
          Abrir Detalhes
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <FilePen className="h-4 w-4" />
          Editar Workspace
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <User className="h-4 w-4" />
          Logar como Admin
        </Button>
      </div>
    </div>
  );
}

export default function ClientsPage() {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(mockWorkspaces.map((w) => w.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
  };

  const isAllSelected =
    selectedRows.size === mockWorkspaces.length && mockWorkspaces.length > 0;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <header>
          <h1 className="text-3xl font-semibold">Lista de Workspaces</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Gerencie todos os clientes e seus workspaces
          </p>
        </header>
        <Button className="gap-2" onClick={() => setCreateModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Adicionar Cliente
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar workspace..."
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Selecionar todos"
                />
              </TableHead>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>Workspace</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Administrador</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="w-[64px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockWorkspaces.map((workspace) => (
              <Fragment key={workspace.id}>
                <TableRow>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(workspace.id)}
                      onCheckedChange={(checked) =>
                        handleSelectRow(workspace.id, !!checked)
                      }
                      aria-label={`Selecionar ${workspace.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        setExpandedRowId(
                          expandedRowId === workspace.id ? null : workspace.id
                        )
                      }
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          expandedRowId === workspace.id ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{workspace.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {workspace.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {workspace.document}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <p className="font-medium text-sm">{workspace.adminName}</p>
                      <p className="text-xs text-muted-foreground">
                        {workspace.adminEmail}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(workspace.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                {expandedRowId === workspace.id && (
                  <TableRow>
                    <TableCell colSpan={8} className="p-0">
                      <ClientDetailsRow workspace={workspace} />
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create Client Modal */}
      <CreateClientDialog
        open={isCreateModalOpen}
        onOpenChange={setCreateModalOpen}
      />
    </section>
  );
}
