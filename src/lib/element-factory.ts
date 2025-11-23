/**
 * Element Factory - Factory para criar elementos padrão do editor
 * 
 * Centraliza a lógica de criação de elementos com valores padrão
 * para cada tipo de bloco (Section, Container, etc)
 */

import { EditorElement } from "@/types/editor";

/**
 * Gera um ID único para o elemento usando crypto.randomUUID()
 * @returns string - UUID v4
 */
function generateElementId(): string {
  return crypto.randomUUID();
}

/**
 * Cria um elemento Section padrão
 * 
 * Retorna um EditorElement com:
 * - ID único gerado no cliente
 * - Tipo "Section"
 * - Props padrão baseadas no sectionContentSchema:
 *   - layerName: "Nova Seção"
 *   - style.background: solid white
 *   - style.layout: contained com padding padrão
 *   - style.border: sem borda
 *   - advanced: customClass vazio, visível em todos os dispositivos
 * - Sem filhos inicialmente
 * 
 * @returns EditorElement - Elemento Section pronto para ser adicionado ao canvas
 * 
 * @example
 * const newSection = createDefaultSection();
 * setElements([...elements, newSection]);
 */
export function createDefaultSection(): EditorElement {
  return {
    id: generateElementId(),
    type: "Section",
    props: {
      layerName: "Nova Seção",
      style: {
        layout: {
          mode: "contained",
          padding: {
            top: 16,
            right: 16,
            bottom: 16,
            left: 16,
          },
          margin: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
        },
        background: {
          type: "solid",
          solidColor: "#ffffff",
        },
        border: {
          width: 0,
          radius: 0,
          style: "solid",
          color: "#000000",
        },
      },
      advanced: {
        customClass: "",
        visibility: [],
      },
    },
    children: [],
  };
}

/**
 * Cria um elemento Container padrão
 * 
 * @returns EditorElement - Elemento Container
 */
export function createDefaultContainer(): EditorElement {
  return {
    id: generateElementId(),
    type: "Container",
    props: {
      layerName: "Container",
      display: "flex",
      gap: 16,
      padding: {
        top: 16,
        right: 16,
        bottom: 16,
        left: 16,
      },
    },
    children: [],
  };
}

/**
 * Cria um elemento Heading padrão
 * 
 * @returns EditorElement - Elemento Heading
 */
export function createDefaultHeading(): EditorElement {
  return {
    id: generateElementId(),
    type: "Heading",
    props: {
      layerName: "Título",
      text: "Novo Título",
      content: "Novo Título", // Alias para compatibilidade
      level: "h1",
      alignment: "left",
      fontSize: 32,
      fontWeight: "700",
      color: "#000000",
    },
    children: [],
  };
}

/**
 * Cria um elemento Text padrão
 * 
 * @returns EditorElement - Elemento Text
 */
export function createDefaultText(): EditorElement {
  return {
    id: generateElementId(),
    type: "Text",
    props: {
      layerName: "Texto",
      content: "Clique para editar o texto",
      alignment: "left",
      fontSize: 16,
      fontWeight: "400",
      color: "#333333",
    },
    children: [],
  };
}

/**
 * Cria um elemento Button padrão
 * 
 * @returns EditorElement - Elemento Button
 */
export function createDefaultButton(): EditorElement {
  return {
    id: generateElementId(),
    type: "Button",
    props: {
      layerName: "Botão",
      text: "Clique aqui",
      label: "Clique aqui", // Alias para compatibilidade
      url: "",
      variant: "primary",
      size: "md",
      fullWidth: false,
      backgroundColor: "#000000",
      textColor: "#ffffff",
    },
    children: [],
  };
}

/**
 * Factory genérico para criar qualquer tipo de elemento
 * 
 * @param type - Tipo do elemento ("Section", "Container", etc)
 * @returns EditorElement - Elemento criado
 * @throws Error se o tipo não for reconhecido
 * 
 * @example
 * const element = createElement("Section");
 */
export function createElement(type: string): EditorElement {
  switch (type.toLowerCase()) {
    case "section":
      return createDefaultSection();
    case "container":
      return createDefaultContainer();
    case "heading":
      return createDefaultHeading();
    case "text":
      return createDefaultText();
    case "button":
      return createDefaultButton();
    default:
      throw new Error(`Tipo de elemento não suportado: ${type}`);
  }
}
