"use client";

import { useState, Fragment } from "react";
import { Plus, MoreHorizontal, ChevronDown, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Mock data for digital templates
const mockTemplates = [
  {
    id: "1",
    name: "Template Padrão (Sistema)",
    type: "Perfil Digital",
    description:
      "Template padrão criado automaticamente para perfis sem template específico. Este template pode ser editado ou substituído.",
    createdAt: "06/11/2025",
  },
  {
    id: "2",
    name: "Template Profissional",
    type: "Perfil Digital",
    description: "Template profissional com design moderno e funcionalidades avançadas.",
    createdAt: "05/11/2025",
  },
  {
    id: "3",
    name: "Template Minimalista",
    type: "Perfil Digital",
    description: "Design minimalista e clean para melhor foco no conteúdo.",
    createdAt: "04/11/2025",
  },
  {
    id: "4",
    name: "Template E-commerce",
    type: "Loja Online",
    description: "Template otimizado para vendas e catálogos de produtos.",
    createdAt: "03/11/2025",
  },
  {
    id: "5",
    name: "Template Portfolio",
    type: "Portfólio",
    description: "Perfeito para artistas, fotógrafos e profissionais criativos.",
    createdAt: "02/11/2025",
  },
  {
    id: "6",
    name: "Template Corporativo",
    type: "Perfil Digital",
    description: "Design corporativo profissional para empresas e consultórios.",
    createdAt: "01/11/2025",
  },
  {
    id: "7",
    name: "Template Restaurante",
    type: "Negócio Local",
    description: "Template especializado para restaurantes e bares com menu integrado.",
    createdAt: "31/10/2025",
  },
  {
    id: "8",
    name: "Template SaaS",
    type: "Software",
    description: "Template para empresas de software com focus em conversão.",
    createdAt: "30/10/2025",
  },
];

interface Template {
  id: string;
  name: string;
  type: string;
  description: string;
  createdAt: string;
}

// ===== CARD VIEW COMPONENTS =====

interface TemplateCardProps {
  template: Template;
}

function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Card className="bg-muted/40 overflow-hidden flex flex-col h-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-base font-semibold leading-tight">{template.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{template.type}</p>
          </div>
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
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 gap-4">
        <p className="text-sm text-muted-foreground flex-1">{template.description}</p>
        <div className="bg-muted rounded h-32 flex items-center justify-center text-xs text-muted-foreground">
          Preview (em breve)
        </div>
      </CardContent>
    </Card>
  );
}

interface TemplatesCardViewProps {
  templates: Template[];
}

function TemplatesCardView({ templates }: TemplatesCardViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(templates.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTemplates = templates.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={page === currentPage}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

// ===== LIST VIEW COMPONENTS =====

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
            <p className="text-sm">{template.description}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">ID do Template</p>
            <p className="text-sm font-mono">{template.id}</p>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}

interface TemplatesListViewProps {
  templates: Template[];
}

function TemplatesListView({ templates }: TemplatesListViewProps) {
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
                <TableCell>{template.createdAt}</TableCell>
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

// ===== MAIN PAGE COMPONENT =====

export default function DigitalTemplatesPage() {
  const [view, setView] = useState<"card" | "list">("card");

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <header>
          <h1 className="text-3xl font-semibold">Templates Digitais</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Gerencie os templates digitais da plataforma
          </p>
        </header>

        <div className="flex items-center gap-3">
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(value: string) => value && setView(value as "card" | "list")}
            className="border rounded-md"
          >
            <ToggleGroupItem value="card" aria-label="Visualização em cards">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="Visualização em lista">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>

          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Criar Template
          </Button>
        </div>
      </div>

      {/* Conditional Rendering */}
      {view === "card" ? (
        <TemplatesCardView templates={mockTemplates} />
      ) : (
        <TemplatesListView templates={mockTemplates} />
      )}
    </section>
  );
}
