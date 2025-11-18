"use client";

import { useState, useCallback } from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ColorPickerNative } from "@/components/ui/ColorPickerNative";

interface DesignEditorProps {
  templateId: string;
  onSave?: (data: DesignConfig) => void;
}

interface DesignConfig {
  heroModel: 'biolink' | 'biopremium' | 'biopublic';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
  };
  typography: {
    fontFamily: string;
    fontSize: number;
  };
  spacing: {
    contentWidth: string;
    blockSpacing: string;
  };
  buttonBorder: {
    width: number;
    color: string;
    radius: string;
    style: string;
  };
  shadow: {
    hOffset: number;
    vOffset: number;
    blur: number;
    spread: number;
    color: string;
  };
}

export function DesignEditor({ templateId, onSave }: DesignEditorProps) {
  const [designConfig, setDesignConfig] = useState<DesignConfig>({
    heroModel: 'biolink',
    colors: {
      primary: "#373F4B",
      secondary: "#9CA3AF",
      accent: "#E5E7EB",
      text: "#1F2937",
    },
    typography: {
      fontFamily: "Inter",
      fontSize: 16,
    },
    spacing: {
      contentWidth: "medio",
      blockSpacing: "medio",
    },
    buttonBorder: {
      width: 2,
      color: "#1F2937",
      radius: "arredondado",
      style: "solid",
    },
    shadow: {
      hOffset: 0,
      vOffset: 0,
      blur: 5,
      spread: 0,
      color: "#1F2937",
    },
  });

  // ✅ Usar useCallback para evitar re-criação das funções
  const handleColorChange = useCallback((field: keyof DesignConfig['colors'], color: string) => {
    setDesignConfig((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [field]: color,
      },
    }));
  }, []);

  const handleBorderColorChange = useCallback((color: string) => {
    setDesignConfig((prev) => ({
      ...prev,
      buttonBorder: {
        ...prev.buttonBorder,
        color,
      },
    }));
  }, []);

  const handleShadowColorChange = useCallback((color: string) => {
    setDesignConfig((prev) => ({
      ...prev,
      shadow: {
        ...prev.shadow,
        color,
      },
    }));
  }, []);

  const handleHeroModelChange = useCallback((model: 'biolink' | 'biopremium' | 'biopublic') => {
    setDesignConfig((prev) => ({
      ...prev,
      heroModel: model,
    }));
  }, []);

  const handleSave = () => {
    onSave?.(designConfig);
  };

  return (
    <div className="py-6 px-4 max-w-2xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground">DESIGN</h2>
      </div>

      {/* Card Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personalização do Template</CardTitle>
          <CardDescription>
            Configure cores, fontes, espaçamentos e estilos visuais do seu template
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Seção: Modelo de Hero */}
          <section className="space-y-4">
            <h3 className="text-base font-semibold text-foreground">
              Modelo de Hero
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {/* BioLink Card */}
              <button
                type="button"
                onClick={() => handleHeroModelChange('biolink')}
                className={`relative p-4 rounded-lg border-2 transition-all hover:border-primary/50 ${
                  designConfig.heroModel === 'biolink'
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-full h-24 rounded-md bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                    <span className="text-slate-100 font-semibold text-sm">Preview</span>
                  </div>
                  <span className="text-sm font-medium">BioLink</span>
                </div>
                {designConfig.heroModel === 'biolink' && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>

              {/* BioPremium Card */}
              <button
                type="button"
                onClick={() => handleHeroModelChange('biopremium')}
                className={`relative p-4 rounded-lg border-2 transition-all hover:border-primary/50 ${
                  designConfig.heroModel === 'biopremium'
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-full h-24 rounded-md bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                    <span className="text-slate-100 font-semibold text-sm">Preview</span>
                  </div>
                  <span className="text-sm font-medium">BioPremium</span>
                </div>
                {designConfig.heroModel === 'biopremium' && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>

              {/* BioPublic Card */}
              <button
                type="button"
                onClick={() => handleHeroModelChange('biopublic')}
                className={`relative p-4 rounded-lg border-2 transition-all hover:border-primary/50 ${
                  designConfig.heroModel === 'biopublic'
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-full h-24 rounded-md bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
                    <span className="text-slate-100 font-semibold text-sm">Preview</span>
                  </div>
                  <span className="text-sm font-medium">BioPublic</span>
                </div>
                {designConfig.heroModel === 'biopublic' && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </section>

          {/* Seção 1: Cor do Template */}
          <section className="space-y-4">
            <h3 className="text-base font-semibold text-foreground">
              Cor do Template
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Primária</Label>
                <ColorPickerNative
                  value={designConfig.colors.primary}
                  onChange={(color) => handleColorChange('primary', color)}
                />
              </div>
              <div className="space-y-2">
                <Label>Secundária</Label>
                <ColorPickerNative
                  value={designConfig.colors.secondary}
                  onChange={(color) => handleColorChange('secondary', color)}
                />
              </div>
              <div className="space-y-2">
                <Label>Acentuada</Label>
                <ColorPickerNative
                  value={designConfig.colors.accent}
                  onChange={(color) => handleColorChange('accent', color)}
                />
              </div>
              <div className="space-y-2">
                <Label>Texto</Label>
                <ColorPickerNative
                  value={designConfig.colors.text}
                  onChange={(color) => handleColorChange('text', color)}
                />
              </div>
            </div>
          </section>

          {/* Seção 2: Tipografia */}
          <section className="space-y-4">
            <h3 className="text-base font-semibold text-foreground">Tipografia</h3>
            <div className="space-y-4">
              {/* Font Family */}
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select
                  value={designConfig.typography.fontFamily}
                  onValueChange={(value) =>
                    setDesignConfig((prev) => ({
                      ...prev,
                      typography: { ...prev.typography, fontFamily: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma fonte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Montserrat">Montserrat</SelectItem>
                    <SelectItem value="Poppins">Poppins</SelectItem>
                    <SelectItem value="Arial">Arial</SelectItem>
                    <SelectItem value="Georgia">Georgia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tamanho da Fonte */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Tamanho da Fonte</Label>
                  <span className="text-sm text-muted-foreground">
                    {designConfig.typography.fontSize}px
                  </span>
                </div>
                <Slider
                  min={13}
                  max={18}
                  step={1}
                  value={[designConfig.typography.fontSize]}
                  onValueChange={(value) =>
                    setDesignConfig((prev) => ({
                      ...prev,
                      typography: { ...prev.typography, fontSize: value[0] },
                    }))
                  }
                />
              </div>
            </div>
          </section>

          {/* Seção 3: Espaçamento */}
          <section className="space-y-4">
            <h3 className="text-base font-semibold text-foreground">Espaçamento</h3>
            <div className="space-y-4">
              {/* Largura do Conteúdo */}
              <div className="space-y-2">
                <Label>Largura do Conteúdo</Label>
                <RadioGroup
                  value={designConfig.spacing.contentWidth}
                  onValueChange={(value) =>
                    setDesignConfig((prev) => ({
                      ...prev,
                      spacing: { ...prev.spacing, contentWidth: value },
                    }))
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pequeno" id="width-small" />
                    <Label htmlFor="width-small" className="font-normal cursor-pointer">
                      Pequeno
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medio" id="width-medium" />
                    <Label htmlFor="width-medium" className="font-normal cursor-pointer">
                      Médio
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="grande" id="width-large" />
                    <Label htmlFor="width-large" className="font-normal cursor-pointer">
                      Grande
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Espaçamento do Bloco */}
              <div className="space-y-2">
                <Label>Espaçamento do Bloco</Label>
                <RadioGroup
                  value={designConfig.spacing.blockSpacing}
                  onValueChange={(value) =>
                    setDesignConfig((prev) => ({
                      ...prev,
                      spacing: { ...prev.spacing, blockSpacing: value },
                    }))
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pequeno" id="spacing-small" />
                    <Label htmlFor="spacing-small" className="font-normal cursor-pointer">
                      Pequeno
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medio" id="spacing-medium" />
                    <Label htmlFor="spacing-medium" className="font-normal cursor-pointer">
                      Médio
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="grande" id="spacing-large" />
                    <Label htmlFor="spacing-large" className="font-normal cursor-pointer">
                      Grande
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="extra" id="spacing-extra" />
                    <Label htmlFor="spacing-extra" className="font-normal cursor-pointer">
                      Extra
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </section>

          {/* Seção 4: Configurações de Borda dos Botões */}
          <section className="space-y-4">
            <h3 className="text-base font-semibold text-foreground">
              Configurações de Borda dos Botões
            </h3>
            <div className="space-y-4">
              {/* Border Width */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Border Width</Label>
                  <span className="text-sm text-muted-foreground">
                    {designConfig.buttonBorder.width}px
                  </span>
                </div>
                <Slider
                  min={0}
                  max={5}
                  step={1}
                  value={[designConfig.buttonBorder.width]}
                  onValueChange={(value) =>
                    setDesignConfig((prev) => ({
                      ...prev,
                      buttonBorder: { ...prev.buttonBorder, width: value[0] },
                    }))
                  }
                />
              </div>

              {/* Border Color */}
              <div className="space-y-2">
                <Label>Border Color</Label>
                <ColorPickerNative
                  value={designConfig.buttonBorder.color}
                  onChange={handleBorderColorChange}
                />
              </div>

              {/* Border Radius */}
              <div className="space-y-2">
                <Label>Raio da Borda (Border Radius)</Label>
                <RadioGroup
                  value={designConfig.buttonBorder.radius}
                  onValueChange={(value) =>
                    setDesignConfig((prev) => ({
                      ...prev,
                      buttonBorder: { ...prev.buttonBorder, radius: value },
                    }))
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="reto" id="radius-straight" />
                    <Label htmlFor="radius-straight" className="font-normal cursor-pointer">
                      Reto
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="redondo" id="radius-round" />
                    <Label htmlFor="radius-round" className="font-normal cursor-pointer">
                      Redondo
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="arredondado" id="radius-rounded" />
                    <Label htmlFor="radius-rounded" className="font-normal cursor-pointer">
                      Arredondado
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Border Style */}
              <div className="space-y-2">
                <Label>Estilo da Borda (Border Style)</Label>
                <Select
                  value={designConfig.buttonBorder.style}
                  onValueChange={(value) =>
                    setDesignConfig((prev) => ({
                      ...prev,
                      buttonBorder: { ...prev.buttonBorder, style: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um estilo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="dotted">Dotted</SelectItem>
                    <SelectItem value="dashed">Dashed</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Seção 5: Configurações de Sombra de Borda */}
          <section className="space-y-4">
            <h3 className="text-base font-semibold text-foreground">
              Configurações de Sombra de Borda
            </h3>
            <div className="space-y-4">
              {/* H-Shadow */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    Borda H-shadow
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {designConfig.shadow.hOffset}px
                  </span>
                </div>
                <Slider
                  min={-20}
                  max={20}
                  step={1}
                  value={[designConfig.shadow.hOffset]}
                  onValueChange={(value) =>
                    setDesignConfig((prev) => ({
                      ...prev,
                      shadow: { ...prev.shadow, hOffset: value[0] },
                    }))
                  }
                />
              </div>

              {/* V-Shadow */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    Borda V-shadow
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {designConfig.shadow.vOffset}px
                  </span>
                </div>
                <Slider
                  min={-20}
                  max={20}
                  step={1}
                  value={[designConfig.shadow.vOffset]}
                  onValueChange={(value) =>
                    setDesignConfig((prev) => ({
                      ...prev,
                      shadow: { ...prev.shadow, vOffset: value[0] },
                    }))
                  }
                />
              </div>

              {/* Blur */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    Borda Blur
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {designConfig.shadow.blur}px
                  </span>
                </div>
                <Slider
                  min={0}
                  max={20}
                  step={1}
                  value={[designConfig.shadow.blur]}
                  onValueChange={(value) =>
                    setDesignConfig((prev) => ({
                      ...prev,
                      shadow: { ...prev.shadow, blur: value[0] },
                    }))
                  }
                />
              </div>

              {/* Spread */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    Borda Spread
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {designConfig.shadow.spread}px
                  </span>
                </div>
                <Slider
                  min={0}
                  max={10}
                  step={1}
                  value={[designConfig.shadow.spread]}
                  onValueChange={(value) =>
                    setDesignConfig((prev) => ({
                      ...prev,
                      shadow: { ...prev.shadow, spread: value[0] },
                    }))
                  }
                />
              </div>

              {/* Shadow Color */}
              <div className="space-y-2">
                <Label>Cor da Sombra da Borda</Label>
                <ColorPickerNative
                  value={designConfig.shadow.color}
                  onChange={handleShadowColorChange}
                />
              </div>
            </div>
          </section>

          {/* Botão Salvar */}
          <Button onClick={handleSave} className="w-full">
            Salvar Alterações
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}