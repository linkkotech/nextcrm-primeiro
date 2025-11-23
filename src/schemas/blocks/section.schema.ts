import { z } from "zod";
import { backgroundSchema } from "./common/background.schema";
import { layoutSchema } from "./common/layout.schema";
import { borderSchema } from "./common/border.schema";
import { advancedSchema } from "./common/advanced.schema";

/**
 * Schema de validação para o conteúdo do bloco SECTION
 * 
 * Uma Section é um elemento container que compõe o layout da página.
 * Suporta propriedades de background, layout, border e configurações avançadas.
 * 
 * @example
 * import { sectionContentSchema } from '@/schemas/blocks/section.schema';
 * 
 * const validatedData = sectionContentSchema.parse(formData);
 */
export const sectionContentSchema = z.object({
  layerName: z.string().min(1, "Nome da camada é obrigatório").default("Section"),
  style: z.object({
    layout: layoutSchema,
    background: backgroundSchema,
    border: borderSchema,
  }).default({
    layout: layoutSchema.parse({}),
    background: backgroundSchema.parse({}),
    border: borderSchema.parse({}),
  }),
  advanced: advancedSchema,
});

export type SectionContent = z.infer<typeof sectionContentSchema>;
