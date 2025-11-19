import { z } from 'zod';

/**
 * Schema for CTA Block content validation
 * Defines all fields and their validation rules for the CTA editor
 */
export const ctaBlockContentSchema = z.object({
  // URL e Comportamento
  destinationUrl: z
    .string()
    .url('URL de destino inválida')
    .or(z.string().length(0))
    .optional(),
  openInNewTab: z.boolean().default(false),

  // Conteúdo
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .default('AGENDAR UMA REUNIÃO'),
  imageThumbnail: z
    .string()
    .url('URL de imagem inválida')
    .or(z.string().length(0))
    .optional(),
  iconClass: z.string().optional(),

  // Cores Principais (2 camadas do CTA)
  primaryColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Cor primária inválida')
    .default('#373F4B'),
  secondaryColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Cor secundária inválida')
    .default('#9CA3AF'),

  // Estilo do Texto do Botão
  textColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Cor do texto inválida')
    .default('#1F2937'),
  textAlignment: z
    .enum(['center', 'left', 'right', 'justify'], {
      errorMap: () => ({ message: 'Alinhamento inválido' }),
    })
    .default('center'),

  // Background (botão interno)
  backgroundColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Cor de fundo inválida')
    .default('#000000'),

  // Animação
  animation: z
    .enum(['none', 'fade', 'slide', 'bounce'], {
      errorMap: () => ({ message: 'Animação inválida' }),
    })
    .default('none'),

  // Aviso e Layout
  sensitiveContentWarning: z.boolean().default(false),
  columns: z
    .enum(['1', '2'], {
      errorMap: () => ({ message: 'Número de colunas inválido' }),
    })
    .default('1'),

  // Configurações Avançadas
  border: z
    .object({
      width: z.number().min(0).max(10).default(0),
      color: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, 'Cor da borda inválida')
        .default('#000000'),
      radius: z.number().min(0).max(50).default(8),
      style: z.enum(['solid', 'dashed', 'dotted']).default('solid'),
    })
    .optional(),

  shadow: z
    .object({
      hOffset: z.number().default(0),
      vOffset: z.number().default(0),
      blur: z.number().default(0),
      spread: z.number().default(0),
      color: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, 'Cor da sombra inválida')
        .default('#000000'),
    })
    .optional(),

  display: z
    .object({
      padding: z.number().min(0).max(100).default(16),
      margin: z.number().min(0).max(100).default(0),
    })
    .optional(),
});

export type CTABlockContent = z.output<typeof ctaBlockContentSchema>;
