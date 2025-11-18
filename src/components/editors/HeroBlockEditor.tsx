'use client';

import { useState, useRef } from 'react';
import type { ReactNode } from 'react';
import { Controller, UseFormRegister, Control, FormState, useWatch } from 'react-hook-form';
import {
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Upload,
  X,
  Image as ImageIcon,
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ColorPickerNative } from '@/components/ui/ColorPickerNative';
import { ImageCropDialog } from '@/components/ui/ImageCropDialog';
import {
  type HeroBlockContent,
} from '@/schemas/heroBlock.schemas';

interface Block {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  clickCount?: number;
  isActive: boolean;
  content: Record<string, unknown>;
  icon: React.ReactNode;
}

interface HeroBlockEditorProps {
  templateId: string;
  blockData: Block;
  register: UseFormRegister<HeroBlockContent>;
  control: Control<HeroBlockContent>;
  handleSubmit: (onSubmit: (data: HeroBlockContent) => void) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  formState: FormState<HeroBlockContent>;
  onSave: (data: HeroBlockContent) => void;
  onCTAToggle?: (enabled: boolean) => void;
}

export function HeroBlockEditor({ templateId, blockData, register, control, handleSubmit, formState, onSave, onCTAToggle }: HeroBlockEditorProps) {
  const [imagePreview, setImagePreview] = useState<string>('');
  const [headerLogoPreview, setHeaderLogoPreview] = useState<string>('');
  const [isProfileCropOpen, setProfileCropOpen] = useState(false);
  const [isHeaderCropOpen, setHeaderCropOpen] = useState(false);
  const [selectedProfileFile, setSelectedProfileFile] = useState<File | null>(null);
  const [selectedHeaderFile, setSelectedHeaderFile] = useState<File | null>(null);
  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const headerFileInputRef = useRef<HTMLInputElement>(null);
  const profileImageUrl = useWatch({ control, name: 'profileImage' });
  const headerLogoUrl = useWatch({ control, name: 'headerLogoUrl' });
  const isHeaderEnabled = useWatch({ control, name: 'isHeaderEnabled' });
  const scheduleEnabled = useWatch({ control, name: 'scheduleEnabled' });
  const isCTAEnabled = useWatch({ control, name: 'isCTAEnabled' });
  const headerLogoWidth = useWatch({ control, name: 'headerLogoWidth' });

  const removeImage = () => {
    setImagePreview('');
    control._formValues.profileImage = '';
  };

  const onSubmit = (data: HeroBlockContent) => {
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Profile Image */}
          <div className="space-y-2">
            <Label>Imagem de Perfil</Label>
            
            {/* Hidden File Input */}
            <input
              ref={profileFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedProfileFile(file);
                  setProfileCropOpen(true);
                }
              }}
            />
            
            {/* Profile Preview - Circular */}
            <div className="flex justify-center">
              <div className="relative h-24 w-24 rounded-full bg-muted border-2 border-border flex items-center justify-center overflow-hidden">
                {imagePreview || profileImageUrl ? (
                  <img
                    src={imagePreview || profileImageUrl || ''}
                    alt="Profile Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-10 w-10 text-muted-foreground/50" />
                )}
              </div>
            </div>

            {/* Drop Zone for Upload */}
            <div 
              onClick={() => profileFileInputRef.current?.click()}
              className="w-full h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition"
            >
              <Upload className="h-6 w-6 text-muted-foreground mb-2" />
              <p className="text-sm text-foreground">
                Clique ou arraste uma imagem
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG ou GIF
              </p>
            </div>
          </div>

          {/* User Name */}
          <div className="space-y-2">
            <Label htmlFor="userName">Nome do Usuário</Label>
            <Input
              id="userName"
              {...register('userName')}
              placeholder="Seu nome"
            />
            {formState.errors.userName && (
              <p className="text-sm text-destructive">
                {formState.errors.userName.message}
              </p>
            )}
          </div>
          
          {/* User Info */}
          <div className="space-y-2">
            <Label htmlFor="userInfo">Informações do Usuário</Label>
            <Input
              id="userInfo"
              {...register('userInfo')}
              placeholder="Uma breve descrição"
            />
          </div>
        </CardContent>
      </Card>

      {/* Informações de Contato */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informações de Contato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefone
              </Label>
              <Input
                id="phoneNumber"
                {...register('phoneNumber')}
                placeholder="+55 11 99999-9999"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emailAddress" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="emailAddress"
                {...register('emailAddress')}
                placeholder="seu@email.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                WhatsApp
              </Label>
              <Input
                id="whatsappNumber"
                {...register('whatsappNumber')}
                placeholder="+55 11 99999-9999"
              />
            </div>
            
            {scheduleEnabled && (
              <div className="space-y-2">
                <Label htmlFor="scheduleLink" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Link de Agendamento
                </Label>
                <Input
                  id="scheduleLink"
                  {...register('scheduleLink')}
                  placeholder="https://calendly.com/seu-usuario"
                />
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Modo de Email</Label>
            <Controller
              name="emailMode"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value || 'mailto'}
                  onValueChange={field.onChange}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mailto" id="mailto" />
                    <Label htmlFor="mailto">Mailto</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="form" id="form" />
                    <Label htmlFor="form">Formulário</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="scheduleEnabled"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label>Habilitar Link de Agendamento</Label>
          </div>
        </CardContent>
      </Card>

      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Controller
            name="isHeaderEnabled"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value || false}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label>Adicionar Header</Label>
        </div>

        {isHeaderEnabled && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Configuração do Header</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Logo Preview - 200x50px */}
              <div className="space-y-2">
                <Label>Preview da Logo</Label>
                <div className="w-full h-[50px] bg-muted border-2 border-border rounded-lg flex items-center justify-center overflow-hidden">
                  {headerLogoPreview || headerLogoUrl ? (
                    <img
                      src={headerLogoPreview || headerLogoUrl || ''}
                      alt="Header Logo Preview"
                      className="h-full object-contain"
                      style={{ maxWidth: `${headerLogoWidth || 100}px` }}
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground">Logo do Header (200x50px)</span>
                  )}
                </div>
              </div>

              {/* Drop Zone for Upload */}
              <div className="space-y-2">
                <Label>Upload da Logo</Label>
                
                {/* Hidden File Input */}
                <input
                  ref={headerFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedHeaderFile(file);
                      setHeaderCropOpen(true);
                    }
                  }}
                />
                
                <div 
                  onClick={() => headerFileInputRef.current?.click()}
                  className="w-full h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition"
                >
                  <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                  <p className="text-sm text-foreground">
                    Clique ou arraste uma imagem
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG ou GIF
                  </p>
                </div>
              </div>
              
              {/* Logo Width Slider */}
              <div className="space-y-2">
                <Label htmlFor="headerLogoWidth">Largura da Logo (px) - {headerLogoWidth || 100}</Label>
                <Controller
                  name="headerLogoWidth"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="range"
                      min="20"
                      max="200"
                      value={field.value || 100}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="w-full accent-primary"
                      style={{
                        border: 'none',
                        borderRight: '4px solid #d1d5db',
                      }}
                    />
                  )}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* CTA Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Controller
            name="isCTAEnabled"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value || false}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  onCTAToggle?.(checked);
                }}
              />
            )}
          />
          <Label>Adicionar botão Call to Action</Label>
        </div>

        {isCTAEnabled && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Call to Action</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                O botão Call to Action está ativo e será exibido logo abaixo do Hero. 
                Para editar o texto, URL e cores, acesse o card <strong>CTA (Call to Action)</strong> na lista de blocos.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Configurações de Cores */}
      <Accordion type="multiple" className="w-full space-y-2">
        <AccordionItem value="block-colors" className="border bg-secondary rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline hover:bg-secondary/80 transition-colors py-0 h-10">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-primary rounded"></div>
              <span className="font-medium">Configurações de Cores do Bloco</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Cor de Fundo</Label>
                <Controller
                  name="styles.backgroundColor"
                  control={control}
                  render={({ field }) => (
                    <ColorPickerNative
                      value={field.value || '#FFFFFF'}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Cor do Título</Label>
                <Controller
                  name="styles.blockTitleColor"
                  control={control}
                  render={({ field }) => (
                    <ColorPickerNative
                      value={field.value || '#1F2937'}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Cor do Subtítulo</Label>
                <Controller
                  name="styles.blockSubtitleColor"
                  control={control}
                  render={({ field }) => (
                    <ColorPickerNative
                      value={field.value || '#666666'}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Cor do Texto</Label>
                <Controller
                  name="styles.textColor"
                  control={control}
                  render={({ field }) => (
                    <ColorPickerNative
                      value={field.value || '#333333'}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Cor do Link</Label>
                <Controller
                  name="styles.blockLinkColor"
                  control={control}
                  render={({ field }) => (
                    <ColorPickerNative
                      value={field.value || '#007BFF'}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Cor de Fundo do Header</Label>
                <Controller
                  name="styles.headerBackgroundColor"
                  control={control}
                  render={({ field }) => (
                    <ColorPickerNative
                      value={field.value || '#FFFFFF'}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="button-colors" className="border bg-secondary rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline hover:bg-secondary/80 transition-colors py-0 h-10">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-primary rounded"></div>
              <span className="font-medium">Configuração de Cores dos Botões</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Fundo do Botão</Label>
                <Controller
                  name="styles.buttonBackgroundColor"
                  control={control}
                  render={({ field }) => (
                    <ColorPickerNative
                      value={field.value || '#007BFF'}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Texto do Botão</Label>
                <Controller
                  name="styles.buttonTextColor"
                  control={control}
                  render={({ field }) => (
                    <ColorPickerNative
                      value={field.value || '#FFFFFF'}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Ícone do Botão</Label>
                <Controller
                  name="styles.buttonIconColor"
                  control={control}
                  render={({ field }) => (
                    <ColorPickerNative
                      value={field.value || '#FFFFFF'}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Image Crop Dialog for Profile Image */}
      <ImageCropDialog
        isOpen={isProfileCropOpen}
        onClose={() => {
          setProfileCropOpen(false);
          setSelectedProfileFile(null);
          if (profileFileInputRef.current) profileFileInputRef.current.value = '';
        }}
        onSave={(dataUrl: string) => {
          // Update form value directly
          control._formValues.profileImage = dataUrl;
          // Update preview immediately
          setImagePreview(dataUrl);
          // Close dialog
          setProfileCropOpen(false);
          setSelectedProfileFile(null);
          if (profileFileInputRef.current) profileFileInputRef.current.value = '';
        }}
        aspect={1}
        circularCrop={true}
        file={selectedProfileFile}
      />

      {/* Image Crop Dialog for Header Logo */}
      <ImageCropDialog
        isOpen={isHeaderCropOpen}
        onClose={() => {
          setHeaderCropOpen(false);
          setSelectedHeaderFile(null);
          if (headerFileInputRef.current) headerFileInputRef.current.value = '';
        }}
        onSave={(dataUrl: string) => {
          // Update form value directly
          control._formValues.headerLogoUrl = dataUrl;
          // Update preview immediately
          setHeaderLogoPreview(dataUrl);
          // Close dialog
          setHeaderCropOpen(false);
          setSelectedHeaderFile(null);
          if (headerFileInputRef.current) headerFileInputRef.current.value = '';
        }}
        aspect={4}
        file={selectedHeaderFile}
      />

      <Button type="submit" className="w-full">
        Salvar Alterações
      </Button>
    </form>
  );
}
