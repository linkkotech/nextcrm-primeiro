import { z } from "zod";
import { BlockType } from "@prisma/client";
import { heroContentSchema } from "../block-content.schemas";
import { sectionContentSchema } from "./section.schema";

/**
 * Mapa Central de Schemas de Validação por Tipo de Bloco
 * 
 * Este mapa funciona como um "dispatcher" que associa cada tipo de bloco
 * (definido no enum BlockType do Prisma) ao seu schema Zod correspondente.
 * 
 * Benefícios desta arquitetura:
 * - Type Safety: TypeScript garante que só usamos tipos válidos do enum BlockType
 * - Escalabilidade: Adicionar um novo tipo de bloco requer apenas 2 passos:
 *   1. Criar o arquivo [type].schema.ts em src/schemas/blocks/
 *   2. Adicionar a entrada aqui no mapa
 * - Manutenibilidade: Cada schema fica em seu próprio arquivo focado
 * 
 * @example
 * // Na Server Action:
 * import { blockSchemaMap } from '@/schemas/blocks';
 * 
 * const schema = blockSchemaMap[blockType];
 * if (!schema) {
 *   return { error: `Tipo ${blockType} não suportado` };
 * }
 * const validatedData = schema.parse(content);
 */
export const blockSchemaMap: Record<BlockType, z.ZodSchema> = {
  [BlockType.HERO]: heroContentSchema,
  [BlockType.SECTION]: sectionContentSchema,
};

/**
 * Helper para obter a lista de tipos de bloco suportados
 * Útil para mensagens de erro descritivas
 */
export const supportedBlockTypes = Object.keys(blockSchemaMap) as BlockType[];
