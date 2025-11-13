'use client';

import { PlusCircle, Phone, Mail, MessageSquare, Calendar } from 'lucide-react';
import { HeaderPreview } from './HeaderPreview';
import { HeroBlockContent } from '@/schemas/heroBlock.schemas';

interface HeroPreviewProps {
  values?: HeroBlockContent;
}

export function HeroPreview({ values }: HeroPreviewProps) {
  // Compute background color dynamically
  const backgroundColor = values?.styles?.blockBackgroundColor || '#ffffff';
  const titleColor = values?.styles?.blockTitleColor || '#1f2937';
  const subtitleColor = values?.styles?.blockSubtitleColor || '#4b5563';
  const buttonBgColor = values?.styles?.buttonBackgroundColor || '#e5e7eb';
  const buttonTextColor = values?.styles?.buttonTextColor || '#374151';

  return (
    <div className="w-full flex flex-col gap-6" style={{ backgroundColor }}>
      {/* Header Condicional */}
      {values?.isHeaderEnabled && <HeaderPreview />}

      {/* Seção 2: Imagem de Perfil + Ícone Salvar */}
      <div className="flex items-center justify-center">
        <div className="relative">
          {/* Imagem de Perfil - Centralizada */}
          <div className="w-32 h-32 rounded-full bg-gray-200 border-[7px] border-gray-400 flex items-center justify-center">
            <span className="text-xs text-gray-500 text-center px-2">imagem de perfil</span>
          </div>

          {/* Ícone Salvar Contato - Posicionado à direita */}
          <PlusCircle className="h-8 w-8 text-gray-500 absolute -right-6 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Seção 3: Nome e Cargo do Usuário */}
      <div className="text-center space-y-3">
        {/* Nome do Usuário - título */}
        <h1 className="text-2xl font-bold leading-[1.5rem]" style={{ color: titleColor }}>
          {values?.userName || 'Nome do Usuário'}
        </h1>

        {/* Cargo do Usuário - subtítulo */}
        <p className="text-sm" style={{ color: subtitleColor }}>
          {values?.userInfo || 'Cargo do Usuário'}
        </p>
      </div>

      {/* Seção 4: Botões de Ação Principais */}
      <div className="flex justify-around items-start pb-6">
        {/* Item Telefone */}
        {values?.phoneNumber && (
          <div className="flex flex-col items-center gap-2">
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center border" 
              style={{ backgroundColor: buttonBgColor, borderColor: buttonTextColor }}
            >
              <Phone className="h-6 w-6" style={{ color: buttonTextColor }} />
            </div>
            <span className="text-xs font-medium" style={{ color: buttonTextColor }}>Ligar</span>
          </div>
        )}

        {/* Item E-mail */}
        {values?.emailAddress && (
          <div className="flex flex-col items-center gap-2">
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center border" 
              style={{ backgroundColor: buttonBgColor, borderColor: buttonTextColor }}
            >
              <Mail className="h-6 w-6" style={{ color: buttonTextColor }} />
            </div>
            <span className="text-xs font-medium" style={{ color: buttonTextColor }}>E-mail</span>
          </div>
        )}

        {/* Item WhatsApp */}
        {values?.whatsappNumber && (
          <div className="flex flex-col items-center gap-2">
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center border" 
              style={{ backgroundColor: buttonBgColor, borderColor: buttonTextColor }}
            >
              <MessageSquare className="h-6 w-6" style={{ color: buttonTextColor }} />
            </div>
            <span className="text-xs font-medium" style={{ color: buttonTextColor }}>WhatsApp</span>
          </div>
        )}

        {/* Item Agenda */}
        {values?.scheduleEnabled && values?.scheduleLink && (
          <div className="flex flex-col items-center gap-2">
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center border" 
              style={{ backgroundColor: buttonBgColor, borderColor: buttonTextColor }}
            >
              <Calendar className="h-6 w-6" style={{ color: buttonTextColor }} />
            </div>
            <span className="text-xs font-medium" style={{ color: buttonTextColor }}>Agenda</span>
          </div>
        )}
      </div>
    </div>
  );
}
