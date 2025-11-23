"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColorPickerNative } from "@/components/ui/ColorPickerNative";
import { StateToggleTabs } from "../components";

/**
 * BorderSettings - Componente para configurar borda de um elemento
 *
 * Fornece controles para:
 * - Largura da borda (0-20px)
 * - Raio da borda (0-100px)
 * - Estilo (sólido, tracejado, pontilhado)
 * - Cor com suporte a Normal/Hover via StateToggleTabs
 *
 * @example
 * <BorderSettings />
 */
export function BorderSettings() {
  const form = useFormContext();

  return (
    <div className="space-y-4">
      {/* Border Width */}
      <FormField
        control={form.control}
        name="style.border.width"
        render={({ field }) => (
          <FormItem className="space-y-1.5">
            <div className="flex items-center justify-between mb-1">
              <FormLabel className="text-xs font-medium">
                Largura: {field.value}px
              </FormLabel>
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
        name="style.border.radius"
        render={({ field }) => (
          <FormItem className="space-y-1.5">
            <div className="flex items-center justify-between mb-1">
              <FormLabel className="text-xs font-medium">
                Raio: {field.value}px
              </FormLabel>
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
        name="style.border.style"
        render={({ field }) => (
          <FormItem className="space-y-1.5">
            <FormLabel className="text-xs font-medium">Estilo</FormLabel>
            <Select value={field.value || "solid"} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="h-9">
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
          <FormField
            control={form.control}
            name="style.border.color"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ColorPickerNative
                    value={field.value || "#000000"}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        }
        hoverContent={
          <FormField
            control={form.control}
            name="style.border.colorHover"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ColorPickerNative
                    value={field.value || "#000000"}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        }
      />
    </div>
  );
}
