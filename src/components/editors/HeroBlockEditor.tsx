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
import { Card } from '@/components/ui/card';
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
}

export function HeroBlockEditor({ templateId, blockData, register, control, handleSubmit, formState, onSave }: HeroBlockEditorProps) {
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileImageUrl = useWatch({ control, name: 'profileImage' });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = (data: HeroBlockContent) => {
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Profile Image Section */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Imagem de Perfil</Label>
            <Switch
              {...register('profileImage')}
              defaultChecked={false}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {imagePreview || profileImageUrl ? (
                <img
                  src={imagePreview || profileImageUrl || ''}
                  alt="Profile Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              
              {(imagePreview || profileImageUrl) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4 mr-2" />
                  Remover
                </Button>
              )}
            </div>
          </div>
          
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          
          <Input
            {...register('profileImage')}
            placeholder="Ou cole a URL da imagem"
            className="mt-2"
          />
        </div>
      </Card>

      {/* User Information Section */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="userName" className="text-base font-medium">
              Nome do Usuário
            </Label>
            <Input
              id="userName"
              {...register('userName')}
              placeholder="Seu nome"
              className="mt-2"
            />
            {formState.errors.userName && (
              <p className="text-sm text-destructive mt-1">
                {formState.errors.userName.message}
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="userInfo" className="text-base font-medium">
              Informações do Usuário
            </Label>
            <Input
              id="userInfo"
              {...register('userInfo')}
              placeholder="Uma breve descrição"
              className="mt-2"
            />
          </div>
        </div>
      </Card>

      {/* Contact Buttons Section */}
      <Card className="p-6">
        <div className="space-y-4">
          <Label className="text-base font-medium">Botões de Contato</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phoneNumber" className="text-sm font-medium">
                <Phone className="h-4 w-4 inline mr-2" />
                Telefone
              </Label>
              <Input
                id="phoneNumber"
                {...register('phoneNumber')}
                placeholder="+55 11 99999-9999"
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="emailAddress" className="text-sm font-medium">
                <Mail className="h-4 w-4 inline mr-2" />
                Email
              </Label>
              <Input
                id="emailAddress"
                {...register('emailAddress')}
                placeholder="seu@email.com"
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="whatsappNumber" className="text-sm font-medium">
                <MessageSquare className="h-4 w-4 inline mr-2" />
                WhatsApp
              </Label>
              <Input
                id="whatsappNumber"
                {...register('whatsappNumber')}
                placeholder="+55 11 99999-9999"
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="scheduleLink" className="text-sm font-medium">
                <Calendar className="h-4 w-4 inline mr-2" />
                Link de Agendamento
              </Label>
              <Input
                id="scheduleLink"
                {...register('scheduleLink')}
                placeholder="https://calendly.com/seu-usuario"
                className="mt-2"
              />
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium">Modo de Email</Label>
            <Controller
              name="emailMode"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value || 'mailto'}
                  onValueChange={field.onChange}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mailto" id="mailto" />
                    <Label htmlFor="mailto" className="text-sm">Mailto</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="form" id="form" />
                    <Label htmlFor="form" className="text-sm">Formulário</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>
        </div>
      </Card>
      
      <Button type="submit" className="w-full">
        Salvar Alterações
      </Button>
    </form>
  );
}
