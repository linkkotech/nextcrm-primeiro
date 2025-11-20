/**
 * Workspace Role Options Configuration
 * Maps database ENUM values to user-friendly labels for UI display
 */

export interface WorkspaceRoleOption {
  value: string; // Database ENUM value
  label: string; // User-friendly display label
  description?: string; // Optional description for tooltips
}

export const WORKSPACE_ROLE_OPTIONS: WorkspaceRoleOption[] = [
  {
    value: "work_admin",
    label: "Administrador",
    description: "Acesso total ao workspace, pode gerenciar membros e configurações",
  },
  {
    value: "work_manager",
    label: "Gerente",
    description: "Pode gerenciar unidades e visualizar relatórios",
  },
  {
    value: "work_user",
    label: "Usuário",
    description: "Acesso básico ao workspace",
  },
];

/**
 * Helper function to get label from role value
 */
export function getRoleLabel(roleValue: string): string {
  const role = WORKSPACE_ROLE_OPTIONS.find((r) => r.value === roleValue);
  return role?.label || roleValue;
}

/**
 * Helper function to get role option by value
 */
export function getRoleOption(roleValue: string): WorkspaceRoleOption | undefined {
  return WORKSPACE_ROLE_OPTIONS.find((r) => r.value === roleValue);
}
