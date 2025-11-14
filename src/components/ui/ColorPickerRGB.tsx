"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ColorPickerRGBProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
      .toUpperCase()
  );
}

export function ColorPickerRGB({
  value,
  onChange,
  placeholder = "#000000",
}: ColorPickerRGBProps) {
  const { r, g, b } = hexToRgb(value);

  const handleRgbChange = (newR: number, newG: number, newB: number) => {
    onChange(rgbToHex(newR, newG, newB));
  };

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
            RGB
          </Button>
        </DialogTrigger>
        <DialogContent className="w-auto">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Vermelho: {r}</Label>
              <input
                type="range"
                min="0"
                max="255"
                value={r}
                onChange={(e) =>
                  handleRgbChange(parseInt(e.target.value), g, b)
                }
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Verde: {g}</Label>
              <input
                type="range"
                min="0"
                max="255"
                value={g}
                onChange={(e) =>
                  handleRgbChange(r, parseInt(e.target.value), b)
                }
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Azul: {b}</Label>
              <input
                type="range"
                min="0"
                max="255"
                value={b}
                onChange={(e) =>
                  handleRgbChange(r, g, parseInt(e.target.value))
                }
                className="w-full"
              />
            </div>
            <div className="text-sm">
              <span className="font-medium">Resultado:</span> rgb({r}, {g}, {b})
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
