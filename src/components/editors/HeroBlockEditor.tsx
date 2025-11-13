'use client';

import { useMemo, useState, useRef } from 'react';
import { Controller, UseFormRegister, Control, UseFormHandleSubmit, FormState, useWatch } from 'react-hook-form';
import {
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  HelpCircle,
  AlignCenter,
  AlignLeft,
  AlignJustify,
  AlignRight,
  Upload,
  X,
  Image as ImageIcon,
  Info,
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  type HeroBlockContent,
} from '@/schemas/heroBlock.schemas';

interface HeroBlock {
  id: string;
  content: Record<string, any>;
}

interface HeroBlockEditorProps {
  blockData: HeroBlock;
  templateId: string;
  onSave?: (data: HeroBlockContent) => Promise<any>;
  register: UseFormRegister<HeroBlockContent>;
  control: Control<HeroBlockContent>;
  handleSubmit: UseFormHandleSubmit<HeroBlockContent>;
  formState: FormState<HeroBlockContent>;
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
  register,
  control,
  handleSubmit,
  formState,
}: HeroBlockEditorProps) {
  const { errors, isSubmitting } = formState;

  // Image upload state
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Header logo upload state
  const [isHeaderLogoDragging, setIsHeaderLogoDragging] = useState(false);
  const [uploadedHeaderLogo, setUploadedHeaderLogo] = useState<string | null>(null);
  const headerLogoInputRef = useRef<HTMLInputElement>(null);

  // Usar useWatch para observar valores e forçar re-render
  const isHeaderEnabled = useWatch({ control, name: 'isHeaderEnabled', defaultValue: false });
  const scheduleEnabled = useWatch({ control, name: 'scheduleEnabled', defaultValue: false });
  const sensitiveContentWarning = useWatch({ control, name: 'sensitiveContentWarning', defaultValue: false });
  const isCTAEnabled = useWatch({ control, name: 'isCTAEnabled', defaultValue: false });
  
  // Handle profile image upload
  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setUploadedImage(base64String);
        // Update form value
        const event = { target: { name: 'profileImage', value: base64String } };
        register('profileImage').onChange(event);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle header logo upload
  const handleHeaderLogoUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setUploadedHeaderLogo(base64String);
        // Update form value
        const event = { target: { name: 'headerLogoUrl', value: base64String } };
        register('headerLogoUrl').onChange(event);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag events for profile image
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  // Handle drag events for header logo
  const handleHeaderLogoDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHeaderLogoDragging(true);
  };

  const handleHeaderLogoDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHeaderLogoDragging(false);
  };

  const handleHeaderLogoDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleHeaderLogoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHeaderLogoDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleHeaderLogoUpload(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleHeaderLogoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleHeaderLogoUpload(files[0]);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    const event = { target: { name: 'profileImage', value: '' } };
    register('profileImage').onChange(event);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveHeaderLogo = () => {
    setUploadedHeaderLogo(null);
    const event = { target: { name: 'headerLogoUrl', value: '' } };
    register('headerLogoUrl').onChange(event);
    if (headerLogoInputRef.current) {
      headerLogoInputRef.current.value = '';
    }
  };

  // Border radius options
  const borderRadiusOptions = useMemo(
    () => [
      { value: 'reto', label: 'Reto (0px)' },
      { value: 'arredondado', label: 'Arredondado (8px)' },
      { value: 'redondo', label: 'Redondo (999px)' },
    ],
    []
  );

  // Border style options
  const borderStyleOptions = useMemo(
    () => [
      { value: 'solid', label: 'Sólido' },
      { value: 'dashed', label: 'Tracejado' },
      { value: 'dotted', label: 'Pontilhado' },
      { value: 'hidden', label: 'Oculto' },
    ],
    []
  );

  const onSubmit = handleSubmit(async (data) => {
    try {
      await onSave?.(data);
    } catch (error) {
      console.error('Error saving hero block:', error);
    }
  });

  return (
    <div className="space-y-8 py-6">
      {/* ===== SEÇÃO 1: INFORMAÇÕES PRINCIPAIS ===== */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Informações Principais</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Configure o título, subtítulo e imagem de perfil
          </p>
        </div>

        <div className="space-y-3">
          {/* Imagem de Perfil - Upload Area */}
          <div>
            <Label htmlFor="profileImage">Imagem de Perfil</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 mt-2 transition-colors ${
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-muted hover:border-primary/50'
              }`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {uploadedImage ? (
                // Preview da imagem carregada
                <div className="relative">
                  <div className="flex items-center justify-center">
                    <img
                      src={uploadedImage}
                      alt="Preview"
                      className="max-h-48 rounded-lg object-contain"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Clique no X para remover ou arraste uma nova imagem
                  </p>
                </div>
              ) : (
                // Área de upload
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="rounded-full bg-muted p-4">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Procurar...
                      </Button>
                      <span className="text-sm text-muted-foreground">ou arraste e solte</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      jpg, jpeg, png, svg, gif, webp, avif permitido. 2 MB máximo.
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileInputChange}
                  />
                </div>
              )}
              <input type="hidden" {...register('profileImage')} />
              {errors.profileImage && (
                <p className="text-sm text-destructive mt-2 text-center">
                  {errors.profileImage.message}
                </p>
              )}
            </div>
          </div>

          {/* userName */}
          <div>
            <Label htmlFor="userName">Nome do usuário (título)</Label>
            <Input
              id="userName"
              placeholder="Seu nome completo"
              {...register('userName')}
              className={errors.userName ? 'border-destructive' : ''}
            />
            {errors.userName && (
              <p className="text-sm text-destructive mt-1">
                {errors.userName.message}
              </p>
            )}
          </div>

          {/* userInfo */}
          <div>
            <Label htmlFor="userInfo">Informações do usuário (subtítulo)</Label>
            <Input
              id="userInfo"
              placeholder="Cargo ou descrição"
              {...register('userInfo')}
              className={errors.userInfo ? 'border-destructive' : ''}
            />
            {errors.userInfo && (
              <p className="text-sm text-destructive mt-1">
                {errors.userInfo.message}
              </p>
            )}
          </div>
        </div>

        <hr className="border-muted" />
      </div>

      {/* ===== SEÇÃO 3: BOTÕES DE CONTATO ===== */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Botões de Contato</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Configure os botões de contato que serão exibidos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Phone */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="phoneNumber">Telefone</Label>
            </div>
            <Input
              id="phoneNumber"
              placeholder="(11) 98765-4321"
              {...register('phoneNumber')}
              className={errors.phoneNumber ? 'border-destructive' : ''}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="emailAddress">E-mail</Label>
            </div>
            <Input
              id="emailAddress"
              type="email"
              placeholder="contato@exemplo.com"
              {...register('emailAddress')}
              className={errors.emailAddress ? 'border-destructive' : ''}
            />
            {errors.emailAddress && (
              <p className="text-sm text-destructive">{errors.emailAddress.message}</p>
            )}
          </div>

          {/* WhatsApp */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="whatsappNumber">WhatsApp</Label>
            </div>
            <Input
              id="whatsappNumber"
              placeholder="11987654321"
              {...register('whatsappNumber')}
              className={errors.whatsappNumber ? 'border-destructive' : ''}
            />
            {errors.whatsappNumber && (
              <p className="text-sm text-destructive">{errors.whatsappNumber.message}</p>
            )}
          </div>

          {/* Schedule Link */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="scheduleLink">Link de Agendamento</Label>
            </div>
            <Input
              id="scheduleLink"
              placeholder="https://calendly.com/..."
              {...register('scheduleLink')}
              className={errors.scheduleLink ? 'border-destructive' : ''}
            />
            {errors.scheduleLink && (
              <p className="text-sm text-destructive">{errors.scheduleLink.message}</p>
            )}
          </div>
        </div>

        {/* Schedule Enabled Switch */}
        <div className="flex items-center justify-between py-2">
          <Label htmlFor="scheduleEnabled" className="cursor-pointer">
            Habilitar botão de agendamento
          </Label>
          <Controller
            name="scheduleEnabled"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <Switch
                id="scheduleEnabled"
                checked={field.value || false}
                onCheckedChange={field.onChange}
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              />
            )}
          />
        </div>

        {/* Email Mode */}
        <div className="space-y-2">
          <Label>Modo de E-mail</Label>
          <Controller
            name="emailMode"
            control={control}
            render={({ field }) => (
              <RadioGroup value={field.value || 'mailto'} onValueChange={field.onChange}>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mailto" id="emailMode-mailto" />
                    <Label htmlFor="emailMode-mailto">Link (mailto:)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="form" id="emailMode-form" />
                    <Label htmlFor="emailMode-form">Formulário</Label>
                  </div>
                </div>
              </RadioGroup>
            )}
          />
        </div>

        <hr className="border-muted" />
      </div>

      {/* ===== SEÇÃO 4: CONFIGURAÇÕES DO CABEÇALHO ===== */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Configurações do Cabeçalho</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Configure o header da Hero Section
          </p>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="isHeaderEnabled" className="cursor-pointer">
            Adicionar Header
          </Label>
          <Controller
            name="isHeaderEnabled"
            control={control}
            render={({ field }) => (
              <Switch
                id="isHeaderEnabled"
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        {isHeaderEnabled ? (
          <Card className="p-4 bg-muted/50 space-y-6">
            
            {/* Header Logo Upload */}
            <div>
              <Label htmlFor="headerLogoUrl">Logo do Header</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 mt-2 transition-colors ${
                  isHeaderLogoDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-muted hover:border-primary/50'
                }`}
                onDragEnter={handleHeaderLogoDragEnter}
                onDragOver={handleHeaderLogoDragOver}
                onDragLeave={handleHeaderLogoDragLeave}
                onDrop={handleHeaderLogoDrop}
              >
                {uploadedHeaderLogo ? (
                  // Preview da logo carregada
                  <div className="relative">
                    <div className="flex items-center justify-center">
                      <img
                        src={uploadedHeaderLogo}
                        alt="Preview Logo"
                        className="max-h-32 rounded-lg object-contain"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveHeaderLogo}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <p className="text-xs text-center text-muted-foreground mt-2">
                      Clique no X para remover ou arraste uma nova imagem
                    </p>
                  </div>
                ) : (
                  // Área de upload
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="rounded-full bg-muted p-4">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => headerLogoInputRef.current?.click()}
                        >
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Procurar...
                        </Button>
                        <span className="text-sm text-muted-foreground">ou arraste e solte</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        jpg, jpeg, png, svg, gif, webp, avif permitido. 2 MB máximo.
                      </p>
                    </div>
                    <input
                      ref={headerLogoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleHeaderLogoInputChange}
                    />
                  </div>
                )}
                <input type="hidden" {...register('headerLogoUrl')} />
                {errors.headerLogoUrl && (
                  <p className="text-sm text-destructive mt-2 text-center">
                    {errors.headerLogoUrl.message}
                  </p>
                )}
              </div>
            </div>

            {/* Header Logo Width */}
            <div className="space-y-3">
              <LabelWithTooltip
                label="Largura do Logo (px)"
                tooltip="Defina a largura do logo (20-200px)"
              />
              <Controller
                name="headerLogoWidth"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={20}
                      max={200}
                      step={1}
                      value={field.value || 80}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                      className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:border-0 [&::-webkit-slider-runnable-track]:bg-blue-500/20 [&::-moz-range-track]:bg-blue-500/20"
                    />
                    <span className="text-sm font-medium w-16 text-right">
                      {field.value || 80}px
                    </span>
                  </div>
                )}
              />
            </div>

            {/* Header Menu Enabled */}
            <div className="flex items-center justify-between">
              <Label htmlFor="headerMenuEnabled" className="cursor-pointer">
                Habilitar Menu no Header
              </Label>
              <Controller
                name="headerMenuEnabled"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="headerMenuEnabled"
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </Card>
        ) : null}

        <hr className="border-muted" />
      </div>

      {/* ===== SEÇÃO 7: CALL TO ACTION ===== */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Call to Action (CTA)</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Habilite ou desabilite o botão de ação principal
          </p>
        </div>

        <div className="flex items-center justify-between py-2">
          <Label htmlFor="isCTAEnabled" className="cursor-pointer">
            Habilitar Botão CTA
          </Label>
          <Controller
            name="isCTAEnabled"
            control={control}
            render={({ field }) => (
              <Switch
                id="isCTAEnabled"
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        {isCTAEnabled && (
          <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Um bloco CTA será adicionado abaixo do Hero
            </p>
          </div>
        )}

        <hr className="border-muted" />
      </div>

      {/* ===== SEÇÃO 8: CONFIGURAÇÕES AVANÇADAS (ACCORDION) ===== */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-4">Configurações Avançadas de Estilo</h3>
        </div>

        <Accordion type="multiple" className="space-y-2">
          {/* ===== ACCORDION ITEM 1: CORES ===== */}
          <AccordionItem value="colors-config" className="border rounded-lg px-4 bg-muted/30">
            <AccordionTrigger className="text-base font-medium hover:no-underline py-4">
              🎨 Configurações de Cores
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2 pb-4">
              {/* Block Background Color */}
              <div className="space-y-2">
                <Label>Cor de Fundo do Bloco</Label>
                <Controller
                  name="styles.blockBackgroundColor"
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={field.value || '#ffffff'}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-16 h-10 cursor-pointer"
                      />
                      <Input
                        value={field.value || '#ffffff'}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="#ffffff"
                        className="flex-1"
                      />
                    </div>
                  )}
                />
              </div>

              {/* Block Title Color */}
              <div className="space-y-2">
                <Label>Cor do Título do Bloco</Label>
                <Controller
                  name="styles.blockTitleColor"
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={field.value || '#000000'}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-16 h-10 cursor-pointer"
                      />
                      <Input
                        value={field.value || '#000000'}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  )}
                />
              </div>

              {/* Block Subtitle Color */}
              <div className="space-y-2">
                <Label>Cor do Subtítulo do Bloco</Label>
                <Controller
                  name="styles.blockSubtitleColor"
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={field.value || '#666666'}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-16 h-10 cursor-pointer"
                      />
                      <Input
                        value={field.value || '#666666'}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="#666666"
                        className="flex-1"
                      />
                    </div>
                  )}
                />
              </div>

              {/* Block Text Color */}
              <div className="space-y-2">
                <Label>Cor do Texto do Bloco</Label>
                <Controller
                  name="styles.blockTextColor"
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={field.value || '#000000'}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-16 h-10 cursor-pointer"
                      />
                      <Input
                        value={field.value || '#000000'}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  )}
                />
              </div>

              {/* Block Link Color */}
              <div className="space-y-2">
                <Label>Cor dos Links do Bloco</Label>
                <Controller
                  name="styles.blockLinkColor"
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={field.value || '#0066cc'}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-16 h-10 cursor-pointer"
                      />
                      <Input
                        value={field.value || '#0066cc'}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="#0066cc"
                        className="flex-1"
                      />
                    </div>
                  )}
                />
              </div>

              {/* Button Background Color */}
              <div className="space-y-2">
                <Label>Cor de Fundo do Botão</Label>
                <Controller
                  name="styles.buttonBackgroundColor"
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={field.value || '#0066cc'}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-16 h-10 cursor-pointer"
                      />
                      <Input
                        value={field.value || '#0066cc'}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="#0066cc"
                        className="flex-1"
                      />
                    </div>
                  )}
                />
              </div>

              {/* Button Text Color */}
              <div className="space-y-2">
                <Label>Cor do Texto do Botão</Label>
                <Controller
                  name="styles.buttonTextColor"
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={field.value || '#ffffff'}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-16 h-10 cursor-pointer"
                      />
                      <Input
                        value={field.value || '#ffffff'}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="#ffffff"
                        className="flex-1"
                      />
                    </div>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ===== ACCORDION ITEM 2: BORDAS ===== */}
          <AccordionItem value="border-config" className="border rounded-lg px-4 bg-muted/30">
            <AccordionTrigger className="text-base font-medium hover:no-underline py-4">
              ⬛ Configurações de Borda
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2 pb-4">
              {/* Border Width */}
              <div className="space-y-2">
                <LabelWithTooltip
                  label="Largura da Borda"
                  tooltip="Define a espessura da borda (0-10px)"
                />
                <Controller
                  name="styles.borderWidth"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={0}
                        max={10}
                        step={1}
                        value={field.value || 0}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                        className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <span className="text-sm font-medium w-12 text-right">
                        {field.value || 0}px
                      </span>
                    </div>
                  )}
                />
              </div>

              {/* Border Color */}
              <div className="space-y-2">
                <Label>Cor da Borda</Label>
                <Controller
                  name="styles.borderColor"
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={field.value || '#000000'}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-16 h-10 cursor-pointer"
                      />
                      <Input
                        value={field.value || '#000000'}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  )}
                />
              </div>

              {/* Border Radius */}
              <div className="space-y-2">
                <Label>Raio da Borda</Label>
                <Controller
                  name="styles.borderRadius"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup value={field.value || 'reto'} onValueChange={field.onChange}>
                      <div className="flex flex-col gap-2">
                        {borderRadiusOptions.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value} id={`borderRadius-${option.value}`} />
                            <Label htmlFor={`borderRadius-${option.value}`}>{option.label}</Label>
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
                    <RadioGroup value={field.value || 'solid'} onValueChange={field.onChange}>
                      <div className="flex flex-col gap-2">
                        {borderStyleOptions.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value} id={`borderStyle-${option.value}`} />
                            <Label htmlFor={`borderStyle-${option.value}`}>{option.label}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ===== ACCORDION ITEM 3: SOMBRAS ===== */}
          <AccordionItem value="shadow-config" className="border rounded-lg px-4 bg-muted/30">
            <AccordionTrigger className="text-base font-medium hover:no-underline py-4">
              ☁️ Configurações de Sombra
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2 pb-4">
              {/* H-Offset */}
              <div className="space-y-2">
                <LabelWithTooltip label="Sombra Horizontal" tooltip="Posição horizontal da sombra (-20 a 20px)" />
                <Controller
                  name="styles.boxShadowHOffset"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={-20}
                        max={20}
                        step={1}
                        value={field.value || 0}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                        className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <span className="text-sm font-medium w-12 text-right">{field.value || 0}px</span>
                    </div>
                  )}
                />
              </div>

              {/* V-Offset */}
              <div className="space-y-2">
                <LabelWithTooltip label="Sombra Vertical" tooltip="Posição vertical da sombra (-20 a 20px)" />
                <Controller
                  name="styles.boxShadowVOffset"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={-20}
                        max={20}
                        step={1}
                        value={field.value || 0}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                        className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <span className="text-sm font-medium w-12 text-right">{field.value || 0}px</span>
                    </div>
                  )}
                />
              </div>

              {/* Blur */}
              <div className="space-y-2">
                <LabelWithTooltip label="Desfoque (Blur)" tooltip="Intensidade do desfoque (0-20px)" />
                <Controller
                  name="styles.boxShadowBlur"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={0}
                        max={20}
                        step={1}
                        value={field.value || 0}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                        className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <span className="text-sm font-medium w-12 text-right">{field.value || 0}px</span>
                    </div>
                  )}
                />
              </div>

              {/* Spread */}
              <div className="space-y-2">
                <LabelWithTooltip label="Expansão (Spread)" tooltip="Tamanho da expansão da sombra (0-10px)" />
                <Controller
                  name="styles.boxShadowSpread"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={0}
                        max={10}
                        step={1}
                        value={field.value || 0}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                        className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <span className="text-sm font-medium w-12 text-right">{field.value || 0}px</span>
                    </div>
                  )}
                />
              </div>

              {/* Shadow Color */}
              <div className="space-y-2">
                <Label>Cor da Sombra</Label>
                <Controller
                  name="styles.boxShadowColor"
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={field.value || '#000000'}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-16 h-10 cursor-pointer"
                      />
                      <Input
                        value={field.value || '#000000'}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* ===== BOTÃO DE SUBMIT ===== */}
      <div className="pt-6 border-t">
        <Button
          type="submit"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? 'Salvando...' : 'Atualizar Hero Section'}
        </Button>
      </div>
    </div>
  );
}
