import Image from 'next/image';
import { ReactNode } from 'react';

interface ImageMockupProps {
  children: ReactNode;
}

export function ImageMockup({ children }: ImageMockupProps) {
  return (
    <div 
      className="relative w-96 bg-black rounded-[50px] shadow-2xl overflow-hidden"
      style={{ aspectRatio: '9 / 19.5' }}
    >
      {/* CAMADA 1 (z-0): Conteúdo da tela - rola internamente */}
      <div 
        className="absolute z-0 overflow-y-auto bg-white"
        style={{
          top: '12px',
          left: '12px',
          right: '12px',
          bottom: '12px',
          borderRadius: '40px'
        }}
      >
        {children}
      </div>

      {/* CAMADA 2 (z-10): Frame do celular - PNG com transparência */}
      <Image 
        src="/mockups/iphone-frame.png"
        alt="iPhone Frame"
        fill
        sizes="384px"
        className="absolute top-0 left-0 z-10 pointer-events-none object-contain"
        priority
      />
    </div>
  );
}
