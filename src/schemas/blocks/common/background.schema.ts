import { z } from "zod";

/**
 * Schema para propriedades de fundo (solid, gradient, image)
 * 
 * Reutilizável entre múltiplos tipos de elementos (Section, Container, etc.)
 * 
 * @example
 * import { backgroundSchema } from '@/schemas/blocks/common/background.schema';
 * 
 * const mySchema = z.object({
 *   background: backgroundSchema.optional(),
 * });
 */
export const backgroundSchema = z.object({
  type: z.enum(["solid", "gradient"]).default("solid"),
  solidColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida").default("#ffffff"),
  gradientColor1: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida").default("#ffffff").optional(),
  gradientColor2: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida").default("#000000").optional(),
  gradientAngle: z.number().min(0).max(360).default(90).optional(),
}).default({
  type: "solid",
  solidColor: "#ffffff",
  gradientColor1: "#ffffff",
  gradientColor2: "#000000",
  gradientAngle: 90,
});

export type Background = z.infer<typeof backgroundSchema>;
