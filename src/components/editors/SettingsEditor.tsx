"use client";

import { useState, useCallback } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SettingsEditorProps {
  templateId: string;
  onSave?: (data: SettingsConfig) => void;
}

interface SettingsConfig {
  templateName: string;
  templateType: 'global' | 'cliente';
  clientSearch?: string;
  useAsGlobal?: boolean;
  urlSlug: string;
  customCSS: string;
  customJS: string;
}

export function SettingsEditor({ templateId, onSave }: SettingsEditorProps) {
  const [settingsConfig, setSettingsConfig] = useState<SettingsConfig>({
    templateName: "",
    templateType: "global",
    urlSlug: "",
    customCSS: "",
    customJS: "",
  });

  const handleTypeChange = useCallback((value: 'global' | 'cliente') => {
    setSettingsConfig((prev) => ({
      ...prev,
      templateType: value,
      // Limpar campos condicionais ao trocar tipo
      clientSearch: undefined,
      useAsGlobal: undefined,
    }));
  }, []);

  const handleSave = () => {
    onSave?.(settingsConfig);
  };

  return (
    <div className="py-6 px-4 max-w-2xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground">CONFIGURAÇÕES</h2>
      </div>

      {/* Card Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Configurações do Template</CardTitle>
          <CardDescription>
            Gerencie nome, tipo, URL e código personalizado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* SEÇÃO 1: Configurações do Template */}
          <section className="space-y-4">
            <h3 className="text-base font-semibold text-foreground">
              Configurações do Template
            </h3>

            {/* Nome do Template */}
            <div className="space-y-2">
              <Label htmlFor="template-name">Nome do template</Label>
              <Input
                id="template-name"
                value={settingsConfig.templateName}
                onChange={(e) =>
                  setSettingsConfig((prev) => ({
                    ...prev,
                    templateName: e.target.value,
                  }))
                }
                placeholder="Digite o nome do template"
              />
            </div>

            {/* Tipo de Template */}
            <div className="space-y-2">
              <Label htmlFor="template-type">Tipo de template</Label>
              <Select
                value={settingsConfig.templateType}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger id="template-type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="cliente">Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Renderização Condicional - Cliente */}
            {settingsConfig.templateType === 'cliente' && (
              <div className="space-y-2">
                <Label htmlFor="client-search">Cliente</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="client-search"
                    placeholder="Localizar e selecionar cliente..."
                    className="pl-8"
                    value={settingsConfig.clientSearch ?? ''}
                    onChange={(e) =>
                      setSettingsConfig((prev) => ({
                        ...prev,
                        clientSearch: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            )}

            {/* Renderização Condicional - Global */}
            {settingsConfig.templateType === 'global' && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="use-as-global"
                  checked={settingsConfig.useAsGlobal ?? false}
                  onCheckedChange={(checked) =>
                    setSettingsConfig((prev) => ({
                      ...prev,
                      useAsGlobal: checked,
                    }))
                  }
                />
                <Label htmlFor="use-as-global" className="cursor-pointer">
                  Usar como modelo global?
                </Label>
              </div>
            )}
          </section>

          {/* SEÇÃO 2: URL Curto */}
          <section className="space-y-4">
            <h3 className="text-base font-semibold text-foreground">
              URL Curto
            </h3>
            <div className="space-y-2">
              <Label htmlFor="url-slug">URL personalizada</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  linkko.app/
                </span>
                <Input
                  id="url-slug"
                  value={settingsConfig.urlSlug}
                  onChange={(e) =>
                    setSettingsConfig((prev) => ({
                      ...prev,
                      urlSlug: e.target.value,
                    }))
                  }
                  placeholder="meu-template"
                  className="flex-1"
                />
              </div>
            </div>
          </section>

          {/* SEÇÃO 3: Custom CSS/JS */}
          <section className="space-y-4">
            <h3 className="text-base font-semibold text-foreground">
              Custom CSS/JS
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Custom CSS */}
              <div className="space-y-2">
                <Label htmlFor="custom-css">Custom CSS</Label>
                <Textarea
                  id="custom-css"
                  rows={8}
                  value={settingsConfig.customCSS}
                  onChange={(e) =>
                    setSettingsConfig((prev) => ({
                      ...prev,
                      customCSS: e.target.value,
                    }))
                  }
                  placeholder="/* Seu CSS personalizado aqui */"
                  className="font-mono text-xs"
                />
              </div>

              {/* Custom JS */}
              <div className="space-y-2">
                <Label htmlFor="custom-js">Custom JS</Label>
                <Textarea
                  id="custom-js"
                  rows={8}
                  value={settingsConfig.customJS}
                  onChange={(e) =>
                    setSettingsConfig((prev) => ({
                      ...prev,
                      customJS: e.target.value,
                    }))
                  }
                  placeholder="// Seu JavaScript personalizado aqui"
                  className="font-mono text-xs"
                />
              </div>
            </div>
          </section>

          {/* Botão Salvar */}
          <Button onClick={handleSave} className="w-full">
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
