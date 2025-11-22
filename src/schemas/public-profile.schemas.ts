import { z } from "zod";

export const captureLeadSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    phone: z.string().min(10, "Telefone inválido"), // Basic validation, can be improved
    interest: z.string().optional(),
    profileId: z.string().cuid("ID do perfil inválido"),
});

export type CaptureLeadInput = z.infer<typeof captureLeadSchema>;
