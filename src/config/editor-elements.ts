/**
 * @file Mapa de tipos de elementos para ícones lucide-react
 * 
 * Centraliza a associação entre cada tipo de elemento (Section, Container, etc)
 * e seu ícone correspondente da lucide-react. Facilita adicionar novos tipos
 * de elementos sem modificar componentes de renderização.
 */

import {
  Layers,
  Box,
  Type,
  MousePointerClick,
  Image,
  List,
  Grid3x3,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * ELEMENT_ICONS - Mapa de tipo de elemento para componente de ícone
 *
 * Adicionar novos elementos:
 * 1. Importar o ícone desejado de lucide-react
 * 2. Adicionar uma entrada neste objeto com a chave sendo o tipo exato do elemento
 * 3. O valor é o componente de ícone (sem criar instância)
 *
 * @example
 * export const ELEMENT_ICONS: Record<string, LucideIcon> = {
 *   Section: Layers,
 *   Container: Box,
 *   Heading: Type,
 *   Button: MousePointerClick,
 *   Image: Image,
 *   List: List,
 *   Grid: Grid3x3,
 * };
 */
export const ELEMENT_ICONS: Record<string, LucideIcon> = {
  Section: Layers,
  Container: Box,
  Heading: Type,
  Button: MousePointerClick,
  Image: Image,
  List: List,
  Grid: Grid3x3,
};

/**
 * getElementIcon - Obtém o ícone para um tipo de elemento
 *
 * Retorna o ícone correspondente ou um ícone padrão (Settings) se o tipo
 * não estiver mapeado. Isso permite que elementos novos/customizados
 * ainda sejam renderizados corretamente.
 *
 * @param type - O tipo do elemento (ex: "Section", "Container")
 * @returns O componente de ícone lucide-react
 *
 * @example
 * const Icon = getElementIcon("Button");
 * return <Icon className="h-4 w-4" />;
 */
export function getElementIcon(type: string): LucideIcon {
  return ELEMENT_ICONS[type] || Settings;
}
