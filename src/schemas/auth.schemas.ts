import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Validates the signup form, ensuring we collect enough profile data and that both password fields match.
 *
 * @example
 * ```ts
 * const { name, email, password } = signupSchema.parse(formValues)
 * ```
 *
 * @throws {ZodError} When any field is missing, too short, or the confirmation password diverges.
 * @returns {z.ZodObject} A schema that can be reused on both client (react-hook-form) and server actions.
 */
export const signupSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export type SignupInput = z.infer<typeof signupSchema>;

