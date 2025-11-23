import { z } from "zod";

/**
 * Schema para valores de 4 lados (top, right, bottom, left)
 * 
 * Usado para padding, margin, etc.
 */
const fourSidedValuesSchema = z.object({
  top: z.number().min(0).max(1000),
  right: z.number().min(0).max(1000),
  bottom: z.number().min(0).max(1000),
  left: z.number().min(0).max(1000),
}).default({ top: 0, right: 0, bottom: 0, left: 0 });

/**
 * Schema para propriedades de layout (espaçamento)
 * 
 * Reutilizável entre múltiplos tipos de elementos.
 * 
 * @example
 * import { layoutSchema } from '@/schemas/blocks/common/layout.schema';
 */
export const layoutSchema = z.object({
  mode: z.enum(["full-width", "contained"]).default("contained"),
  padding: fourSidedValuesSchema.default({ top: 0, right: 0, bottom: 0, left: 0 }),
  margin: z.object({
    top: z.number().min(-1000).max(1000),
    right: z.number().min(-1000).max(1000),
    bottom: z.number().min(-1000).max(1000),
    left: z.number().min(-1000).max(1000),
  }).default({ top: 0, right: 0, bottom: 0, left: 0 }),
}).default({
  mode: "contained",
  padding: { top: 0, right: 0, bottom: 0, left: 0 },
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
});

export type Layout = z.infer<typeof layoutSchema>;
