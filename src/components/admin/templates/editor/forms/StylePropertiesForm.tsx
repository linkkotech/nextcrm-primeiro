"use client";

import { TemplateBlock } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { stylePropertiesSchema, StyleProperties, HeroContent } from "@/schemas/block-content.schemas";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColorPickerNative } from "@/components/ui/ColorPickerNative";
import { FourSidedInput, StateToggleTabs } from "../components";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

interface StylePropertiesFormProps {
  block: TemplateBlock;
  onSave?: (styles: StyleProperties) => Promise<void>;
}

/**
 * StylePropertiesForm - Formulário avançado para editar propriedades de estilo
 * 
 * Implementa a aba "Estilo" do Inspector com suporte a:
 * - Tipografia (tamanho, peso, espaçamento)
 * - Espaçamento (padding, margin)
 * - Borda (largura, raio, estilo)
 * - Sombra (offset, blur, spread, cor)
 * - Estados Normal e Hover
 * 
 * @example
 * <StylePropertiesForm block={block} />
 */
export function StylePropertiesForm({
  block,
  onSave,
}: StylePropertiesFormProps) {
  const [isSaving, setIsSaving] = useState(false);

  const defaultStyles: StyleProperties = (
    (block.content as HeroContent)?.styles || {}
  ) as StyleProperties;

  const form = useForm<StyleProperties>({
    resolver: zodResolver(stylePropertiesSchema),
    defaultValues: {
      fontSize: defaultStyles?.fontSize || 16,
      fontWeight: defaultStyles?.fontWeight || "400",
      letterSpacing: defaultStyles?.letterSpacing || 0,
      lineHeight: defaultStyles?.lineHeight || 1.5,
      padding: defaultStyles?.padding || { top: 0, right: 0, bottom: 0, left: 0 },
      margin: defaultStyles?.margin || { top: 0, right: 0, bottom: 0, left: 0 },
      borderWidth: defaultStyles?.borderWidth || 0,
      borderRadius: defaultStyles?.borderRadius || 0,
      borderStyle: defaultStyles?.borderStyle || "solid",
      shadowOffsetX: defaultStyles?.shadowOffsetX || 0,
      shadowOffsetY: defaultStyles?.shadowOffsetY || 0,
      shadowBlur: defaultStyles?.shadowBlur || 0,
      shadowSpread: defaultStyles?.shadowSpread || 0,
      normal: defaultStyles?.normal || {},
      hover: defaultStyles?.hover || {},
    },
  });

  async function onSubmit(data: StyleProperties) {
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(data);
      }
    } catch (error) {
      console.error("Erro ao salvar estilos:", error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <Accordion type="multiple" defaultValue={["typography"]} className="w-full">
          
          {/* Seção Tipografia */}
          <AccordionItem value="typography">
            <AccordionTrigger className="hover:no-underline hover:bg-muted/50 px-4 py-3">
              <span className="text-sm font-medium">Tipografia</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-4 space-y-4">
              
              {/* Tamanho da Fonte */}
              <FormField
                control={form.control}
                name="fontSize"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel style={{ fontSize: "0.875rem" }}>Tamanho: {field.value}px</FormLabel>
                    </div>
                    <FormControl>
                      <Slider
                        min={8}
                        max={100}
                        step={1}
                        value={[field.value || 16]}
                        onValueChange={(val) => field.onChange(val[0])}
                        className="w-full"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Peso da Fonte */}
              <FormField
                control={form.control}
                name="fontWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ fontSize: "0.875rem" }}>Peso</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="400">Normal (400)</SelectItem>
                        <SelectItem value="500">Médio (500)</SelectItem>
                        <SelectItem value="600">Semibold (600)</SelectItem>
                        <SelectItem value="700">Bold (700)</SelectItem>
                        <SelectItem value="800">Extra Bold (800)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Line Height */}
              <FormField
                control={form.control}
                name="lineHeight"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel style={{ fontSize: "0.875rem" }}>Altura da Linha: {field.value}</FormLabel>
                    </div>
                    <FormControl>
                      <Slider
                        min={1}
                        max={3}
                        step={0.1}
                        value={[field.value || 1.5]}
                        onValueChange={(val) => field.onChange(val[0])}
                        className="w-full"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Letter Spacing */}
              <FormField
                control={form.control}
                name="letterSpacing"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel style={{ fontSize: "0.875rem" }}>Espaçamento: {field.value}px</FormLabel>
                    </div>
                    <FormControl>
                      <Slider
                        min={-5}
                        max={10}
                        step={0.5}
                        value={[field.value || 0]}
                        onValueChange={(val) => field.onChange(val[0])}
                        className="w-full"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Seção Espaçamento */}
          <AccordionItem value="spacing">
            <AccordionTrigger className="hover:no-underline hover:bg-muted/50 px-4 py-3">
              <span className="text-sm font-medium">Espaçamento</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-4 space-y-4">
              
              {/* Padding */}
              <FormField
                control={form.control}
                name="padding"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FourSidedInput
                        label="Padding"
                        values={field.value || { top: 0, right: 0, bottom: 0, left: 0 }}
                        onChange={(val: any) => field.onChange(val)}
                        unit="px"
                        description="Espaço interno do elemento"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Margin */}
              <FormField
                control={form.control}
                name="margin"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FourSidedInput
                        label="Margin"
                        values={field.value || { top: 0, right: 0, bottom: 0, left: 0 }}
                        onChange={(val: any) => field.onChange(val)}
                        unit="px"
                        description="Espaço externo do elemento"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Seção Borda */}
          <AccordionItem value="border">
            <AccordionTrigger className="hover:no-underline hover:bg-muted/50 px-4 py-3">
              <span className="text-sm font-medium">Borda</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-4 space-y-4">
              
              {/* Border Width */}
              <FormField
                control={form.control}
                name="borderWidth"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel style={{ fontSize: "0.875rem" }}>Largura: {field.value}px</FormLabel>
                    </div>
                    <FormControl>
                      <Slider
                        min={0}
                        max={20}
                        step={1}
                        value={[field.value || 0]}
                        onValueChange={(val) => field.onChange(val[0])}
                        className="w-full"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Border Radius */}
              <FormField
                control={form.control}
                name="borderRadius"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel style={{ fontSize: "0.875rem" }}>Raio: {field.value}px</FormLabel>
                    </div>
                    <FormControl>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[field.value || 0]}
                        onValueChange={(val) => field.onChange(val[0])}
                        className="w-full"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Border Style */}
              <FormField
                control={form.control}
                name="borderStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ fontSize: "0.875rem" }}>Estilo</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="solid">Sólido</SelectItem>
                        <SelectItem value="dashed">Tracejado</SelectItem>
                        <SelectItem value="dotted">Pontilhado</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Border Color com State Toggle */}
              <StateToggleTabs
                label="Cor da Borda"
                normalContent={
                  <ColorPickerNative
                    value={form.watch("normal")?.borderColor || "#000000"}
                    onChange={(color) => {
                      const current = form.watch("normal") || {};
                      form.setValue("normal", { ...current, borderColor: color });
                    }}
                  />
                }
                hoverContent={
                  <ColorPickerNative
                    value={form.watch("hover")?.borderColor || "#000000"}
                    onChange={(color) => {
                      const current = form.watch("hover") || {};
                      form.setValue("hover", { ...current, borderColor: color });
                    }}
                  />
                }
              />
            </AccordionContent>
          </AccordionItem>

          {/* Seção Sombra */}
          <AccordionItem value="shadow">
            <AccordionTrigger className="hover:no-underline hover:bg-muted/50 px-4 py-3">
              <span className="text-sm font-medium">Sombra</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-4 space-y-4">
              
              {/* Shadow Offset X */}
              <FormField
                control={form.control}
                name="shadowOffsetX"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel style={{ fontSize: "0.875rem" }}>Offset Horizontal: {field.value}px</FormLabel>
                    </div>
                    <FormControl>
                      <Slider
                        min={-50}
                        max={50}
                        step={1}
                        value={[field.value || 0]}
                        onValueChange={(val) => field.onChange(val[0])}
                        className="w-full"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Shadow Offset Y */}
              <FormField
                control={form.control}
                name="shadowOffsetY"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel style={{ fontSize: "0.875rem" }}>Offset Vertical: {field.value}px</FormLabel>
                    </div>
                    <FormControl>
                      <Slider
                        min={-50}
                        max={50}
                        step={1}
                        value={[field.value || 0]}
                        onValueChange={(val) => field.onChange(val[0])}
                        className="w-full"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Shadow Blur */}
              <FormField
                control={form.control}
                name="shadowBlur"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel style={{ fontSize: "0.875rem" }}>Desfoque: {field.value}px</FormLabel>
                    </div>
                    <FormControl>
                      <Slider
                        min={0}
                        max={50}
                        step={1}
                        value={[field.value || 0]}
                        onValueChange={(val) => field.onChange(val[0])}
                        className="w-full"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Shadow Spread */}
              <FormField
                control={form.control}
                name="shadowSpread"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel style={{ fontSize: "0.875rem" }}>Expansão: {field.value}px</FormLabel>
                    </div>
                    <FormControl>
                      <Slider
                        min={-20}
                        max={50}
                        step={1}
                        value={[field.value || 0]}
                        onValueChange={(val) => field.onChange(val[0])}
                        className="w-full"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Shadow Color com State Toggle */}
              <StateToggleTabs
                label="Cor da Sombra"
                normalContent={
                  <ColorPickerNative
                    value={form.watch("normal")?.shadowColor || "#000000"}
                    onChange={(color) => {
                      const current = form.watch("normal") || {};
                      form.setValue("normal", { ...current, shadowColor: color });
                    }}
                  />
                }
                hoverContent={
                  <ColorPickerNative
                    value={form.watch("hover")?.shadowColor || "#000000"}
                    onChange={(color) => {
                      const current = form.watch("hover") || {};
                      form.setValue("hover", { ...current, shadowColor: color });
                    }}
                  />
                }
              />
            </AccordionContent>
          </AccordionItem>

          {/* Seção Cores */}
          <AccordionItem value="colors">
            <AccordionTrigger className="hover:no-underline hover:bg-muted/50 px-4 py-3">
              <span className="text-sm font-medium">Cores</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-4 space-y-4">
              
              {/* Text Color com State Toggle */}
              <StateToggleTabs
                label="Cor do Texto"
                normalContent={
                  <ColorPickerNative
                    value={form.watch("normal")?.textColor || "#000000"}
                    onChange={(color) => {
                      const current = form.watch("normal") || {};
                      form.setValue("normal", { ...current, textColor: color });
                    }}
                  />
                }
                hoverContent={
                  <ColorPickerNative
                    value={form.watch("hover")?.textColor || "#000000"}
                    onChange={(color) => {
                      const current = form.watch("hover") || {};
                      form.setValue("hover", { ...current, textColor: color });
                    }}
                  />
                }
              />

              {/* Background Color com State Toggle */}
              <StateToggleTabs
                label="Cor de Fundo"
                normalContent={
                  <ColorPickerNative
                    value={form.watch("normal")?.backgroundColor || "#ffffff"}
                    onChange={(color) => {
                      const current = form.watch("normal") || {};
                      form.setValue("normal", { ...current, backgroundColor: color });
                    }}
                  />
                }
                hoverContent={
                  <ColorPickerNative
                    value={form.watch("hover")?.backgroundColor || "#ffffff"}
                    onChange={(color) => {
                      const current = form.watch("hover") || {};
                      form.setValue("hover", { ...current, backgroundColor: color });
                    }}
                  />
                }
              />
            </AccordionContent>
          </AccordionItem>

        </Accordion>

        {/* Botões de Ação */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            type="submit"
            className="flex-1"
            disabled={isSaving}
          >
            {isSaving ? "Salvando..." : "Salvar Estilos"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => form.reset()}
            title="Restaurar valores padrão"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
