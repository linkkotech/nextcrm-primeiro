/**
 * Tipos relacionados a Workspaces e Equipes
 */

/**
 * Membro de workspace com relação de usuário
 */
export type WorkspaceMember = {
  id: string;
  role: string;
  workspaceId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
    avatar?: string | null;
  };
};

/**
 * Workspace com membros incluídos
 */
export type WorkspaceWithMembers = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  members: WorkspaceMember[];
};

/**
 * Roles possíveis para membros
 */
export type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER" | "GUEST";

/**
 * Dados do formulário de convite
 */
export type InviteFormData = {
  email: string;
  role: WorkspaceRole;
  message?: string;
};

/**
 * Props para componentes de membro da equipe
 */
export type TeamMemberProps = {
  member: WorkspaceMember;
  onRemove?: (memberId: string) => void;
  onUpdateRole?: (memberId: string, newRole: WorkspaceRole) => void;
};
