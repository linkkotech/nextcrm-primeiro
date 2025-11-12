"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Template {
  id: string;
  name: string;
  description: string | null;
  type: string;
  createdAt: Date;
}

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
        <p className="text-sm text-muted-foreground flex-1">
          {template.description || "Sem descrição"}
        </p>
        
        {/* Preview Image */}
        <div className="bg-muted rounded h-32 flex items-center justify-center text-xs text-muted-foreground">
          Preview (em breve)
        </div>

        {/* Footer: Data (esquerda) + Tag (direita) */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
          <span className="text-xs text-muted-foreground">
            Criado em: {new Date(template.createdAt).toLocaleDateString("pt-BR")}
          </span>
          <Badge variant="secondary" className="text-xs">
            {template.type}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

interface TemplatesCardViewProps {
  templates: Template[];
}

export function TemplatesCardView({ templates }: TemplatesCardViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(templates.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTemplates = templates.slice(startIndex, endIndex);

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Nenhum template encontrado. Crie um novo!
        </p>
      </div>
    );
  }

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
