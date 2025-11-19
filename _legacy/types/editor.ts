/**
 * Tipos relacionados ao Editor de Templates Digitais
 */

import type { DigitalTemplate } from '@prisma/client';
import type { z } from 'zod';
import { ctaBlockContentSchema } from '@/schemas/ctaBlock.schemas';
import { heroBlockContentSchema } from '@/schemas/heroBlock.schemas';

/**
 * TIPO PRINCIPAL: Bloco do banco de dados (Prisma)
 * Representa um DigitalTemplate com content tipado corretamente
 * 
 * @example
 * const blocks: Block[] = await prisma.digitalTemplate.findMany(...);
 */
export type Block = Omit<DigitalTemplate, 'content'> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: Record<string, any>;
};

/**
 * TIPOS DE CONTEÚDO: Derivados dos schemas Zod
 */
export type CTABlockContent = z.infer<typeof ctaBlockContentSchema>;
export type HeroBlockContent = z.infer<typeof heroBlockContentSchema>;

/**
 * TIPO PARA SERIALIZAÇÃO: Dados após JSON.parse/stringify
 */
export type SerializedBlock = Omit<Block, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

/**
 * TIPOS DE PROPS: Para componentes do editor
 */
export interface EditorLayoutProps {
  templateId: string;
  initialContent: HeroBlockContent;
  initialBlocks?: Block[];
}

export interface ContentEditorProps {
  templateId: string;
  initialContent: HeroBlockContent;
  onHeroValuesChange?: (values: HeroBlockContent) => void;
  onDynamicBlocksChange?: (blocks: Block[]) => void;
}

export interface BlockListProps {
  blocks: Block[];
  onUpdate: (blocks: Block[]) => void;
  onDelete: (blockId: string) => void;
}

export interface MobileScreenProps {
  heroValues?: HeroBlockContent;
  dynamicBlocks: Block[];
}

/**
 * Estrutura base de um bloco
 * Usado como tipo base para todos os blocos no editor
 * 
 * @example
 * const block: BlockData = {
 *   id: "block-1",
 *   type: "hero",
 *   order: 0,
 *   content: { title: "Bem-vindo", subtitle: "Ao seu site" }
 * };
 */
export type BlockData = {
  id: string;
  type: string;
  order: number;
  content: Record<string, unknown>;
  metadata?: Record<string, unknown>;
};

/**
 * Bloco de Call-to-Action
 * Usado para botões de ação e conversão
 * 
 * @example
 * const ctaBlock: CTABlock = {
 *   id: "cta-1",
 *   type: "cta",
 *   order: 1,
 *   content: {
 *     title: "Comece agora",
 *     buttonText: "Clique aqui",
 *     buttonUrl: "/signup"
 *   }
 * };
 */
export type CTABlock = BlockData & {
  type: "cta";
  content: {
    title?: string;
    description?: string;
    buttonText?: string;
    buttonUrl?: string;
    backgroundColor?: string;
    textColor?: string;
  };
};

/**
 * Bloco Hero
 * Seção de apresentação principal do template
 * 
 * @example
 * const heroBlock: HeroBlock = {
 *   id: "hero-1",
 *   type: "hero",
 *   order: 0,
 *   content: {
 *     title: "Transforme seu negócio",
 *     subtitle: "Com nossa solução",
 *     imageUrl: "https://..."
 *   }
 * };
 */
export type HeroBlock = BlockData & {
  type: "hero";
  content: {
    title?: string;
    subtitle?: string;
    imageUrl?: string;
    overlayOpacity?: number;
  };
};

/**
 * Bloco dinâmico genérico
 * Union type para todos os blocos possíveis
 */
export type DynamicBlock = CTABlock | HeroBlock | BlockData;

/**
 * Props para componentes de editor
 * Base para qualquer componente que edita blocos
 * 
 * @example
 * <Editor 
 *   blocks={blocks}
 *   onChange={handleBlocksChange}
 *   templateId="template-1"
 * />
 */
export type EditorProps = {
  blocks: BlockData[];
  onChange: (blocks: BlockData[]) => void;
  templateId?: string;
};

/**
 * Tipo genérico unificado para dados desconhecidos (usado em serialização)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnknownData = Record<string, any>;
