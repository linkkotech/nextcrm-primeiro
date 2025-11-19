import { z } from 'zod';

/**
 * Schema for Hero Block content validation
 * Defines all fields and their validation rules for the Hero Section editor
 */
export const heroBlockContentSchema = z.object({
  // Section 1: Destination URL (from reference image)
  destinationUrl: z
    .string()
    .url('URL de destino inválida')
    .or(z.string().length(0))
    .optional(),
  openInNewTab: z.boolean().optional(),

  // Section 2: Informações Principais
  profileImage: z
    .string()
    .url('URL de imagem inválida')
    .or(z.string().length(0))
    .optional(),
  userName: z
    .string()
    .min(1, 'Nome do usuário é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  userInfo: z
    .string()
    .max(500, 'Informações do usuário devem ter no máximo 500 caracteres')
    .optional(),

  // Section 3: Icon
  iconClass: z
    .string()
    .max(100, 'Classe do ícone deve ter no máximo 100 caracteres')
    .optional(),

  // Section 4: Botões de Contato
  phoneNumber: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Número de telefone inválido')
    .or(z.string().length(0))
    .optional(),
  emailAddress: z
    .string()
    .email('Email inválido')
    .or(z.string().length(0))
    .optional(),
  whatsappNumber: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Número de WhatsApp inválido')
    .or(z.string().length(0))
    .optional(),
  scheduleLink: z
    .string()
    .url('URL de agenda inválida')
    .or(z.string().length(0))
    .optional(),
  scheduleEnabled: z.boolean().optional(),
  emailMode: z
    .enum(['mailto', 'form'], {
      errorMap: () => ({ message: 'Modo de email inválido' }),
    })
    .optional(),

  // Section 5: Animation and Columns (from reference image)
  animation: z
    .enum(['none', 'fade', 'slide', 'bounce'], {
      errorMap: () => ({ message: 'Animação inválida' }),
    })
    .optional(),
  sensitiveContentWarning: z.boolean().optional(),
  columns: z
    .enum(['1', '2'], {
      errorMap: () => ({ message: 'Número de colunas inválido' }),
    })
    .optional(),

  // Section 6: Configurações do Cabeçalho
  isHeaderEnabled: z.boolean().optional(),
  headerLogoImage: z
    .string()
    .url('URL da logo inválida')
    .or(z.string().length(0))
    .optional(),
  headerLogoUrl: z
    .string()
    .url('URL da logo inválida')
    .or(z.string().length(0))
    .optional(),
  headerLogoWidth: z
    .number()
    .min(20, 'Largura mínima é 20px')
    .max(200, 'Largura máxima é 200px')
    .optional(),
  headerMenuEnabled: z.boolean().optional(),

  // Section 4: CTA
  isCTAEnabled: z.boolean().optional(),
  ctaText: z.string().default("AGENDAR UMA REUNIÃO").optional(),

  // Section 5: Estilos (cores, bordas, sombras)
  styles: z
    .object({
      // Block Colors and Alignment
      textColor: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, 'Cor do texto inválida')
        .optional(),
      textAlignment: z
        .enum(['center', 'left', 'justify', 'right'], {
          errorMap: () => ({ message: 'Alinhamento inválido' }),
        })
        .optional(),
      backgroundColor: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, 'Cor de fundo inválida')
        .optional(),
      blockBackgroundColor: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, 'Cor de fundo inválida')
        .optional(),
      blockTitleColor: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, 'Cor do título inválida')
        .optional(),
      blockSubtitleColor: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, 'Cor do subtítulo inválida')
        .optional(),
      blockTextColor: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, 'Cor do texto inválida')
        .optional(),
      blockLinkColor: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, 'Cor do link inválida')
        .optional(),

      // Button Colors
      buttonBackgroundColor: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, 'Cor de fundo do botão inválida')
        .optional(),
      buttonTextColor: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, 'Cor do texto do botão inválida')
        .optional(),
      buttonIconColor: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, 'Cor inválida')
        .optional(),

      // Border Configuration
      borderWidth: z
        .number()
        .min(0, 'Largura mínima é 0')
        .max(10, 'Largura máxima é 10')
        .optional(),
      borderColor: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, 'Cor da borda inválida')
        .optional(),
      borderRadius: z
        .enum(['reto', 'redondo', 'arredondado'], {
          errorMap: () => ({ message: 'Tipo de borda inválido' }),
        })
        .optional(),
      borderStyle: z
        .enum(['solid', 'dotted', 'dashed', 'hidden'], {
          errorMap: () => ({ message: 'Estilo de borda inválido' }),
        })
        .optional(),

      // Box Shadow Configuration
      boxShadowHOffset: z
        .number()
        .min(-20, 'Valor mínimo é -20px')
        .max(20, 'Valor máximo é 20px')
        .optional(),
      boxShadowVOffset: z
        .number()
        .min(-20, 'Valor mínimo é -20px')
        .max(20, 'Valor máximo é 20px')
        .optional(),
      boxShadowBlur: z
        .number()
        .min(0, 'Valor mínimo é 0')
        .max(20, 'Valor máximo é 20px')
        .optional(),
      boxShadowSpread: z
        .number()
        .min(0, 'Valor mínimo é 0')
        .max(10, 'Valor máximo é 10px')
        .optional(),
      boxShadowColor: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, 'Cor da sombra inválida')
        .optional(),
    })
    .optional(),
});

export const heroBlockSchema = z.object({
  content: heroBlockContentSchema,
});

export type HeroBlockContent = z.infer<typeof heroBlockContentSchema>;
export type HeroBlockInput = z.infer<typeof heroBlockSchema>;
