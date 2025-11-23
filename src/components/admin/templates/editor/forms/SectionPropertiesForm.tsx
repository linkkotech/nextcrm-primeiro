"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TemplateBlock } from "@prisma/client";
import { useEffect } from "react";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { EditorElement } from "@/types/editor";
import { sectionContentSchema } from "@/schemas/blocks/section.schema";

// Importar os componentes separados de cada aba
export { SectionContentForm } from "./SectionContentForm";
export { SectionStyleForm } from "./SectionStyleForm";
export { SectionAdvancedForm } from "./SectionAdvancedForm";

interface SectionPropertiesFormProps {
  block: TemplateBlock;
  selectedElement: EditorElement;
  onUpdateProps: (props: Partial<EditorElement["props"]>) => void;
  children: React.ReactNode;
}

/**
 * SectionPropertiesForm - Wrapper do formulário de propriedades para Section Element
 * 
 * Este componente gerencia o estado do react-hook-form e fornece o contexto
 * para os sub-componentes (SectionContentForm, SectionStyleForm, SectionAdvancedForm).
 * 
 * A estrutura de Tabs é controlada pelo Inspector.tsx, e este componente
 * apenas fornece o Form wrapper e uma nota informativa.
 * 
 * IMPORTANTE: Este formulário agora edita as PROPRIEDADES de um ELEMENTO Section,
 * não o conteúdo de um bloco do tipo SECTION.
 * 
 * O salvamento é feito pelo botão "Salvar" global no header, não por um botão individual.
 * 
 * @example
 * <SectionPropertiesForm 
 *   block={block}
 *   selectedElement={selectedElement}
 *   onUpdateProps={(props) => updateElementProps(selectedElement.id, props)}
 * >
 *   <TabsContent value="content">
 *     <SectionContentForm />
 *   </TabsContent>
 *   <TabsContent value="style">
 *     <SectionStyleForm />
 *   </TabsContent>
 *   <TabsContent value="advanced">
 *     <SectionAdvancedForm />
 *   </TabsContent>
 * </SectionPropertiesForm>
 */
export function SectionPropertiesForm({ 
  block, 
  selectedElement,
  onUpdateProps,
  children 
}: SectionPropertiesFormProps) {

  // Validar que o elemento é do tipo Section
  if (selectedElement.type !== "Section") {
    console.error("🔴 SectionPropertiesForm recebeu elemento do tipo:", selectedElement.type);
    return null;
  }

  const form = useForm({
    resolver: zodResolver(sectionContentSchema),
    defaultValues: selectedElement.props,
    mode: "onBlur", // Validar apenas quando campo perde foco
  });

  // Sincronizar formulário quando selectedElement muda
  useEffect(() => {
    console.log("🔄 [SectionPropertiesForm] Sincronizando form com selectedElement.props");
    form.reset(selectedElement.props);
  }, [selectedElement.id]); // Apenas quando o ID muda (elemento diferente selecionado)

  // Watch para propagação em tempo real
  useEffect(() => {
    const subscription = form.watch((data) => {
      console.log("👁️ [SectionPropertiesForm] Form watch detectou mudança:", data);
      onUpdateProps(data as any);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, onUpdateProps]);

  return (
    <Form {...form}>
      <div className="h-full flex flex-col">
        {/* Conteúdo das abas renderizado pelo Inspector */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </Form>
  );
}
