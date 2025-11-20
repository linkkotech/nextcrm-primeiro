import { z } from "zod";

/**
 * Schema de validação para o formulário de convite de membro administrativo.
 *
 * Valida:
 * - FullName: nome completo (2+ caracteres)
 * - Email: formato válido de email
 * - AdminRoleId: role selecionada (não vazio)
 * - Password: mínimo 8 caracteres + 1 maiúscula + 1 número
 *
 * @example
 * ```ts
 * const formData = inviteMemberSchema.parse({
 *   fullName: "João Silva",
 *   email: "admin@example.com",
 *   adminRoleId: "role-id",
 *   password: "SecurePass123"
 * });
 * ```
 */
export const inviteMemberSchema = z.object({
  fullName: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  adminRoleId: z.string().min(1, "Selecione uma função"),
  password: z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;

/**
 * Schema de validação para adicionar membro ao workspace.
 * 
 * Valida:
 * - name: nome completo (2+ caracteres)
 * - cargo: cargo/função (opcional)
 * - unitId: ID da unidade (opcional)
 * - email: formato válido de email
 * - celular: telefone (opcional)
 * - workspaceRoleId: role selecionada (obrigatória)
 * - isActive: status ativo/inativo
 * - sendInvite: se deve enviar convite por email
 * - password: senha provisória (obrigatória apenas se sendInvite === false)
 * 
 * @example
 * ```ts
 * // Com convite por email
 * const data1 = addTeamMemberSchema.parse({
 *   name: "João Silva",
 *   email: "joao@empresa.com",
 *   workspaceRoleId: "role-id",
 *   isActive: true,
 *   sendInvite: true
 * });
 * 
 * // Com senha provisória
 * const data2 = addTeamMemberSchema.parse({
 *   name: "Maria Santos",
 *   email: "maria@empresa.com",
 *   workspaceRoleId: "role-id",
 *   isActive: true,
 *   sendInvite: false,
 *   password: "SenhaProvisoria123"
 * });
 * ```
 */
export const addTeamMemberSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nome é obrigatório")
      .min(2, "Nome deve ter no mínimo 2 caracteres"),
    cargo: z.string().optional().transform(val => val === "" ? undefined : val),
    unitId: z.string().optional().transform(val => val === "" ? undefined : val),
    email: z
      .string()
      .min(1, "Email é obrigatório")
      .email("Email inválido"),
    celular: z.string().optional().transform(val => val === "" ? undefined : val),
    workspaceRoleId: z.string().min(1, "Selecione uma função"),
    isActive: z.boolean().default(true),
    sendInvite: z.boolean().default(true),
    password: z.string().optional(),
  })
  .refine(
    (data) => {
      // Se sendInvite for false, password é obrigatório
      if (!data.sendInvite && !data.password) {
        return false;
      }
      // Se password foi fornecido, validar formato
      if (data.password) {
        return (
          data.password.length >= 8 &&
          /[A-Z]/.test(data.password) &&
          /[0-9]/.test(data.password)
        );
      }
      return true;
    },
    {
      message: "Senha deve ter no mínimo 8 caracteres, 1 letra maiúscula e 1 número",
      path: ["password"],
    }
  );

export type AddTeamMemberInput = z.infer<typeof addTeamMemberSchema>;
