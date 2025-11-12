'use client';

import { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import {
  heroBlockContentSchema,
  type HeroBlockContent,
} from '@/schemas/heroBlock.schemas';

interface HeroBlockEditorProps {
  blockData?: {
    id: string;
    content: Record<string, any>;
  };
  templateId: string;
  onSave?: (
    data: HeroBlockContent
  ) => Promise<{ success?: boolean; error?: string } | void>;
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
    resolver: zodResolver(heroBlockContentSchema),
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

  const onSubmit = async (data: HeroBlockContent) => {
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

  // Memoize options for cleaner rendering
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
      <Accordion type="multiple" className="w-full">
        {/* Section 1: Informações Principais */}
        <AccordionItem value="main-info">
          <AccordionTrigger>Informações Principais</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            {/* Profile Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="profileImage">Foto de Perfil</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="profileImage"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground rounded-lg cursor-pointer hover:bg-muted/50 transition"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Clique ou arraste a imagem
                    </p>
                  </div>
                  <Input
                    id="profileImage"
                    type="file"
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              </div>
            </div>

            {/* User Name */}
            <div className="space-y-2">
              <Label htmlFor="userName">Nome do Usuário</Label>
              <Input
                id="userName"
                placeholder="Seu nome completo"
                {...register('userName')}
                className={errors.userName ? 'border-destructive' : ''}
              />
              {errors.userName && (
                <p className="text-sm text-destructive">
                  {errors.userName.message}
                </p>
              )}
            </div>

            {/* User Info */}
            <div className="space-y-2">
              <Label htmlFor="userInfo">Informações do Usuário</Label>
              <Input
                id="userInfo"
                placeholder="Ex: Developer, Designer, etc."
                {...register('userInfo')}
                className={errors.userInfo ? 'border-destructive' : ''}
              />
              {errors.userInfo && (
                <p className="text-sm text-destructive">
                  {errors.userInfo.message}
                </p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 2: Botões de Contato/Ação */}
        <AccordionItem value="contact-buttons">
          <AccordionTrigger>Botões de Contato/Ação</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefone
              </Label>
              <Input
                id="phoneNumber"
                placeholder="+55 (11) 99999-9999"
                {...register('phoneNumber')}
                className={errors.phoneNumber ? 'border-destructive' : ''}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-destructive">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <Label htmlFor="emailAddress" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                E-mail
              </Label>
              <Input
                id="emailAddress"
                type="email"
                placeholder="seu.email@exemplo.com"
                {...register('emailAddress')}
                className={errors.emailAddress ? 'border-destructive' : ''}
              />
              {errors.emailAddress && (
                <p className="text-sm text-destructive">
                  {errors.emailAddress.message}
                </p>
              )}
            </div>

            {/* WhatsApp Number */}
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                WhatsApp
              </Label>
              <Input
                id="whatsappNumber"
                placeholder="+55 (11) 99999-9999"
                {...register('whatsappNumber')}
                className={errors.whatsappNumber ? 'border-destructive' : ''}
              />
              {errors.whatsappNumber && (
                <p className="text-sm text-destructive">
                  {errors.whatsappNumber.message}
                </p>
              )}
            </div>

            {/* Schedule Link Toggle */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <Label htmlFor="scheduleEnabled">
                  Adicionar Link de Agendamento
                </Label>
                <Controller
                  name="scheduleEnabled"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="scheduleEnabled"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              {scheduleEnabled && (
                <div className="space-y-2 mt-2">
                  <Label htmlFor="scheduleLink" className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Link de Agendamento
                  </Label>
                  <Input
                    id="scheduleLink"
                    type="url"
                    placeholder="https://calendly.com/seu-link"
                    {...register('scheduleLink')}
                    className={errors.scheduleLink ? 'border-destructive' : ''}
                  />
                  {errors.scheduleLink && (
                    <p className="text-sm text-destructive">
                      {errors.scheduleLink.message}
                    </p>
                  )}

                  {/* Email Mode Selection */}
                  <div className="space-y-2 mt-4">
                    <Label>Modo de Contato por Email</Label>
                    <Controller
                      name="emailMode"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup value={field.value} onValueChange={field.onChange}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="mailto" id="mailto" />
                            <Label htmlFor="mailto">mailto</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="form" id="form" />
                            <Label htmlFor="form">Formulário</Label>
                          </div>
                        </RadioGroup>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 3: Configurações do Cabeçalho */}
        <AccordionItem value="header-config">
          <AccordionTrigger>Configurações do Cabeçalho</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="isHeaderEnabled">Adicionar Cabeçalho</Label>
              <Controller
                name="isHeaderEnabled"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="isHeaderEnabled"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            {isHeaderEnabled && (
              <Card className="p-4 bg-muted/50 space-y-4">
                {/* Header Logo Upload */}
                <div className="space-y-2">
                  <Label htmlFor="headerLogoImage">Logomarca</Label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="headerLogoImage"
                      className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-muted-foreground rounded-lg cursor-pointer hover:bg-muted transition"
                    >
                      <div className="flex flex-col items-center justify-center pt-3 pb-3">
                        <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                        <p className="text-xs text-muted-foreground text-center">
                          Clique ou arraste
                        </p>
                      </div>
                      <Input
                        id="headerLogoImage"
                        type="file"
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                  </div>
                </div>

                {/* Header Logo URL */}
                <div className="space-y-2">
                  <Label htmlFor="headerLogoUrl">URL da Logomarca</Label>
                  <Input
                    id="headerLogoUrl"
                    type="url"
                    placeholder="https://exemplo.com/logo.png"
                    {...register('headerLogoUrl')}
                    className={errors.headerLogoUrl ? 'border-destructive' : ''}
                  />
                  {errors.headerLogoUrl && (
                    <p className="text-sm text-destructive">
                      {errors.headerLogoUrl.message}
                    </p>
                  )}
                </div>

                {/* Header Logo Width */}
                <div className="space-y-2">
                  <LabelWithTooltip
                    label="Largura da Logomarca"
                    tooltip="Defina a largura em pixels (20-200px)"
                  />
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={20}
                      max={200}
                      step={1}
                      {...register('headerLogoWidth', {
                        setValueAs: (v) => parseInt(v, 10),
                      })}
                      className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <span className="text-sm font-medium w-12 text-right">
                      {watch('headerLogoWidth')}px
                    </span>
                  </div>
                </div>

                {/* Header Menu Toggle */}
                <div className="flex items-center gap-4">
                  <Label htmlFor="headerMenuEnabled">Adicionar Menu</Label>
                  <Controller
                    name="headerMenuEnabled"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id="headerMenuEnabled"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </Card>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Section 4: CTA Button */}
        <AccordionItem value="cta-button">
          <AccordionTrigger>Botão CTA</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="isCTAEnabled">Adicionar CTA</Label>
              <Controller
                name="isCTAEnabled"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="isCTAEnabled"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            {isCTAEnabled && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Call to Action</AlertTitle>
                <AlertDescription>
                  Um bloco CTA será adicionado abaixo do Hero (em breve)
                </AlertDescription>
              </Alert>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Section 5: Estilos */}
        <AccordionItem value="style-settings">
          <AccordionTrigger>Configurações de Estilo</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <Accordion type="multiple" className="w-full">
              {/* Block Colors */}
              <AccordionItem value="block-colors">
                <AccordionTrigger>Cores do Bloco</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  {/* Background Color */}
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="blockBackgroundColor"
                      label="Cor de Fundo Primário"
                      tooltip="Define a cor de fundo da Hero Section"
                    />
                    <div className="flex gap-2">
                      <Controller
                        name="styles.blockBackgroundColor"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="color"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="w-16 h-10"
                          />
                        )}
                      />
                      <Controller
                        name="styles.blockBackgroundColor"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="text"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            placeholder="#ffffff"
                            className="flex-1"
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Title Color */}
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="blockTitleColor"
                      label="Cor do Título"
                      tooltip="Define a cor do título da Hero Section"
                    />
                    <div className="flex gap-2">
                      <Controller
                        name="styles.blockTitleColor"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="color"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="w-16 h-10"
                          />
                        )}
                      />
                      <Controller
                        name="styles.blockTitleColor"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="text"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            placeholder="#000000"
                            className="flex-1"
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Subtitle Color */}
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="blockSubtitleColor"
                      label="Cor do Subtítulo"
                      tooltip="Define a cor do subtítulo da Hero Section"
                    />
                    <div className="flex gap-2">
                      <Controller
                        name="styles.blockSubtitleColor"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="color"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="w-16 h-10"
                          />
                        )}
                      />
                      <Controller
                        name="styles.blockSubtitleColor"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="text"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            placeholder="#666666"
                            className="flex-1"
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Text Color */}
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="blockTextColor"
                      label="Cor do Texto"
                      tooltip="Define a cor do texto principal da Hero Section"
                    />
                    <div className="flex gap-2">
                      <Controller
                        name="styles.blockTextColor"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="color"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="w-16 h-10"
                          />
                        )}
                      />
                      <Controller
                        name="styles.blockTextColor"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="text"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            placeholder="#333333"
                            className="flex-1"
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Link Color */}
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="blockLinkColor"
                      label="Cor do Link"
                      tooltip="Define a cor dos links da Hero Section"
                    />
                    <div className="flex gap-2">
                      <Controller
                        name="styles.blockLinkColor"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="color"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="w-16 h-10"
                          />
                        )}
                      />
                      <Controller
                        name="styles.blockLinkColor"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="text"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            placeholder="#0066cc"
                            className="flex-1"
                          />
                        )}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Button Colors */}
              <AccordionItem value="button-colors">
                <AccordionTrigger>Cores dos Botões</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  {/* Button Background Color */}
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="buttonBackgroundColor"
                      label="Cor de Fundo dos Botões"
                      tooltip="Define a cor de fundo dos botões de ação"
                    />
                    <div className="flex gap-2">
                      <Controller
                        name="styles.buttonBackgroundColor"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="color"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="w-16 h-10"
                          />
                        )}
                      />
                      <Controller
                        name="styles.buttonBackgroundColor"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="text"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            placeholder="#0066cc"
                            className="flex-1"
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Button Text Color */}
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="buttonTextColor"
                      label="Cor dos Botões"
                      tooltip="Define a cor do texto dos botões"
                    />
                    <div className="flex gap-2">
                      <Controller
                        name="styles.buttonTextColor"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="color"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="w-16 h-10"
                          />
                        )}
                      />
                      <Controller
                        name="styles.buttonTextColor"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="text"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            placeholder="#ffffff"
                            className="flex-1"
                          />
                        )}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Border Configuration */}
              <AccordionItem value="button-border">
                <AccordionTrigger>Configuração de Borda</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  {/* Border Width */}
                  <div className="space-y-2">
                    <LabelWithTooltip
                      label="Largura da Borda"
                      tooltip="Define a espessura da borda (0-10px)"
                    />
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={0}
                        max={10}
                        step={1}
                        {...register('styles.borderWidth', {
                          setValueAs: (v) => parseInt(v, 10),
                        })}
                        className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <span className="text-sm font-medium w-12 text-right">
                        {watch('styles.borderWidth')}px
                      </span>
                    </div>
                  </div>

                  {/* Border Color */}
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="borderColor"
                      label="Cor da Borda"
                      tooltip="Define a cor da borda"
                    />
                    <div className="flex gap-2">
                      <Controller
                        name="styles.borderColor"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="color"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="w-16 h-10"
                          />
                        )}
                      />
                      <Controller
                        name="styles.borderColor"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="text"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            placeholder="#000000"
                            className="flex-1"
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Border Radius */}
                  <div className="space-y-2">
                    <Label>Raio da Borda</Label>
                    <Controller
                      name="styles.borderRadius"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup value={field.value} onValueChange={field.onChange}>
                          <div className="flex flex-col gap-2">
                            {borderRadiusOptions.map((option) => (
                              <div
                                key={option.value}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem
                                  value={option.value}
                                  id={`borderRadius-${option.value}`}
                                />
                                <Label htmlFor={`borderRadius-${option.value}`}>
                                  {option.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      )}
                    />
                  </div>

                  {/* Border Style */}
                  <div className="space-y-2">
                    <Label>Estilo da Borda</Label>
                    <Controller
                      name="styles.borderStyle"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup value={field.value} onValueChange={field.onChange}>
                          <div className="flex flex-col gap-2">
                            {borderStyleOptions.map((option) => (
                              <div
                                key={option.value}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem
                                  value={option.value}
                                  id={`borderStyle-${option.value}`}
                                />
                                <Label htmlFor={`borderStyle-${option.value}`}>
                                  {option.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Box Shadow Configuration */}
              <AccordionItem value="button-shadow">
                <AccordionTrigger>Configurações de Sombra de Borda</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  {/* H-shadow */}
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
                        {...register('styles.boxShadowHOffset', {
                          setValueAs: (v) => parseInt(v, 10),
                        })}
                        className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <span className="text-sm font-medium w-12 text-right">
                        {watch('styles.boxShadowHOffset')}px
                      </span>
                    </div>
                  </div>

                  {/* V-shadow */}
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
                        {...register('styles.boxShadowVOffset', {
                          setValueAs: (v) => parseInt(v, 10),
                        })}
                        className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <span className="text-sm font-medium w-12 text-right">
                        {watch('styles.boxShadowVOffset')}px
                      </span>
                    </div>
                  </div>

                  {/* Blur */}
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
                        {...register('styles.boxShadowBlur', {
                          setValueAs: (v) => parseInt(v, 10),
                        })}
                        className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <span className="text-sm font-medium w-12 text-right">
                        {watch('styles.boxShadowBlur')}px
                      </span>
                    </div>
                  </div>

                  {/* Spread */}
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
                        {...register('styles.boxShadowSpread', {
                          setValueAs: (v) => parseInt(v, 10),
                        })}
                        className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <span className="text-sm font-medium w-12 text-right">
                        {watch('styles.boxShadowSpread')}px
                      </span>
                    </div>
                  </div>

                  {/* Shadow Color */}
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="shadowColor"
                      label="Cor da Sombra da Borda"
                      tooltip="A cor da sombra"
                    />
                    <div className="flex gap-2">
                      <Controller
                        name="styles.boxShadowColor"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="shadowColor"
                            type="color"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="w-16 h-10"
                          />
                        )}
                      />
                      <Controller
                        name="styles.boxShadowColor"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="text"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            placeholder="#000000"
                            className="flex-1"
                          />
                        )}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Form Actions */}
      <div className="flex gap-2 pt-4 border-t">
        <Button variant="outline" type="button" disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  );
}
