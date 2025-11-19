"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Sun, Moon, Zap } from "lucide-react";

const THEME_COLORS = [
  { name: "Dark", value: "#1f2937", checked: true },
  { name: "Blue", value: "#3b82f6" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Pink", value: "#ec4899" },
  { name: "Purple", value: "#a855f7" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Orange", value: "#f97316" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Gray", value: "#9ca3af" },
  { name: "Green", value: "#22c55e" },
];

/**
 * Seção de Aparência - Gerencia tema, modo de exibição e contraste
 */
export function AppearanceSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Aparência</h2>
        <p className="text-sm text-muted-foreground">
          Escolha seu tema preferido para o aplicativo.
        </p>
      </div>

      {/* Cor do Tema */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Cor do tema</Label>
        <p className="text-sm text-muted-foreground">
          Escolha seu tema preferido para o aplicativo.
        </p>
        <div className="flex flex-wrap gap-3">
          {THEME_COLORS.map((color) => (
            <button
              key={color.value}
              className={`h-10 w-10 rounded-md border-2 transition-all ${
                color.checked ? "border-foreground" : "border-transparent"
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Modo de Exibição */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Aparência</Label>
        <p className="text-sm text-muted-foreground">
          Escolha o modo claro ou escuro, ou alterne automaticamente com base nas configurações do sistema.
        </p>
        <ToggleGroup type="single" defaultValue="light" className="justify-start gap-2">
          <ToggleGroupItem value="light" className="gap-2">
            <Sun className="h-4 w-4" />
            <span className="hidden sm:inline">Claro</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="dark" className="gap-2">
            <Moon className="h-4 w-4" />
            <span className="hidden sm:inline">Escuro</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="auto" className="gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Auto</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Alto Contraste */}
      <div className="flex items-center justify-between rounded-lg border border-border p-4">
        <div className="space-y-1">
          <Label className="text-base font-medium">Contraste</Label>
          <p className="text-sm text-muted-foreground">
            Ative e desative texto e bordas de alto contraste.
          </p>
        </div>
        <Switch />
      </div>
    </div>
  );
}
