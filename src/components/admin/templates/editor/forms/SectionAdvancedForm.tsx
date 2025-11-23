"use client";

import { useFormContext } from "react-hook-form";
import { Smartphone, Tablet, Monitor } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

/**
 * SectionAdvancedForm - Formulário de configurações avançadas para elemento Section
 * 
 * Renderiza apenas os campos da aba "Avançado":
 * - CSS customizado (textarea)
 * - Regras de visibilidade por dispositivo (mobile/tablet/desktop)
 * 
 * Este componente espera estar dentro de um contexto <Form> do react-hook-form
 * e será renderizado dentro de um <TabsContent> pelo Inspector.
 * 
 * @example
 * <Form {...form}>
 *   <TabsContent value="advanced">
 *     <SectionAdvancedForm />
 *   </TabsContent>
 * </Form>
 */
export function SectionAdvancedForm() {
  const form = useFormContext();

  return (
    <div className="space-y-4">
      {/* CSS Customizado */}
      <FormField
        control={form.control}
        name="advanced.customClass"
        render={({ field }) => (
          <FormItem className="space-y-1.5">
            <FormLabel className="text-xs font-medium">Classes CSS Customizadas</FormLabel>
            <FormControl>
              <Textarea
                placeholder="ex: my-custom-class another-class"
                {...field}
                rows={3}
                className="resize-none"
              />
            </FormControl>
            <p className="text-xs text-muted-foreground">
              Adicione classes CSS customizadas separadas por espaço
            </p>
          </FormItem>
        )}
      />

      {/* Visibilidade por Dispositivo */}
      <FormField
        control={form.control}
        name="advanced.visibility"
        render={({ field }) => (
          <FormItem className="space-y-1.5">
            <FormLabel className="text-xs font-medium">Esconder em Dispositivos</FormLabel>
            <FormControl>
              <ToggleGroup
                type="multiple"
                value={field.value || []}
                onValueChange={field.onChange}
                className="justify-start"
              >
                <ToggleGroupItem value="mobile" aria-label="Esconder em Mobile" className="gap-1">
                  <Smartphone className="h-4 w-4" />
                  Mobile
                </ToggleGroupItem>
                <ToggleGroupItem value="tablet" aria-label="Esconder em Tablet" className="gap-1">
                  <Tablet className="h-4 w-4" />
                  Tablet
                </ToggleGroupItem>
                <ToggleGroupItem value="desktop" aria-label="Esconder em Desktop" className="gap-1">
                  <Monitor className="h-4 w-4" />
                  Desktop
                </ToggleGroupItem>
              </ToggleGroup>
            </FormControl>
            <p className="text-xs text-muted-foreground">
              Selecione os dispositivos em que este elemento deve estar oculto
            </p>
          </FormItem>
        )}
      />
    </div>
  );
}
