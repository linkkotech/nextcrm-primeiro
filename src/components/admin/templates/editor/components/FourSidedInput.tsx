"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link2, Link2Off } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FourSidedValues {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface FourSidedInputProps {
  label: string;
  values: FourSidedValues;
  onChange: (values: FourSidedValues) => void;
  unit?: string;
  description?: string;
  min?: number;
  max?: number;
}

/**
 * FourSidedInput - Componente para editar valores independentes em 4 lados
 * 
 * Renderiza 4 inputs numéricos (Top/Right/Bottom/Left) com um botão de "link"
 * para sincronizar todos os valores simultaneamente. Segue o padrão do Elementor.
 * 
 * @example
 * <FourSidedInput
 *   label="Padding"
 *   values={{ top: 10, right: 15, bottom: 10, left: 15 }}
 *   onChange={(vals) => console.log(vals)}
 *   unit="px"
 * />
 * 
 * @throws Não há validações de erro específicas
 * @returns Componente renderizado com controles de 4 lados
 */
export function FourSidedInput({
  label,
  values,
  onChange,
  unit = "px",
  description,
  min = 0,
  max = 1000,
}: FourSidedInputProps) {
  const [isLinked, setIsLinked] = useState(false);
  const [localValues, setLocalValues] = useState<FourSidedValues>(values);

  // Sincronizar valores locais quando props mudam
  useEffect(() => {
    setLocalValues(values);
  }, [values]);

  // IMPORTANTE: Quando modo "link" está ativo, todos os valores são sincronizados
  // ao alterar qualquer um deles. Isso é útil para propriedades que usualmente
  // precisam ser uniformes (ex: padding geral, border radius)
  const handleChange = (side: keyof FourSidedValues, value: number) => {
    let newValues: FourSidedValues;

    if (isLinked) {
      // Se vinculado, atualizar todos os lados
      newValues = { top: value, right: value, bottom: value, left: value };
    } else {
      // Se não vinculado, atualizar apenas o lado específico
      newValues = { ...localValues, [side]: value };
    }

    setLocalValues(newValues);
    onChange(newValues);
  };

  const handleLinkToggle = () => {
    if (!isLinked) {
      // Ao vincular, usar o valor do "top" para todos os lados
      const syncValue = localValues.top;
      const newValues: FourSidedValues = {
        top: syncValue,
        right: syncValue,
        bottom: syncValue,
        left: syncValue,
      };
      setLocalValues(newValues);
      onChange(newValues);
    }
    setIsLinked(!isLinked);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">{label}</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleLinkToggle}
          className={cn(
            "h-7 w-7 p-0 transition-colors",
            isLinked
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "text-muted-foreground hover:text-foreground"
          )}
          title={isLinked ? "Desvinculado os valores" : "Vincular os valores"}
        >
          {isLinked ? (
            <Link2 className="h-4 w-4" />
          ) : (
            <Link2Off className="h-4 w-4" />
          )}
        </Button>
      </div>

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {/* Grid 2x2 para os 4 inputs */}
      <div className="grid grid-cols-2 gap-2">
        {/* Top */}
        <div className="flex flex-col gap-1">
          <label className="text-muted-foreground uppercase tracking-wide" style={{ fontSize: "0.65rem" }}>
            Superior
          </label>
          <div className="relative flex items-center">
            <Input
              type="number"
              value={localValues.top}
              onChange={(e) => handleChange("top", parseInt(e.target.value) || 0)}
              min={min}
              max={max}
              className="pr-8 h-9"
            />
            <span className="absolute right-3 text-xs text-muted-foreground pointer-events-none">
              {unit}
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-1">
          <label className="text-muted-foreground uppercase tracking-wide" style={{ fontSize: "0.65rem" }}>
            Direita
          </label>
          <div className="relative flex items-center">
            <Input
              type="number"
              value={localValues.right}
              onChange={(e) => handleChange("right", parseInt(e.target.value) || 0)}
              min={min}
              max={max}
              className="pr-8 h-9"
            />
            <span className="absolute right-3 text-xs text-muted-foreground pointer-events-none">
              {unit}
            </span>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-1">
          <label className="text-muted-foreground uppercase tracking-wide" style={{ fontSize: "0.65rem" }}>
            Inferior
          </label>
          <div className="relative flex items-center">
            <Input
              type="number"
              value={localValues.bottom}
              onChange={(e) =>
                handleChange("bottom", parseInt(e.target.value) || 0)
              }
              min={min}
              max={max}
              className="pr-8 h-9"
            />
            <span className="absolute right-3 text-xs text-muted-foreground pointer-events-none">
              {unit}
            </span>
          </div>
        </div>

        {/* Left */}
        <div className="flex flex-col gap-1">
          <label className="text-muted-foreground uppercase tracking-wide" style={{ fontSize: "0.65rem" }}>
            Esquerda
          </label>
          <div className="relative flex items-center">
            <Input
              type="number"
              value={localValues.left}
              onChange={(e) => handleChange("left", parseInt(e.target.value) || 0)}
              min={min}
              max={max}
              className="pr-8 h-9"
            />
            <span className="absolute right-3 text-xs text-muted-foreground pointer-events-none">
              {unit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
