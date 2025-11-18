import { prisma } from "@/lib/prisma";
import { type TeamMember } from "@/types/team";
import { TeamContentClient } from "./team-content-client";

/**
 * Página de gerenciamento de Equipe Administrativa.
 * 
 * Server Component que busca dados do banco de dados.
 * Filtra por deletedAt: null para excluir usuários "deletados" (soft delete).
 */
export default async function TeamPage() {
  let teamMembers: TeamMember[] = [];
  let availableRoles: { id: string; name: string }[] = [];
  let error: string | null = null;

  try {
    // Buscar usuários administrativos do banco de dados
    const dbTeamMembers = await prisma.user.findMany({
      where: {
        adminRoleId: {
          not: null, // Apenas usuários que TÊM uma AdminRole
        },
        deletedAt: null, // Excluir usuários deletados (soft delete)
      },
      include: {
        adminRole: true, // Incluir dados da role (id, name)
      },
      orderBy: {
        createdAt: "asc", // Ordenar por data de criação
      },
    });

    // Buscar roles administrativas disponíveis
    const roles = await prisma.adminRole.findMany({
      orderBy: {
        name: "asc",
      },
    });

    teamMembers = dbTeamMembers as TeamMember[];
    availableRoles = roles;
  } catch (err) {
    console.error("[TeamPage] Erro ao buscar membros da equipe:", err);
    error = "Erro ao carregar membros da equipe. Tente novamente.";
  }

  return (
    <TeamContentClient teamMembers={teamMembers} availableRoles={availableRoles} error={error} />
  );
}
