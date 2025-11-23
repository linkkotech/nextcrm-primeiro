"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FourSidedInput } from "../components";
import { Maximize, Container } from "lucide-react";

/**
 * INSPECTOR FORM DESIGN STANDARDS
 * ================================
 * - Input height: h-9 (36px) via Tailwind or size="sm"
 * - Label spacing: space-y-1.5 between label and control
 * - Section spacing: space-y-4 between form groups
 * - Flex gaps: gap-2 for inline elements, items-center for alignment
 * - Label font: text-xs font-medium for consistency
 * - Exceptions: Document with inline comments (e.g., color pickers h-10)
 */

/**
 * LayoutSettings - Componente para configurar layout de um elemento (Section)
 *
 * Fornece controles para:
 * - Modo de largura (full-width ou contained)
 * - Padding (espaço interno)
 * - Margin (espaço externo)
 *
 * @example
 * <LayoutSettings />
 */
export function LayoutSettings() {
  const form = useFormContext();

  return (
    <div className="space-y-4">
      {/* Layout Mode */}
      <FormField
        control={form.control}
        name="style.layout.mode"
        render={({ field }) => (
          <FormItem className="space-y-1.5">
            <FormLabel className="text-xs font-medium">Largura do Conteúdo</FormLabel>
            <FormControl>
              <ToggleGroup
                type="single"
                value={field.value || "contained"}
                onValueChange={field.onChange}
                className="justify-start h-9"
              >
                <ToggleGroupItem value="contained" aria-label="Largura Contida" className="gap-2 h-9">
                  <Container className="h-4 w-4" />
                  <span className="text-xs">Contido</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="full-width" aria-label="Largura Total" className="gap-2 h-9">
                  <Maximize className="h-4 w-4" />
                  <span className="text-xs">Largura Total</span>
                </ToggleGroupItem>
              </ToggleGroup>
            </FormControl>
          </FormItem>
        )}
      />

      {/* Padding */}
      <FormField
        control={form.control}
        name="style.layout.padding"
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
        name="style.layout.margin"
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
    </div>
  );
}
