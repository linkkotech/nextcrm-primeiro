"use client";

import { useFormContext } from "react-hook-form";
import { TemplateBlock } from "@prisma/client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface SectionContentFormProps {
  block: TemplateBlock;
}

/**
 * SectionContentForm - Formulário de conteúdo para elemento Section
 * 
 * Renderiza apenas os campos da aba "Conteúdo":
 * - Nome da camada (layerName)
 * - ID do elemento (readonly)
 * 
 * Este componente espera estar dentro de um contexto <Form> do react-hook-form
 * e será renderizado dentro de um <TabsContent> pelo Inspector.
 * 
 * @example
 * <Form {...form}>
 *   <TabsContent value="content">
 *     <SectionContentForm block={block} />
 *   </TabsContent>
 * </Form>
 */
export function SectionContentForm({ block }: SectionContentFormProps) {
  const form = useFormContext();

  return (
    <div className="space-y-4">
      {/* Nome da Camada */}
      <FormField
        control={form.control}
        name="layerName"
        render={({ field }) => (
          <FormItem className="space-y-1.5">
            <FormLabel className="text-xs font-medium">Nome da Camada</FormLabel>
            <FormControl>
              <Input
                placeholder="ex: Hero Section"
                className="h-9"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* ID do Elemento (Readonly) */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium">ID do Elemento</label>
        <Input
          type="text"
          defaultValue={block.id}
          disabled
          className="bg-muted h-9"
        />
        <p className="text-xs text-muted-foreground">Identificador único do elemento</p>
      </div>
    </div>
  );
}
