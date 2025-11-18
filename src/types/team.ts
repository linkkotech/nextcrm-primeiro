/**
 * Tipos para a página de gerenciamento de Equipe (Admin)
 * Define estrutura de dados para membros da equipe administrativa
 */

/**
 * Representa um membro da equipe com sua role administrativa.
 * Derivado da query Prisma que inclui adminRole.
 */
export type TeamMember = {
  id: string;
  name: string | null;
  email: string | null;
  adminRole: {
    id: string;
    name: string;
  } | null;
  createdAt: Date;
};

/**
 * Mapeamento de cores (Tailwind) para cada AdminRole.
 * Usado para estilizar Badges na tabela de equipe.
 *
 * @example
 * ```tsx
 * <Badge className={ROLE_COLORS[member.adminRole?.name || '']}>
 *   {member.adminRole?.name}
 * </Badge>
 * ```
 */
export const ROLE_COLORS: Record<string, string> = {
  super_admin: "bg-red-100 text-red-800 border border-red-300",
  admin: "bg-blue-100 text-blue-800 border border-blue-300",
  manager: "bg-amber-100 text-amber-800 border border-amber-300",
};

/**
 * Formata o nome da role para exibição (ex: 'super_admin' → 'SUPER ADMIN').
 *
 * @param roleName - Nome da role (ex: 'super_admin')
 * @returns Nome formatado para exibição
 *
 * @example
 * ```ts
 * formatRoleName('super_admin') // 'SUPER ADMIN'
 * formatRoleName('admin') // 'ADMIN'
 * ```
 */
export function formatRoleName(roleName: string): string {
  return roleName.replace(/_/g, " ").toUpperCase();
}
