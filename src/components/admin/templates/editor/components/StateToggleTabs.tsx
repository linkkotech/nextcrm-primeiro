"use client";

import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

interface StateToggleTabsProps {
  label?: string;
  description?: string;
  normalContent: ReactNode;
  hoverContent: ReactNode;
  defaultState?: "normal" | "hover";
}

/**
 * StateToggleTabs - Componente para gerenciar dois estados visuais
 * 
 * Renderiza abas para alternar entre "Normal" (padrão) e "Ao passar o mouse" (hover).
 * Útil para controlar propriedades que mudam em estados diferentes (cores, sombras, etc).
 * 
 * @example
 * <StateToggleTabs
 *   label="Cor do Texto"
 *   normalContent={<ColorPicker value={normalColor} onChange={setNormalColor} />}
 *   hoverContent={<ColorPicker value={hoverColor} onChange={setHoverColor} />}
 * />
 * 
 * @returns Componente Tabs com dois estados
 */
export function StateToggleTabs({
  label,
  description,
  normalContent,
  hoverContent,
  defaultState = "normal",
}: StateToggleTabsProps) {
  return (
    <div className="space-y-3">
      {label && (
        <div>
          <Label className="text-sm font-medium">{label}</Label>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      )}

      <Tabs defaultValue={defaultState} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-md">
          <TabsTrigger
            value="normal"
            className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-sm"
          >
            Normal
          </TabsTrigger>
          <TabsTrigger
            value="hover"
            className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-sm"
          >
            Ao passar o mouse
          </TabsTrigger>
        </TabsList>

        <TabsContent value="normal" className="mt-4">
          {normalContent}
        </TabsContent>

        <TabsContent value="hover" className="mt-4">
          {hoverContent}
        </TabsContent>
      </Tabs>
    </div>
  );
}
