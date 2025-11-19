"use client";

import { useState, Fragment } from "react";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface Template {
  id: string;
  name: string;
  description: string | null;
  type: string;
  createdAt: Date;
}

interface TemplateDetailsRowProps {
  template: Template;
}

function TemplateDetailsRow({ template }: TemplateDetailsRowProps) {
  return (
    <TableRow className="bg-muted/50">
      <TableCell colSpan={6} className="py-4">
        <div className="space-y-3 pl-6">
          <div>
            <p className="text-xs text-muted-foreground">Descrição</p>
            <p className="text-sm">{template.description || "Sem descrição"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">ID do Template</p>
            <p className="text-sm font-mono">{template.id}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Data de Criação</p>
            <p className="text-sm">{new Date(template.createdAt).toLocaleString("pt-BR")}</p>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}

interface TemplatesListViewProps {
  templates: Template[];
}

export function TemplatesListView({ templates }: TemplatesListViewProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const handleSelectAll = () => {
    if (selectedRows.size === templates.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(templates.map((t) => t.id)));
    }
  };

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const toggleExpand = (id: string) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  if (templates.length === 0) {
    return (
      <div className="border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">
          Nenhum template encontrado. Crie um novo!
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedRows.size === templates.length && templates.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="w-10"></TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
            <Fragment key={template.id}>
              <TableRow>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.has(template.id)}
                    onCheckedChange={() => handleSelectRow(template.id)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => toggleExpand(template.id)}
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        expandedRowId === template.id ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{template.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{template.type}</Badge>
                </TableCell>
                <TableCell>{new Date(template.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Duplicar</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Remover</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
              {expandedRowId === template.id && (
                <TemplateDetailsRow template={template} />
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
