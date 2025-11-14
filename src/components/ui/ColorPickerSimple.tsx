"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ColorPickerSimpleProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const PRESET_COLORS = [
  "#000000", // Preto
  "#FFFFFF", // Branco
  "#FF0000", // Vermelho
  "#00FF00", // Verde
  "#0000FF", // Azul
  "#FFFF00", // Amarelo
  "#FF00FF", // Magenta
  "#00FFFF", // Ciano
  "#808080", // Cinza
  "#FFA500", // Laranja
  "#800080", // Roxo
  "#FFC0CB", // Rosa
];

export function ColorPickerSimple({
  value,
  onChange,
  placeholder = "#000000",
}: ColorPickerSimpleProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-6 h-6 rounded border border-border cursor-pointer"
        style={{ backgroundColor: value }}
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-24"
      />
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Presets
          </Button>
        </DialogTrigger>
        <DialogContent className="w-auto">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Cores Predefinidas</h3>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded border-2 border-border hover:border-primary transition-colors"
                  style={{ backgroundColor: color }}
                  onClick={() => onChange(color)}
                  title={color}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
