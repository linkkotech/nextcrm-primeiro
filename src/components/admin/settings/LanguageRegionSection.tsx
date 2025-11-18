"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LANGUAGES = [
  { value: "pt-BR", label: "Português (Brasil)" },
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
];

const TIMEZONES = [
  { value: "America/Sao_Paulo", label: "America/Sao Paulo" },
  { value: "America/New_York", label: "America/New York" },
  { value: "America/Los_Angeles", label: "America/Los Angeles" },
  { value: "America/Chicago", label: "America/Chicago" },
  { value: "Europe/London", label: "Europe/London" },
  { value: "Europe/Paris", label: "Europe/Paris" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo" },
  { value: "Australia/Sydney", label: "Australia/Sydney" },
];

/**
 * Seção de Idioma e Região
 * Permite selecionar idioma, fuso horário e preferências de notificação
 */
export function LanguageRegionSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Idioma e região</h2>
        <p className="text-sm text-muted-foreground">
          Personalize seu idioma e região.
        </p>
      </div>

      {/* Idioma */}
      <div className="space-y-2">
        <Label htmlFor="language">Idioma</Label>
        <Select defaultValue="pt-BR">
          <SelectTrigger id="language">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Fuso Horário */}
      <div className="space-y-2">
        <Label htmlFor="timezone">Fuso horário</Label>
        <Select defaultValue="America/Sao_Paulo">
          <SelectTrigger id="timezone">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIMEZONES.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                {tz.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Notificação de Alteração de Fuso Horário */}
      <div className="flex items-center gap-2">
        <Checkbox id="timezone-notification" />
        <Label htmlFor="timezone-notification" className="font-normal cursor-pointer">
          Notifique-me de alterações no fuso horário
        </Label>
      </div>
    </div>
  );
}
