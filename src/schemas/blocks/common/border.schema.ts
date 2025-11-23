import { z } from "zod";

/**
 * Schema para propriedades de borda
 * 
 * Suporta estados Normal e Hover para a cor da borda.
 * Reutilizável entre múltiplos tipos de elementos.
 * 
 * @example
 * import { borderSchema } from '@/schemas/blocks/common/border.schema';
 */
export const borderSchema = z.object({
  width: z.number().min(0).max(20).default(0),
  radius: z.number().min(0).max(100).default(0),
  style: z.enum(["solid", "dashed", "dotted"]).default("solid"),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida").default("#000000"),
  colorHover: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida").default("#000000").optional(),
}).default({
  width: 0,
  radius: 0,
  style: "solid",
  color: "#000000",
  colorHover: "#000000",
});

export type Border = z.infer<typeof borderSchema>;
