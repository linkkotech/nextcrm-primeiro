import { z } from "zod";

export const createTemplateSchema = z.object({
  templateName: z
    .string()
    .min(1, "Nome do template é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(255, "Nome não pode exceder 255 caracteres"),
  description: z
    .string()
    .max(1000, "Descrição não pode exceder 1000 caracteres")
    .optional()
    .or(z.literal("")),
  templateType: z.enum(["profile_template", "content_block"], {
    errorMap: () => ({ message: "Selecione um tipo de template válido" }),
  }),
});

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
