"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BackgroundSettings } from "./BackgroundSettings";
import { BorderSettings } from "./BorderSettings";
import { LayoutSettings } from "./LayoutSettings";

/**
 * SectionStyleForm - Formulário de estilos para elemento Section
 * 
 * Renderiza apenas os campos da aba "Estilo" organizados em Accordions:
 * - Layout: modo de largura (full-width/contained), padding, margin
 * - Fundo: tipo (solid/gradient/image), cores, ângulo
 * - Borda: largura, raio, estilo, cor (normal/hover)
 * 
 * Este componente espera estar dentro de um contexto <Form> do react-hook-form
 * e será renderizado dentro de um <TabsContent> pelo Inspector.
 * 
 * @example
 * <Form {...form}>
 *   <TabsContent value="style">
 *     <SectionStyleForm />
 *   </TabsContent>
 * </Form>
 */
export function SectionStyleForm() {
  return (
    <Accordion type="multiple" defaultValue={["layout", "background", "border"]} className="w-full">
      
      {/* Accordion: Layout */}
      <AccordionItem value="layout">
        <AccordionTrigger className="hover:no-underline hover:bg-muted/50 px-4 py-3">
          <span className="text-sm font-medium">Layout</span>
        </AccordionTrigger>
        <AccordionContent className="px-4 py-4">
          <LayoutSettings />
        </AccordionContent>
      </AccordionItem>

      {/* Accordion: Fundo */}
      <AccordionItem value="background">
        <AccordionTrigger className="hover:no-underline hover:bg-muted/50 px-4 py-3">
          <span className="text-sm font-medium">Fundo</span>
        </AccordionTrigger>
        <AccordionContent className="px-4 py-4">
          <BackgroundSettings />
        </AccordionContent>
      </AccordionItem>

      {/* Accordion: Borda */}
      <AccordionItem value="border">
        <AccordionTrigger className="hover:no-underline hover:bg-muted/50 px-4 py-3">
          <span className="text-sm font-medium">Borda</span>
        </AccordionTrigger>
        <AccordionContent className="px-4 py-4">
          <BorderSettings />
        </AccordionContent>
      </AccordionItem>

    </Accordion>
  );
}
