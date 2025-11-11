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

// Mock data for team members
const mockTeamMembers = [
  {
    id: "1",
    name: "Marcelo Dias",
    email: "marcelo@linkko.tech",
    role: "super_admin",
  },
  {
    id: "2",
    name: "Ana Silva",
    email: "ana.silva@linkko.tech",
    role: "admin",
  },
  {
    id: "3",
    name: "João Santos",
    email: "joao.santos@linkko.tech",
    role: "manager",
  },
  {
    id: "4",
    name: "Maria Oliveira",
    email: "maria.oliveira@linkko.tech",
    role: "admin",
  },
  {
    id: "5",
    name: "Carlos Ferreira",
    email: "carlos.ferreira@linkko.tech",
    role: "manager",
  },
];

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

function getRoleBadgeVariant(role: string): "default" | "secondary" | "destructive" {
  switch (role) {
    case "super_admin":
      return "destructive";
    case "admin":
      return "default";
    default:
      return "secondary";
  }
}

function getRoleLabel(role: string): string {
  switch (role) {
    case "super_admin":
      return "Super Admin";
    case "admin":
      return "Admin";
    case "manager":
      return "Manager";
    default:
      return role;
  }
}

export default function TeamPage() {
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
              {mockTeamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(member.role)}>
                      {getRoleLabel(member.role)}
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
        </CardContent>
      </Card>

      {/* Invite Member Dialog */}
      <InviteMemberDialog
        open={isInviteModalOpen}
        onOpenChange={setInviteModalOpen}
      />
    </section>
  );
}
