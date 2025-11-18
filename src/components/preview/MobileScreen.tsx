'use client';
import { StatusBar } from './StatusBar';
import { TopBanner } from './TopBanner';
import { HeroPreview } from './HeroPreview';
import { CTAPreview } from './CTAPreview';
import { HeroBlockContent } from '@/schemas/heroBlock.schemas';

interface MobileScreenProps {
  heroValues?: HeroBlockContent;
  dynamicBlocks?: Array<{
    id: string;
    type: string;
    content: any;
    isActive: boolean;
  }>;
}

export function MobileScreen({ heroValues, dynamicBlocks = [] }: MobileScreenProps) {
  return (
    <div className="h-full w-full flex flex-col bg-white overflow-y-auto">
      {/* Camada 1: Status Bar */}
      <StatusBar />
      
      {/* Camada 2: Área Hero - Neutral */}
      <div className="bg-slate-100 p-4">
        <HeroPreview values={heroValues} />
      </div>
      
      {/* Camada 3: Blocos Dinâmicos - Neutral */}
      <div className="flex-1 bg-slate-50 p-4 space-y-4">
        {/* CTA Block - se habilitado */}
        {heroValues?.isCTAEnabled && heroValues?.ctaText && (
          <CTAPreview 
            ctaText={heroValues.ctaText}
            primaryColor={heroValues.styles?.buttonBackgroundColor}
            secondaryColor={heroValues.styles?.buttonTextColor}
          />
        )}
        
        {/* Blocos dinâmicos adicionais */}
        {dynamicBlocks
          .filter(block => block.isActive)
          .map((block) => {
            switch (block.type) {
              case 'cta':
                return (
                  <CTAPreview 
                    key={block.id} 
                    ctaText={block.content?.name}
                    primaryColor={block.content?.primaryColor}
                    secondaryColor={block.content?.secondaryColor}
                  />
                );
              default:
                return null;
            }
          })}
      </div>
    </div>
  );
}