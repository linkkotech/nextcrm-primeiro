"use client";

import { useState } from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { InviteMemberDialog } from "@/components/admin/team/InviteMemberDialog";
import { formatRoleName, ROLE_COLORS, type TeamMember } from "@/types/team";

/**
 * Componente Client que renderiza o conteúdo da página de equipe.
 * Separado do Server Component para permitir interatividade (estado, dialogs).
 * 
 * Este componente recebe os dados já buscados do servidor e apenas renderiza/interage.
 */
export function TeamContentClient({
  teamMembers,
  availableRoles,
  error,
}: {
  teamMembers: TeamMember[];
  availableRoles: { id: string; name: string }[];
  error: string | null;
}) {
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <header>
          <h1 className="text-3xl font-semibold">Equipe</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Gerencie os membros administrativos da plataforma
          </p>
        </header>
        <Button className="gap-2" onClick={() => setInviteModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Convidar Membro
        </Button>
      </div>

      {/* Card with Table */}
      <Card>
        <CardHeader>
          <CardTitle>Membros da Equipe</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {teamMembers.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                Nenhum membro da equipe encontrado.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      {member.name || "—"}
                    </TableCell>
                    <TableCell>{member.email || "—"}</TableCell>
                    <TableCell>
                      <Badge
                        className={ROLE_COLORS[member.adminRole?.name || ""]}
                      >
                        {member.adminRole
                          ? formatRoleName(member.adminRole.name)
                          : "—"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Invite Member Dialog */}
      <InviteMemberDialog
        open={isInviteModalOpen}
        onOpenChange={setInviteModalOpen}
        availableRoles={availableRoles}
      />
    </section>
  );
}
