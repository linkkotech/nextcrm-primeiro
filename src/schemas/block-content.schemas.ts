import { z } from "zod";

/**
 * Schema para propriedades de estilo com suporte a estados Normal/Hover
 */
const styleStateSchema = z.object({
  textColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida").optional(),
  backgroundColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida").optional(),
  borderColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida").optional(),
  shadowColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida").optional(),
});

const fourSidedValuesSchema = z.object({
  top: z.number().min(0).max(1000),
  right: z.number().min(0).max(1000),
  bottom: z.number().min(0).max(1000),
  left: z.number().min(0).max(1000),
});

export const stylePropertiesSchema = z.object({
  // Tipografia
  fontSize: z.number().min(8).max(100).optional(),
  fontWeight: z.enum(["400", "500", "600", "700", "800"]).optional(),
  letterSpacing: z.number().min(-5).max(10).optional(),
  lineHeight: z.number().min(1).max(3).optional(),

  // Espaçamento
  padding: fourSidedValuesSchema.optional(),
  margin: z.object({
    top: z.number().min(-1000).max(1000),
    right: z.number().min(-1000).max(1000),
    bottom: z.number().min(-1000).max(1000),
    left: z.number().min(-1000).max(1000),
  }).optional(),

  // Borda
  borderWidth: z.number().min(0).max(20).optional(),
  borderRadius: z.number().min(0).max(100).optional(),
  borderStyle: z.enum(["solid", "dashed", "dotted"]).optional(),

  // Sombra
  shadowOffsetX: z.number().min(-50).max(50).optional(),
  shadowOffsetY: z.number().min(-50).max(50).optional(),
  shadowBlur: z.number().min(0).max(50).optional(),
  shadowSpread: z.number().min(-20).max(50).optional(),

  // Estados (Normal e Hover)
  normal: styleStateSchema.optional(),
  hover: styleStateSchema.optional(),
});

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
    styles: stylePropertiesSchema.optional(),
});

/**
 * Schema para propriedades de fundo (solid, gradient, image)
 */
const backgroundSchema = z.object({
  type: z.enum(["solid", "gradient", "image"]).default("solid"),
  solidColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida").optional(),
  gradientColor1: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida").optional(),
  gradientColor2: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida").optional(),
  gradientAngle: z.number().min(0).max(360).default(90).optional(),
  imageUrl: z.string().url().optional(),
});

/**
 * Schema para propriedades de borda
 */
const borderSchema = z.object({
  width: z.number().min(0).max(20).default(0).optional(),
  radius: z.number().min(0).max(100).default(0).optional(),
  style: z.enum(["solid", "dashed", "dotted"]).default("solid").optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida").optional(),
  colorHover: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida").optional(),
});

/**
 * Schema para propriedades de layout (espaçamento)
 */
const layoutSchema = z.object({
  mode: z.enum(["full-width", "contained"]).default("contained").optional(),
  padding: fourSidedValuesSchema.optional(),
  margin: z.object({
    top: z.number().min(-1000).max(1000),
    right: z.number().min(-1000).max(1000),
    bottom: z.number().min(-1000).max(1000),
    left: z.number().min(-1000).max(1000),
  }).optional(),
});

/**
 * Schema para propriedades avançadas
 */
const advancedSchema = z.object({
  customCss: z.string().optional(),
  visibilityRules: z.array(z.enum(["mobile", "tablet", "desktop"])).optional(),
});

/**
 * Schema de validação para o conteúdo do bloco SECTION
 */
export const sectionContentSchema = z.object({
  layerName: z.string().min(1, "Nome da camada é obrigatório"),
  background: backgroundSchema.optional(),
  layout: layoutSchema.optional(),
  border: borderSchema.optional(),
  advanced: advancedSchema.optional(),
});

export type HeroContent = z.infer<typeof heroContentSchema>;
export type SectionContent = z.infer<typeof sectionContentSchema>;
export type StyleProperties = z.infer<typeof stylePropertiesSchema>;

/**
 * Schema genérico para validação de qualquer bloco (útil para o dispatcher)
 */
export const blockContentSchema = z.union([
    heroContentSchema,
    sectionContentSchema,
    z.record(z.unknown()) // Fallback para outros tipos ainda não implementados
]);
