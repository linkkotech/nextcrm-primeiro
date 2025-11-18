"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

/**
 * Seção de Formato de Data e Hora
 * Permite configurar início da semana e formato de hora
 */
export function DateTimeSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Formato de data e hora</h2>
        <p className="text-sm text-muted-foreground">
          Escolha como os dados de hora e data são exibidos.
        </p>
      </div>

      {/* Início do Calendário */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Início do calendário da semana</Label>
        <RadioGroup defaultValue="monday">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="sunday" id="week-sunday" />
            <Label htmlFor="week-sunday" className="font-normal cursor-pointer">
              Domingo
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="monday" id="week-monday" />
            <Label htmlFor="week-monday" className="font-normal cursor-pointer">
              Segunda-feira
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Formato da Hora */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Formato da hora</Label>
        <RadioGroup defaultValue="24">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="24" id="time-24h" />
            <Label htmlFor="time-24h" className="font-normal cursor-pointer">
              24 horas
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="12" id="time-12h" />
            <Label htmlFor="time-12h" className="font-normal cursor-pointer">
              12 horas
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
