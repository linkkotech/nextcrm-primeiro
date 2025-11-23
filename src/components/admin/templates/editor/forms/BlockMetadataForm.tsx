"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

/**
 * 🎯 CONTROLLED COMPONENT PATTERN - BLUEPRINT PARA FORMULÁRIOS DE ELEMENTOS
 * 
 * Este componente serve como REFERÊNCIA ARQUITETURAL para todos os formulários
 * de propriedades no Page Builder (SectionPropertiesForm, HeadingPropertiesForm, etc.).
 * 
 * FILOSOFIA:
 * - "Dumb Component" / "Presentation Component" - SEM estado local
 * - Totalmente controlado via props (unidirectional data flow)
 * - Responsabilidade de gerenciamento de estado pertence ao COMPONENTE PAI
 * - Validação acontece NO PAI (Inspector ou BlockEditorClient)
 * 
 * FLUXO DE DADOS:
 * 1. Pai (BlockEditorClient) gerencia o estado blockContent
 * 2. Pai passa dados atuais (name, description) e callbacks (onNameChange, onDescriptionChange)
 * 3. Este componente renderiza UI e invoca callbacks quando usuário edita
 * 4. Callbacks atualizam estado no pai → re-render deste componente com novos valores
 * 5. Botão "Salvar" invoca onSave() que dispara validação + persistência no pai
 * 
 * BENEFÍCIOS:
 * - Single source of truth (estado vive em UM lugar apenas)
 * - Mais fácil de testar (componente puro, sem efeitos colaterais)
 * - Reutilizável (não tem lógica de negócio acoplada)
 * - Previsível (props in → UI out, sem surpresas)
 * 
 * COMO USAR ESTE BLUEPRINT PARA NOVOS FORMULÁRIOS:
 * 1. Identifique quais props do elemento você precisa editar (ex: alignment, fontSize, color)
 * 2. Crie props: value (para cada campo) + onChange (para cada campo) + onSave + isSaving
 * 3. Renderize inputs controlados com value={propValue} onChange={(e) => onPropChange(e.target.value)}
 * 4. NO PAI: gerencie estado, validação (Zod), e persistência (Server Action)
 * 
 * @example
 * // No componente pai (Inspector ou BlockEditorClient):
 * <BlockMetadataForm 
 *   name={blockContent.metadata.name}
 *   description={blockContent.metadata.description}
 *   onNameChange={(value) => updateMetadata({ ...metadata, name: value })}
 *   onDescriptionChange={(value) => updateMetadata({ ...metadata, description: value })}
 *   onSave={handleSaveMetadata}
 *   isSaving={isMetadataSaving}
 * />
 */

interface BlockMetadataFormProps {
  /** Nome atual do bloco (controlled value) */
  name: string;
  
  /** Descrição atual do bloco (controlled value, pode ser null) */
  description: string | null;
  
  /** Callback invocado quando o usuário edita o campo "Nome" */
  onNameChange: (value: string) => void;
  
  /** Callback invocado quando o usuário edita o campo "Descrição" */
  onDescriptionChange: (value: string) => void;
  
  /** Callback invocado quando o usuário clica em "Salvar Metadados" */
  onSave: () => void;
  
  /** Indica se o salvamento está em progresso (desabilita botão) */
  isSaving: boolean;
}

/**
 * BlockMetadataForm - Formulário CONTROLADO para editar metadados do bloco
 * 
 * Componente "burro" sem estado local. Toda lógica de validação, persistência
 * e gerenciamento de mudanças vive no componente pai.
 */
export function BlockMetadataForm({ 
  name, 
  description, 
  onNameChange, 
  onDescriptionChange, 
  onSave, 
  isSaving 
}: BlockMetadataFormProps) {
  return (
    <div className="p-4 space-y-4">
      {/* Campo: Nome do Bloco */}
      <div className="space-y-1.5">
        <Label htmlFor="block-name" className="text-xs font-medium">
          Nome do Bloco
        </Label>
        <Input
          id="block-name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="ex: Hero Principal"
          className="h-9"
        />
        <p className="text-xs text-muted-foreground">
          Identificador amigável para este bloco
        </p>
      </div>

      {/* Campo: Descrição */}
      <div className="space-y-1.5">
        <Label htmlFor="block-description" className="text-xs font-medium">
          Descrição (opcional)
        </Label>
        <Textarea
          id="block-description"
          value={description || ''}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Breve descrição sobre o propósito deste bloco..."
          rows={4}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Ajuda a identificar o bloco em listas e buscas
        </p>
      </div>

      {/* Botão Salvar */}
      <div className="pt-4 border-t">
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="w-full h-9"
        >
          {isSaving ? (
            <>
              <Save className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Salvar Metadados
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
