'use client';

import { useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { TeamMemberCard } from './TeamMemberCard';
import { TeamMember } from './TeamDataTable';

const CARDS_PER_PAGE = 12;

interface TeamCardViewProps {
  data: TeamMember[];
  workspaceSlug: string;
  onEdit?: (member: TeamMember) => void;
  onDelete?: (member: TeamMember) => void;
}

/**
 * Visão em cards (grid) dos membros da equipe
 * Layout responsivo: 1 col mobile, 3 cols tablet, 6 cols desktop
 * Paginação de 12 cards por página
 * 
 * @param data - Array de membros da equipe
 * @param workspaceSlug - Slug do workspace para ações
 * @param onEdit - Callback para editar membro
 * @param onDelete - Callback para remover/ver perfil
 */
export function TeamCardView({
  data,
  workspaceSlug,
  onEdit,
  onDelete,
}: TeamCardViewProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Cálculo de paginação
  const totalPages = Math.ceil(data.length / CARDS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const endIndex = startIndex + CARDS_PER_PAGE;
  const currentMembers = data.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll para o topo da lista
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Empty state
  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhum membro encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {currentMembers.map((member) => (
          <TeamMemberCard
            key={member.id}
            member={member}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => handlePageChange(page)}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
