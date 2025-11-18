'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ctaBlockContentSchema,
  type CTABlockContent,
} from '@/schemas/ctaBlock.schemas';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ColorPickerNative } from '@/components/ui/ColorPickerNative';
import { Button } from '@/components/ui/button';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from 'lucide-react';

interface CTAEditorProps {
  blockId: string;
  initialContent?: Partial<CTABlockContent>;
  onContentChange?: (content: CTABlockContent) => void;
  onSave?: (content: CTABlockContent) => void;
}

export function CTAEditor({
  blockId,
  initialContent,
  onContentChange,
  onSave,
}: CTAEditorProps) {
  const form = useForm<CTABlockContent>({
    resolver: zodResolver(ctaBlockContentSchema),
    defaultValues: {
      destinationUrl: initialContent?.destinationUrl || '',
      openInNewTab: initialContent?.openInNewTab || false,
      name: initialContent?.name || 'AGENDAR UMA REUNIÃO',
      imageThumbnail: initialContent?.imageThumbnail || '',
      iconClass: initialContent?.iconClass || '',
      primaryColor: initialContent?.primaryColor || '#373F4B',
      secondaryColor: initialContent?.secondaryColor || '#9CA3AF',
      textColor: initialContent?.textColor || '#1F2937',
      textAlignment: initialContent?.textAlignment || 'center',
      backgroundColor: initialContent?.backgroundColor || '#E5E7EB',
      animation: initialContent?.animation || 'none',
      sensitiveContentWarning:
        initialContent?.sensitiveContentWarning || false,
      columns: initialContent?.columns || '1',
      border: initialContent?.border || {
        width: 0,
        color: '#1F2937',
        radius: 8,
        style: 'solid',
      },
      shadow: initialContent?.shadow || {
        hOffset: 0,
        vOffset: 0,
        blur: 0,
        spread: 0,
        color: '#1F2937',
      },
      display: initialContent?.display || {
        padding: 16,
        margin: 0,
      },
    },
  });

  const { watch, setValue, register } = form;
  const formValues = watch();

  // Notify parent of changes
  React.useEffect(() => {
    if (onContentChange) {
      onContentChange(formValues);
    }
  }, [formValues, onContentChange]);

  const handleSave = () => {
    if (onSave) {
      onSave(formValues);
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* 1. URL e Comportamento */}
      <div className="space-y-4">
        <div>
          <Label htmlFor={`cta-url-${blockId}`} className="text-sm font-medium">
            URL de Destino
          </Label>
          <Input
            id={`cta-url-${blockId}`}
            type="url"
            placeholder="https://exemplo.com"
            {...register('destinationUrl')}
            className="mt-1.5"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label
            htmlFor={`cta-new-tab-${blockId}`}
            className="text-sm font-medium"
          >
            Abrir em nova aba
          </Label>
          <Switch
            id={`cta-new-tab-${blockId}`}
            checked={formValues.openInNewTab}
            onCheckedChange={(checked) => setValue('openInNewTab', checked)}
          />
        </div>
      </div>

      {/* 2. Conteúdo do Botão */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-sm font-semibold text-muted-foreground">
          Conteúdo do Botão
        </h3>

        <div>
          <Label htmlFor={`cta-name-${blockId}`} className="text-sm font-medium">
            Texto do Botão
          </Label>
          <Input
            id={`cta-name-${blockId}`}
            {...register('name')}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label
            htmlFor={`cta-thumbnail-${blockId}`}
            className="text-sm font-medium"
          >
            Imagem em Miniatura (URL)
          </Label>
          <Input
            id={`cta-thumbnail-${blockId}`}
            type="url"
            placeholder="https://exemplo.com/imagem.png"
            {...register('imageThumbnail')}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label
            htmlFor={`cta-icon-${blockId}`}
            className="text-sm font-medium"
          >
            Classe do Ícone (ex: fa-calendar)
          </Label>
          <Input
            id={`cta-icon-${blockId}`}
            placeholder="fa-calendar"
            {...register('iconClass')}
            className="mt-1.5"
          />
        </div>
      </div>

      {/* 3. Cores do Bloco CTA */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-sm font-semibold text-muted-foreground">
          Cores do Bloco CTA
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Coluna Esquerda */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Cor Primária</Label>
              <ColorPickerNative
                value={formValues.primaryColor}
                onChange={(color) => setValue('primaryColor', color)}
                label="Cor Primária"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Cor Secundária</Label>
              <ColorPickerNative
                value={formValues.secondaryColor}
                onChange={(color) => setValue('secondaryColor', color)}
                label="Cor Secundária"
              />
            </div>
          </div>

          {/* Coluna Direita */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Cor de Fundo do Botão</Label>
              <ColorPickerNative
                value={formValues.backgroundColor}
                onChange={(color) => setValue('backgroundColor', color)}
                label="Cor de Fundo"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Cor do Texto</Label>
              <ColorPickerNative
                value={formValues.textColor}
                onChange={(color) => setValue('textColor', color)}
                label="Cor do Texto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Estilo do Texto */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-sm font-semibold text-muted-foreground">
          Alinhamento do Texto
        </h3>

        <div>
          <ToggleGroup
            type="single"
            value={formValues.textAlignment}
            onValueChange={(value) => {
              if (value) setValue('textAlignment', value as any);
            }}
            className="grid grid-cols-4 w-full"
          >
            <ToggleGroupItem value="left" aria-label="Alinhar à esquerda" className="w-full">
              <AlignLeft className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label="Centralizar" className="w-full">
              <AlignCenter className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="right" aria-label="Alinhar à direita" className="w-full">
              <AlignRight className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="justify" aria-label="Justificar" className="w-full">
              <AlignJustify className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {/* 5. Animação e Avisos */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-sm font-semibold text-muted-foreground">
          Animação e Avisos
        </h3>

        <div>
          <Label
            htmlFor={`cta-animation-${blockId}`}
            className="text-sm font-medium"
          >
            Animação
          </Label>
          <Select
            value={formValues.animation}
            onValueChange={(value) =>
              setValue('animation', value as 'none' | 'fade' | 'slide' | 'bounce')
            }
          >
            <SelectTrigger id={`cta-animation-${blockId}`} className="mt-1.5">
              <SelectValue placeholder="Selecione uma animação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhuma</SelectItem>
              <SelectItem value="fade">Fade</SelectItem>
              <SelectItem value="slide">Slide</SelectItem>
              <SelectItem value="bounce">Bounce</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label
            htmlFor={`cta-sensitive-${blockId}`}
            className="text-sm font-medium"
          >
            Aviso de Conteúdo Sensível
          </Label>
          <Switch
            id={`cta-sensitive-${blockId}`}
            checked={formValues.sensitiveContentWarning}
            onCheckedChange={(checked) =>
              setValue('sensitiveContentWarning', checked)
            }
          />
        </div>
      </div>

      {/* 6. Configurações Avançadas (Accordion) */}
      <div className="border-t pt-4">
        <Accordion type="multiple" className="w-full space-y-4">
          {/* Borda */}
          <AccordionItem value="border" className="border bg-secondary rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline hover:bg-secondary/80 transition-colors py-0 h-10">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-slate-500 rounded"></div>
                <span className="font-medium">Configurações de Borda</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Largura da Borda: {formValues.border?.width || 0}px
                </Label>
                <Slider
                  value={[formValues.border?.width || 0]}
                  onValueChange={(value) =>
                    setValue('border', {
                      ...formValues.border!,
                      width: value[0],
                    })
                  }
                  min={0}
                  max={10}
                  step={1}
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Cor da Borda</Label>
                <ColorPickerNative
                  value={formValues.border?.color || '#000000'}
                  onChange={(color) =>
                    setValue('border', {
                      ...formValues.border!,
                      color,
                    })
                  }
                  label="Cor da Borda"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Raio da Borda: {formValues.border?.radius || 8}px
                </Label>
                <Slider
                  value={[formValues.border?.radius || 8]}
                  onValueChange={(value) =>
                    setValue('border', {
                      ...formValues.border!,
                      radius: value[0],
                    })
                  }
                  min={0}
                  max={50}
                  step={1}
                />
              </div>

              <div>
                <Label
                  htmlFor={`cta-border-style-${blockId}`}
                  className="text-sm font-medium"
                >
                  Estilo da Borda
                </Label>
                <Select
                  value={formValues.border?.style || 'solid'}
                  onValueChange={(value) =>
                    setValue('border', {
                      ...formValues.border!,
                      style: value as 'solid' | 'dashed' | 'dotted',
                    })
                  }
                >
                  <SelectTrigger
                    id={`cta-border-style-${blockId}`}
                    className="mt-1.5"
                  >
                    <SelectValue placeholder="Estilo da borda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Sólida</SelectItem>
                    <SelectItem value="dashed">Tracejada</SelectItem>
                    <SelectItem value="dotted">Pontilhada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Sombra */}
          <AccordionItem value="shadow" className="border bg-secondary rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline hover:bg-secondary/80 transition-colors py-0 h-10">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-slate-600 rounded"></div>
                <span className="font-medium">Configurações de Sombra</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Deslocamento Horizontal: {formValues.shadow?.hOffset || 0}px
                </Label>
                <Slider
                  value={[formValues.shadow?.hOffset || 0]}
                  onValueChange={(value) =>
                    setValue('shadow', {
                      ...formValues.shadow!,
                      hOffset: value[0],
                    })
                  }
                  min={-50}
                  max={50}
                  step={1}
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Deslocamento Vertical: {formValues.shadow?.vOffset || 0}px
                </Label>
                <Slider
                  value={[formValues.shadow?.vOffset || 0]}
                  onValueChange={(value) =>
                    setValue('shadow', {
                      ...formValues.shadow!,
                      vOffset: value[0],
                    })
                  }
                  min={-50}
                  max={50}
                  step={1}
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Desfoque: {formValues.shadow?.blur || 0}px
                </Label>
                <Slider
                  value={[formValues.shadow?.blur || 0]}
                  onValueChange={(value) =>
                    setValue('shadow', {
                      ...formValues.shadow!,
                      blur: value[0],
                    })
                  }
                  min={0}
                  max={50}
                  step={1}
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Expansão: {formValues.shadow?.spread || 0}px
                </Label>
                <Slider
                  value={[formValues.shadow?.spread || 0]}
                  onValueChange={(value) =>
                    setValue('shadow', {
                      ...formValues.shadow!,
                      spread: value[0],
                    })
                  }
                  min={0}
                  max={50}
                  step={1}
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Cor da Sombra</Label>
                <ColorPickerNative
                  value={formValues.shadow?.color || '#000000'}
                  onChange={(color) =>
                    setValue('shadow', {
                      ...formValues.shadow!,
                      color,
                    })
                  }
                  label="Cor da Sombra"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Display */}
          <AccordionItem value="display" className="border bg-secondary rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline hover:bg-secondary/80 transition-colors py-0 h-10">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-slate-400 rounded"></div>
                <span className="font-medium">Configurações de Espaçamento</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Padding: {formValues.display?.padding || 16}px
                </Label>
                <Slider
                  value={[formValues.display?.padding || 16]}
                  onValueChange={(value) =>
                    setValue('display', {
                      ...formValues.display!,
                      padding: value[0],
                    })
                  }
                  min={0}
                  max={100}
                  step={4}
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Margin: {formValues.display?.margin || 0}px
                </Label>
                <Slider
                  value={[formValues.display?.margin || 0]}
                  onValueChange={(value) =>
                    setValue('display', {
                      ...formValues.display!,
                      margin: value[0],
                    })
                  }
                  min={0}
                  max={100}
                  step={4}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Botão Salvar */}
      <div className="pt-4">
        <Button onClick={handleSave} className="w-full">
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}
