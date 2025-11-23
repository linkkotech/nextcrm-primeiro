import { z } from "zod";
import { backgroundSchema } from "./blocks/common/background.schema";
import { layoutSchema } from "./blocks/common/layout.schema";
import { borderSchema } from "./blocks/common/border.schema";
import { advancedSchema } from "./blocks/common/advanced.schema";

/**
 * Schemas de Validação para o Page Builder
 * 
 * Esta arquitetura usa "Discriminated Unions" do Zod para validar
 * diferentes tipos de elementos baseando-se no campo 'type'.
 * 
 * Cada tipo de elemento (Section, Heading, Button, etc.) tem seu próprio
 * schema de props, mas todos compartilham a estrutura base (id, type, children).
 */

// =============================================================================
// BASE ELEMENT SCHEMA
// =============================================================================

/**
 * Schema base que todos os elementos herdam
 * Define a estrutura comum: id, type, children
 */
const baseElementSchema = z.object({
  id: z.string().uuid("ID do elemento deve ser um UUID válido"),
  type: z.string(), // Será sobrescrito pelos schemas específicos com z.literal()
});

// =============================================================================
// ELEMENT-SPECIFIC SCHEMAS (Props Validation)
// =============================================================================

/**
 * Section Element Schema
 * Section (Section) com propriedades de layout, background e border organizadas em style
 */
const sectionElementSchema = baseElementSchema.extend({
  type: z.literal("Section"),
  props: z.object({
    layerName: z.string().min(1, "Nome da camada é obrigatório").default("Seção"),
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
  }),
});

/**
 * Container Element Schema
 * Container flexível para organizar elementos em grid/flex
 */
const containerElementSchema = baseElementSchema.extend({
  type: z.literal("Container"),
  props: z.object({
    layerName: z.string().min(1).default("Container"),
    display: z.enum(["flex", "grid", "block"]).default("flex"),
    gap: z.number().min(0).max(100).default(16),
    padding: z.object({
      top: z.number().min(0).max(1000),
      right: z.number().min(0).max(1000),
      bottom: z.number().min(0).max(1000),
      left: z.number().min(0).max(1000),
    }).optional(),
  }),
});

/**
 * Heading Element Schema
 * Títulos H1-H6 com estilo e alinhamento
 */
const headingElementSchema = baseElementSchema.extend({
  type: z.literal("Heading"),
  props: z.object({
    layerName: z.string().default("Título"),
    text: z.string().min(1, "Texto do heading é obrigatório").default("Novo Título"),
    content: z.string().optional(), // Alias para text (compatibilidade)
    level: z.enum(["h1", "h2", "h3", "h4", "h5", "h6"]).default("h2"),
    alignment: z.enum(["left", "center", "right"]).default("left"),
    color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
    fontSize: z.number().min(12).max(120).optional(),
    fontWeight: z.string().optional(), // "400", "500", "700", etc.
  }),
});

/**
 * Text Element Schema
 * Parágrafo de texto com formatação rica
 */
const textElementSchema = baseElementSchema.extend({
  type: z.literal("Text"),
  props: z.object({
    layerName: z.string().default("Texto"),
    content: z.string().min(1, "Conteúdo do texto é obrigatório").default("Digite seu texto aqui..."),
    alignment: z.enum(["left", "center", "right", "justify"]).default("left"),
    color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
    fontSize: z.number().min(8).max(72).optional(),
    fontWeight: z.string().optional(),
  }),
});

/**
 * Button Element Schema
 * Botão de ação com link e estilo
 */
const buttonElementSchema = baseElementSchema.extend({
  type: z.literal("Button"),
  props: z.object({
    layerName: z.string().default("Botão"),
    text: z.string().min(1, "Texto do botão é obrigatório").default("Clique aqui"),
    label: z.string().optional(), // Alias para text (compatibilidade)
    url: z.string().url("URL inválida").or(z.literal("")).optional(),
    variant: z.enum(["primary", "secondary", "outline", "ghost"]).default("primary"),
    size: z.enum(["sm", "md", "lg"]).default("md"),
    fullWidth: z.boolean().default(false),
    backgroundColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
    textColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
  }),
});

/**
 * Image Element Schema
 * Imagem com src, alt e dimensões
 */
const imageElementSchema = baseElementSchema.extend({
  type: z.literal("Image"),
  props: z.object({
    src: z.string().url("URL da imagem inválida"),
    alt: z.string().default(""),
    width: z.number().min(1).max(2000).optional(),
    height: z.number().min(1).max(2000).optional(),
    objectFit: z.enum(["cover", "contain", "fill", "none"]).default("cover"),
  }),
});

// =============================================================================
// RECURSIVE ELEMENT SCHEMA (with children)
// =============================================================================

/**
 * Tipo inferido do Discriminated Union (sem children ainda)
 * Necessário para definir o tipo recursivo
 */
type EditorElementBase = 
  | z.infer<typeof sectionElementSchema>
  | z.infer<typeof containerElementSchema>
  | z.infer<typeof headingElementSchema>
  | z.infer<typeof textElementSchema>
  | z.infer<typeof buttonElementSchema>
  | z.infer<typeof imageElementSchema>;

/**
 * Tipo recursivo completo do EditorElement (com children)
 */
export type EditorElement = EditorElementBase & {
  children: EditorElement[];
};

/**
 * Schema recursivo com validação de children usando z.lazy()
 * 
 * IMPORTANTE: z.lazy() é usado para permitir schemas auto-referentes
 * Sem ele, teríamos um erro de "circular reference"
 */
export const editorElementSchema: z.ZodType<EditorElement> = z.lazy(() =>
  z.discriminatedUnion("type", [
    sectionElementSchema,
    containerElementSchema,
    headingElementSchema,
    textElementSchema,
    buttonElementSchema,
    imageElementSchema,
  ]).and(z.object({
    children: z.array(editorElementSchema),
  }))
) as z.ZodType<EditorElement>;

// =============================================================================
// BLOCK CONTENT SCHEMA (Complete Page Builder structure)
// =============================================================================

/**
 * Schema para metadados do bloco (nome, descrição)
 */
export const blockMetadataSchema = z.object({
  name: z.string().min(1, "Nome do bloco é obrigatório"),
  description: z.string().optional(),
});

/**
 * Schema completo para o conteúdo de um TemplateBlock
 * 
 * Este é o schema que valida o JSON armazenado em TemplateBlock.content
 * Estrutura: { elements: [], metadata: {} }
 */
export const blockContentSchema = z.object({
  elements: z.array(editorElementSchema),
  metadata: blockMetadataSchema,
});

/**
 * Tipo inferido do schema de conteúdo do bloco
 */
export type BlockContent = z.infer<typeof blockContentSchema>;

/**
 * Tipo inferido do schema de metadados
 */
export type BlockMetadata = z.infer<typeof blockMetadataSchema>;
