import { z } from "zod";

/**
 * Schema de validação para o conteúdo do bloco HERO
 */
export const heroContentSchema = z.object({
    title: z.string().min(1, "O título é obrigatório"),
    subtitle: z.string().optional(),
    backgroundColor: z
        .string()
        .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida (use formato hex: #RRGGBB)")
        .optional()
        .default("#ffffff"),
    textColor: z
        .string()
        .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida")
        .optional()
        .default("#000000"),
    buttonText: z.string().optional(),
    buttonUrl: z.string().url("URL inválida").optional().or(z.literal("")),
});

export type HeroContent = z.infer<typeof heroContentSchema>;

/**
 * Schema genérico para validação de qualquer bloco (útil para o dispatcher)
 */
export const blockContentSchema = z.union([
    heroContentSchema,
    z.record(z.unknown()) // Fallback para outros tipos ainda não implementados
]);
