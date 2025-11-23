/**
 * Tipos para o estado do Editor de Blocos (Page Builder)
 * 
 * IMPORTANTE: Estes tipos são RE-EXPORTADOS dos schemas Zod para garantir
 * consistência total entre validação e tipagem TypeScript.
 * 
 * A fonte da verdade é src/schemas/editor.schemas.ts
 */

import type { EditorElement as _EditorElement, BlockContent as _BlockContent, BlockMetadata as _BlockMetadata } from "@/schemas/editor.schemas";

export type EditorElement = _EditorElement;
export type BlockContent = _BlockContent;
export type BlockMetadata = _BlockMetadata;

/**
 * EditorState - Estado completo do editor de blocos
 * 
 * Alias para BlockContent. Usado no BlockEditorClient para representar
 * o estado local do editor durante a edição.
 * 
 * @example
 * const state: EditorState = {
 *   elements: [
 *     {
 *       id: "uuid-1",
 *       type: "Section",
 *       props: { layerName: "Hero", background: { type: "solid" } },
 *       children: []
 *     }
 *   ],
 *   metadata: {
 *     name: "Homepage Hero",
 *     description: "Section principal da homepage"
 *   }
 * }
 */
export type EditorState = BlockContent;


