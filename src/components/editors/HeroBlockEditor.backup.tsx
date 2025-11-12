'use client';

import { useMemo } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Upload,
  Phone,
  Mail,
  MessageSquare,
  Link as LinkIcon,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { heroBlockSchema, type HeroBlockContent } from '@/schemas/heroBlock.schemas';

interface HeroBlockEditorProps {
  blockData?: {
    id: string;
    content: Record<string, any>;
  };
  templateId: string;
  onSave?: (
    data: HeroBlockContent
  ) => Promise<{ success?: boolean; error?: string } | void>;
  isLoading?: boolean;
}

// Helper component for Label with Tooltip
function LabelWithTooltip({
  label,
  tooltip,
  htmlFor,
}: {
  label: string;
  tooltip: string;
  htmlFor?: string;
}) {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Label htmlFor={htmlFor}>{label}</Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

export function HeroBlockEditor({
  blockData,
  templateId,
  onSave,
}: HeroBlockEditorProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<HeroBlockContent>({
    resolver: zodResolver(heroBlockSchema.shape.content),
    defaultValues: blockData?.content || {
      userName: '',
      userInfo: '',
      phoneNumber: '',
      emailAddress: '',
      whatsappNumber: '',
      scheduleLink: '',
      scheduleEnabled: false,
      emailMode: 'mailto',
      isHeaderEnabled: false,
      headerLogoWidth: 80,
      headerMenuEnabled: false,
      isCTAEnabled: false,
      styles: {
        blockBackgroundColor: '#ffffff',
        blockTitleColor: '#000000',
        blockSubtitleColor: '#666666',
        blockTextColor: '#333333',
        blockLinkColor: '#0066cc',
        buttonBackgroundColor: '#0066cc',
        buttonTextColor: '#ffffff',
        borderWidth: 0,
        borderColor: '#000000',
        borderRadius: 'reto',
        borderStyle: 'solid',
        boxShadowHOffset: 0,
        boxShadowVOffset: 0,
        boxShadowBlur: 0,
        boxShadowSpread: 0,
        boxShadowColor: '#000000',
      },
    },
  });

  // Watch specific fields for conditional rendering
  const scheduleEnabled = watch('scheduleEnabled');
  const isHeaderEnabled = watch('isHeaderEnabled');
  const isCTAEnabled = watch('isCTAEnabled');
  const borderRadius = watch('styles.borderRadius');

  const onSubmit: SubmitHandler<HeroBlockContent> = async (data) => {
    if (!onSave) return;

    try {
      const result = await onSave(data);
      if (result?.error) {
        console.error('Save error:', result.error);
      }
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  // Memoize border radius options for cleaner rendering
  const borderRadiusOptions = useMemo(
    () => [
      { value: 'reto', label: 'Reto' },
      { value: 'redondo', label: 'Redondo' },
      { value: 'arredondado', label: 'Arredondado' },
    ],
    []
  );

  const borderStyleOptions = useMemo(
    () => [
      { value: 'solid', label: 'Solid' },
      { value: 'dotted', label: 'Dotted' },
      { value: 'dashed', label: 'Dashed' },
      { value: 'hidden', label: 'Hidden' },
    ],
    []
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        enabled: isCTAEnabled,
      },
      contact: {
        phone: formData.phoneNumber,
        email: formData.emailAddress,
        whatsapp: formData.whatsappNumber,
        schedule: formData.scheduleLink,
        scheduleEnabled: formData.scheduleEnabled,
        emailMode: formData.emailMode,
      },
      styles: {
        blockBackgroundColor: formData.blockBackgroundColor,
        blockTitleColor: formData.blockTitleColor,
        blockSubtitleColor: formData.blockSubtitleColor,
        blockTextColor: formData.blockTextColor,
        blockLinkColor: formData.blockLinkColor,
        buttonBackgroundColor: formData.buttonBackgroundColor,
        buttonTextColor: formData.buttonTextColor,
        borderWidth: formData.borderWidth,
        borderColor: formData.borderColor,
        borderRadius: formData.borderRadius,
        borderStyle: formData.borderStyle,
        boxShadowHOffset: formData.boxShadowHOffset,
        boxShadowVOffset: formData.boxShadowVOffset,
        boxShadowBlur: formData.boxShadowBlur,
        boxShadowSpread: formData.boxShadowSpread,
        boxShadowColor: formData.boxShadowColor,
      },
    };

    if (onSave) {
      await onSave(dataToSave);
    }
  };

  return (
    <div className="space-y-8 p-6 bg-background rounded-lg">
      {/* ================ SEÇÃO 1: INFORMAÇÕES PRINCIPAIS ================ */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Informações Principais</h3>

        {/* Upload de Imagem de Perfil */}
        <div className="space-y-2">
          <Label>Imagem de Perfil</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center space-y-2 cursor-pointer hover:bg-muted/50 transition">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {formData.profileImage ? 'Imagem selecionada' : 'Procurar...'}
            </p>
            <p className="text-xs text-muted-foreground">
              jpg, jpeg, png, svg, gif, webp, avif permitido. 2 MB máximo.
            </p>
            <Input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleInputChange(
                    'profileImage',
                    e.target.files[0].name
                  );
                }
              }}
            />
          </div>
        </div>

        {/* Nome do usuário */}
        <div className="space-y-2">
          <LabelWithTooltip
            htmlFor="userName"
            label="Nome do usuário (título)"
            tooltip="Será exibido como o título principal do seu perfil digital"
          />
          <Input
            id="userName"
            placeholder="Digite o nome do usuário"
            value={formData.userName}
            onChange={(e) => handleInputChange('userName', e.target.value)}
          />
        </div>

        {/* Informações do usuário */}
        <div className="space-y-2">
          <LabelWithTooltip
            htmlFor="userInfo"
            label="Informações do usuário (subtítulo)"
            tooltip="Descrição breve que aparecerá abaixo do título, ex: profissão, especialidade"
          />
          <Input
            id="userInfo"
            placeholder="Digite as informações do usuário"
            value={formData.userInfo}
            onChange={(e) => handleInputChange('userInfo', e.target.value)}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* ================ SEÇÃO 2: BOTÕES DE CONTATO/AÇÃO ================ */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Botões de Contato/Ação</h3>

        {/* Phone */}
        <div className="space-y-2">
          <LabelWithTooltip
            htmlFor="phone"
            label="Telefone | Ligar"
            tooltip="Número de telefone para chamadas diretas"
          />
          <Input
            id="phone"
            type="tel"
            placeholder="+55 (11) 99999-9999"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
          />
        </div>

        {/* Mail */}
        <div className="space-y-2">
          <LabelWithTooltip
            htmlFor="email"
            label="E-mail | E-mail"
            tooltip="Endereço de e-mail para contato"
          />
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={formData.emailAddress}
            onChange={(e) => handleInputChange('emailAddress', e.target.value)}
          />
        </div>

        {/* WhatsApp */}
        <div className="space-y-2">
          <LabelWithTooltip
            htmlFor="whatsapp"
            label="Telefone | WhatsApp"
            tooltip="Número do WhatsApp para mensagens rápidas"
          />
          <Input
            id="whatsapp"
            type="tel"
            placeholder="+55 (11) 99999-9999"
            value={formData.whatsappNumber}
            onChange={(e) =>
              handleInputChange('whatsappNumber', e.target.value)
            }
          />
        </div>

        {/* Agendar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="schedule" className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              URL | Agendar
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Adicionar Link de Agendamento</span>
              <Switch
                checked={formData.scheduleEnabled}
                onCheckedChange={(value) =>
                  handleInputChange('scheduleEnabled', value)
                }
              />
            </div>
          </div>
          {formData.scheduleEnabled && (
            <Input
              id="schedule"
              type="url"
              placeholder="https://calendly.com/seu-link"
              value={formData.scheduleLink}
              onChange={(e) => handleInputChange('scheduleLink', e.target.value)}
            />
          )}
        </div>

        {/* Email Mode */}
        <div className="space-y-3 pt-2">
          <Label>Modo de Envio de E-mail</Label>
          <RadioGroup
            value={formData.emailMode}
            onValueChange={(value) =>
              handleInputChange('emailMode', value)
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mailto" id="mailto" />
              <Label htmlFor="mailto" className="font-normal cursor-pointer">
                Usar link 'mailto:'
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="form" id="form" />
              <Label htmlFor="form" className="font-normal cursor-pointer">
                Usar formulário de contato
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* ================ SEÇÃO 3: CONFIGURAÇÕES DO CABEÇALHO ================ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Configurações do Cabeçalho</h3>
          <Switch
            checked={isHeaderEnabled}
            onCheckedChange={setIsHeaderEnabled}
          />
        </div>

        {/* Conditional Header Card */}
        {isHeaderEnabled && (
          <Card className="p-4 bg-muted/50 space-y-4">
            {/* Upload Logomarca */}
            <div className="space-y-2">
              <Label>Logomarca</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center space-y-2 cursor-pointer hover:bg-background transition">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {formData.headerLogoImage
                    ? 'Imagem selecionada'
                    : 'Procurar...'}
                </p>
                <p className="text-xs text-muted-foreground">
                  jpg, jpeg, png, svg, gif, webp, avif permitido. 2 MB máximo.
                </p>
                <Input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleInputChange(
                        'headerLogoImage',
                        e.target.files[0].name
                      );
                    }
                  }}
                />
              </div>
            </div>

            {/* URL do Link da Logomarca */}
            <div className="space-y-2">
              <Label htmlFor="logoUrl">URL do Link da Logomarca</Label>
              <Input
                id="logoUrl"
                type="url"
                placeholder="https://seu-site.com"
                value={formData.headerLogoUrl}
                onChange={(e) =>
                  handleInputChange('headerLogoUrl', e.target.value)
                }
              />
            </div>

            {/* Largura da Logomarca */}
            <div className="space-y-2">
              <Label>Largura da Logomarca: {formData.headerLogoWidth}px</Label>
              <input
                type="range"
                min={20}
                max={200}
                step={1}
                value={formData.headerLogoWidth}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange('headerLogoWidth', parseInt(e.target.value, 10))
                }
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Adicionar Menu */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <Label>Adicionar menu?</Label>
              <Switch
                checked={formData.headerMenuEnabled}
                onCheckedChange={(value) =>
                  handleInputChange('headerMenuEnabled', value)
                }
              />
            </div>
          </Card>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* ================ SEÇÃO 4: BOTÃO CALL TO ACTION ================ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Botão Call to Action (CTA)
          </h3>
          <Switch checked={isCTAEnabled} onCheckedChange={setIsCTAEnabled} />
        </div>

        {/* Conditional CTA Alert */}
        {isCTAEnabled && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Call to Action</AlertTitle>
            <AlertDescription>
              Um bloco CTA será adicionado abaixo do Hero (em breve)
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* ================ SEÇÃO 5: CONFIGURAÇÕES DE ESTILO ================ */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Configurações de Estilo</h3>

        <Accordion type="multiple" className="w-full">
          {/* Item 1: Configuração de Cores do Bloco */}
          <AccordionItem value="block-colors">
            <AccordionTrigger>Configuração de Cores do Bloco</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <LabelWithTooltip
                  htmlFor="bgColor"
                  label="Cor de Fundo Primário"
                  tooltip="Cor do fundo da seção Hero"
                />
                <div className="flex gap-2">
                  <Input
                    id="bgColor"
                    type="color"
                    value={formData.blockBackgroundColor}
                    onChange={(e) =>
                      handleInputChange('blockBackgroundColor', e.target.value)
                    }
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={formData.blockBackgroundColor}
                    onChange={(e) =>
                      handleInputChange('blockBackgroundColor', e.target.value)
                    }
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <LabelWithTooltip
                  htmlFor="titleColor"
                  label="Cor do Título"
                  tooltip="Cor do texto do título principal"
                />
                <div className="flex gap-2">
                  <Input
                    id="titleColor"
                    type="color"
                    value={formData.blockTitleColor}
                    onChange={(e) =>
                      handleInputChange('blockTitleColor', e.target.value)
                    }
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={formData.blockTitleColor}
                    onChange={(e) =>
                      handleInputChange('blockTitleColor', e.target.value)
                    }
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <LabelWithTooltip
                  htmlFor="subtitleColor"
                  label="Cor do Subtítulo"
                  tooltip="Cor do texto do subtítulo (informações do usuário)"
                />
                <div className="flex gap-2">
                  <Input
                    id="subtitleColor"
                    type="color"
                    value={formData.blockSubtitleColor}
                    onChange={(e) =>
                      handleInputChange('blockSubtitleColor', e.target.value)
                    }
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={formData.blockSubtitleColor}
                    onChange={(e) =>
                      handleInputChange('blockSubtitleColor', e.target.value)
                    }
                    placeholder="#666666"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <LabelWithTooltip
                  htmlFor="textColor"
                  label="Cor do Texto"
                  tooltip="Cor do texto geral do bloco"
                />
                <div className="flex gap-2">
                  <Input
                    id="textColor"
                    type="color"
                    value={formData.blockTextColor}
                    onChange={(e) =>
                      handleInputChange('blockTextColor', e.target.value)
                    }
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={formData.blockTextColor}
                    onChange={(e) =>
                      handleInputChange('blockTextColor', e.target.value)
                    }
                    placeholder="#333333"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <LabelWithTooltip
                  htmlFor="linkColor"
                  label="Cor do Link"
                  tooltip="Cor dos links de contato e navegação"
                />
                <div className="flex gap-2">
                  <Input
                    id="linkColor"
                    type="color"
                    value={formData.blockLinkColor}
                    onChange={(e) =>
                      handleInputChange('blockLinkColor', e.target.value)
                    }
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={formData.blockLinkColor}
                    onChange={(e) =>
                      handleInputChange('blockLinkColor', e.target.value)
                    }
                    placeholder="#0ea5e9"
                    className="flex-1"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Item 2: Configuração de Cores dos Botões */}
          <AccordionItem value="button-colors">
            <AccordionTrigger>
              Configuração de Cores dos Botões
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label
                  htmlFor="btnBgColor"
                  className="flex items-center gap-2"
                >
                  Cor de Fundo dos Botões
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="btnBgColor"
                    type="color"
                    value={formData.buttonBackgroundColor}
                    onChange={(e) =>
                      handleInputChange('buttonBackgroundColor', e.target.value)
                    }
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={formData.buttonBackgroundColor}
                    onChange={(e) =>
                      handleInputChange('buttonBackgroundColor', e.target.value)
                    }
                    placeholder="#0ea5e9"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="btnTextColor"
                  className="flex items-center gap-2"
                >
                  Cor dos Botões
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="btnTextColor"
                    type="color"
                    value={formData.buttonTextColor}
                    onChange={(e) =>
                      handleInputChange('buttonTextColor', e.target.value)
                    }
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={formData.buttonTextColor}
                    onChange={(e) =>
                      handleInputChange('buttonTextColor', e.target.value)
                    }
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Item 3: Configurações de Borda dos Botões */}
          <AccordionItem value="button-border">
            <AccordionTrigger>Configurações de Borda dos Botões</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Border Width: {formData.borderWidth}px</Label>
                <input
                  type="range"
                  min={0}
                  max={5}
                  step={1}
                  value={formData.borderWidth}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('borderWidth', parseInt(e.target.value, 10))
                  }
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="borderColor" className="flex items-center gap-2">
                  Cor da Borda
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="borderColor"
                    type="color"
                    value={formData.borderColor}
                    onChange={(e) =>
                      handleInputChange('borderColor', e.target.value)
                    }
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={formData.borderColor}
                    onChange={(e) =>
                      handleInputChange('borderColor', e.target.value)
                    }
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Raio da Borda (Border radius)</Label>
                <RadioGroup
                  value={formData.borderRadius}
                  onValueChange={(value) =>
                    handleInputChange('borderRadius', value)
                  }
                >
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="straight" id="straight" />
                      <Label
                        htmlFor="straight"
                        className="font-normal cursor-pointer"
                      >
                        Reto
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="round" id="round" />
                      <Label
                        htmlFor="round"
                        className="font-normal cursor-pointer"
                      >
                        Redondo
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rounded" id="rounded" />
                      <Label
                        htmlFor="rounded"
                        className="font-normal cursor-pointer"
                      >
                        Arredondado
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Estilo da Borda (Border style)</Label>
                <RadioGroup
                  value={formData.borderStyle}
                  onValueChange={(value) =>
                    handleInputChange('borderStyle', value)
                  }
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="solid" id="solid" />
                      <Label
                        htmlFor="solid"
                        className="font-normal cursor-pointer"
                      >
                        Solid
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dotted" id="dotted" />
                      <Label
                        htmlFor="dotted"
                        className="font-normal cursor-pointer"
                      >
                        Dotted
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dashed" id="dashed" />
                      <Label
                        htmlFor="dashed"
                        className="font-normal cursor-pointer"
                      >
                        Dashed
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hidden" id="hidden" />
                      <Label
                        htmlFor="hidden"
                        className="font-normal cursor-pointer"
                      >
                        Hidden
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Item 4: Configurações de Sombra de Borda */}
          <AccordionItem value="button-shadow">
            <AccordionTrigger>
              Configurações de Sombra de Borda
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <LabelWithTooltip
                  label="Borda H-shadow"
                  tooltip="Posição horizontal da sombra"
                />
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={-20}
                    max={20}
                    step={1}
                    value={formData.boxShadowHOffset}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('boxShadowHOffset', parseInt(e.target.value, 10))
                    }
                    className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="text-sm font-medium w-12 text-right">
                    {formData.boxShadowHOffset}px
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <LabelWithTooltip
                  label="Borda V-shadow"
                  tooltip="Posição vertical da sombra"
                />
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={-20}
                    max={20}
                    step={1}
                    value={formData.boxShadowVOffset}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('boxShadowVOffset', parseInt(e.target.value, 10))
                    }
                    className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="text-sm font-medium w-12 text-right">
                    {formData.boxShadowVOffset}px
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <LabelWithTooltip
                  label="Borda Blur"
                  tooltip="Define a intensidade do efeito blur (borrão) da sombra (opcional)"
                />
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={20}
                    step={1}
                    value={formData.boxShadowBlur}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('boxShadowBlur', parseInt(e.target.value, 10))
                    }
                    className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="text-sm font-medium w-12 text-right">
                    {formData.boxShadowBlur}px
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <LabelWithTooltip
                  label="Borda Spread"
                  tooltip="O tamanho da sombra (opcional)"
                />
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={1}
                    value={formData.boxShadowSpread}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('boxShadowSpread', parseInt(e.target.value, 10))
                    }
                    className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="text-sm font-medium w-12 text-right">
                    {formData.boxShadowSpread}px
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <LabelWithTooltip
                  htmlFor="shadowColor"
                  label="Cor da Sombra da Borda"
                  tooltip="A cor da sombra"
                />
                <div className="flex gap-2">
                  <Input
                    id="shadowColor"
                    type="color"
                    value={formData.boxShadowColor}
                    onChange={(e) =>
                      handleInputChange('boxShadowColor', e.target.value)
                    }
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={formData.boxShadowColor}
                    onChange={(e) =>
                      handleInputChange('boxShadowColor', e.target.value)
                    }
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* ================ FOOTER: BOTÕES DE AÇÃO ================ */}
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline">Cancelar</Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </div>
  );
}
