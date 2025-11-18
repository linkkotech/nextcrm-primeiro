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
