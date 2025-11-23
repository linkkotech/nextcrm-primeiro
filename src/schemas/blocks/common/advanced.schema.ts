import { z } from "zod";

/**
 * Schema para propriedades avançadas
 * 
 * Configurações de visibilidade, CSS customizado, etc.
 * Reutilizável entre múltiplos tipos de elementos.
 * 
 * @example
 * import { advancedSchema } from '@/schemas/blocks/common/advanced.schema';
 */
export const advancedSchema = z.object({
  customClass: z.string().default(""),
  visibility: z.array(z.enum(["mobile", "tablet", "desktop"])).default([]),
}).default({
  customClass: "",
  visibility: [],
});

export type Advanced = z.infer<typeof advancedSchema>;
