"use client";

import { useFormContext, Controller } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ColorPickerNative } from "@/components/ui/ColorPickerNative";
import { Palette, Zap } from "lucide-react";

/**
 * BackgroundSettings - Componente para configurar background de um elemento
 *
 * Suporta três tipos de background:
 * - Solid: cor sólida simples
 * - Gradient: gradiente linear com 2 cores e ângulo
 * - Image: upload de imagem (placeholder)
 *
 * Usa watch() para renderizar condicionalmente os controles baseado no tipo selecionado.
 *
 * @example
 * <BackgroundSettings />
 */
export function BackgroundSettings() {
  const form = useFormContext();
  const backgroundType = form.watch("style.background.type") || "solid";

  return (
    <div className="space-y-4">
      {/* Toggle entre tipos de fundo */}
      <FormField
        control={form.control}
        name="style.background.type"
        render={({ field }) => (
          <FormItem className="space-y-1.5">
            <FormLabel className="text-xs font-medium">Tipo de Fundo</FormLabel>
            <FormControl>
              <ToggleGroup
                type="single"
                value={field.value || "solid"}
                onValueChange={field.onChange}
                className="justify-start h-9"
              >
                <ToggleGroupItem value="solid" aria-label="Cor Sólida" className="gap-2 h-9 px-4">
                  <Palette className="h-4 w-4" />
                  <span className="text-xs">Sólida</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="gradient" aria-label="Gradiente" className="gap-2 h-9 px-4">
                  <Zap className="h-4 w-4" />
                  <span className="text-xs">Gradiente</span>
                </ToggleGroupItem>
              </ToggleGroup>
            </FormControl>
          </FormItem>
        )}
      />

      {/* Renderização condicional baseada no tipo */}

      {/* SOLID - Cor Sólida */}
      {backgroundType === "solid" && (
        <FormField
          control={form.control}
          name="style.background.solidColor"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-xs font-medium">Cor</FormLabel>
              <FormControl>
                <ColorPickerNative
                  value={field.value || "#ffffff"}
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      )}

      {/* GRADIENT - 2 Cores + Ângulo */}
      {backgroundType === "gradient" && (
        <>
          <FormField
            control={form.control}
            name="style.background.gradientColor1"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs font-medium">Cor 1</FormLabel>
                <FormControl>
                  <ColorPickerNative
                    value={field.value || "#ffffff"}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="style.background.gradientColor2"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs font-medium">Cor 2</FormLabel>
                <FormControl>
                  <ColorPickerNative
                    value={field.value || "#000000"}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="style.background.gradientAngle"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-xs font-medium">
                    Ângulo: {field.value}°
                  </FormLabel>
                </div>
                <FormControl>
                  <Slider
                    min={0}
                    max={360}
                    step={1}
                    value={[field.value || 90]}
                    onValueChange={(val) => field.onChange(val[0])}
                    className="w-full"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
}
