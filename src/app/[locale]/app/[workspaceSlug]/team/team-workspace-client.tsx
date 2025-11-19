/**
 * Componente Client para Equipe do Workspace
 * 
 * Responsabilidades:
 * - Renderizar UI da lista de membros
 * - Gerenciar estado local (modals, dialogs)
 * - Interatividade (botões, dropdowns)
 * - Usar useTranslations() para i18n no cliente
 * 
 * Props vêm do Server Component (page.tsx)
 */

"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
}

interface TeamWorkspaceClientProps {
  members: TeamMember[];
  workspaceSlug: string;
  error: string | null;
  locale: string;
}

/**
 * Renderiza a página de equipe do workspace com i18n
 * 
 * Exemplo de uso:
 * ```tsx
 * <TeamWorkspaceClient
 *   members={formattedMembers}
 *   workspaceSlug="smarthub-workspace"
 *   error={null}
 *   locale="pt"
 * />
 * ```
 */
export function TeamWorkspaceClient({
  members,
  error,
}: TeamWorkspaceClientProps) {
  const t = useTranslations();

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <header>
          <h1 className="text-3xl font-semibold">
            {t("workspace.team.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {t("workspace.team.description")}
          </p>
        </header>
        <Button
          className="gap-2"
          disabled
          title="Funcionalidade em desenvolvimento"
        >
          <Plus className="h-4 w-4" />
          {t("workspace.team.invite_member")}
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t("workspace.team.team_members")}</CardTitle>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                {t("workspace.team.no_members")}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("workspace.team.name")}</TableHead>
                  <TableHead>{t("workspace.team.email")}</TableHead>
                  <TableHead>{t("workspace.team.role")}</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      {member.name}
                    </TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>
                      {/* TODO: Adicionar dropdown de ações (editar, remover) */}
                      <span className="text-xs text-muted-foreground">
                        -
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* TODO: Implementar InviteMemberDialog com i18n */}
    </section>
  );
}
