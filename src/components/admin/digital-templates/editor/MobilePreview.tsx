"use client";

import { ReactNode } from "react";
import { CTAPreview } from "@/components/preview/CTAPreview";
import { HeroBlockContent } from "@/schemas/heroBlock.schemas";

interface MobilePreviewProps {
  templateName?: string;
  previewUrl?: string;
  heroValues?: HeroBlockContent;
  children?: ReactNode;
}

export function MobilePreview({ templateName = "Template", previewUrl = "example.com", heroValues, children }: MobilePreviewProps) {
  return (
    <div className="flex h-full w-full flex-col">
      {/* Top Info Bar */}
      <div className="mb-6 flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-foreground capitalize">
          {templateName}
        </h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span>
            Seu link é <span className="text-primary">{previewUrl}</span>
          </span>
        </div>
      </div>

      {/* Mobile Frame Wrapper */}
      <div className="flex flex-1 items-center justify-center">
        <div className="relative w-[320px] rounded-3xl bg-black shadow-2xl overflow-hidden border-8 border-black">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10" />

          {/* Screen Content */}
          <div className="flex h-[640px] w-full flex-col overflow-hidden bg-gradient-to-b from-blue-400 to-blue-600">
            {/* Status Bar Placeholder */}
            <div className="flex h-8 items-center justify-between bg-black/20 px-4 text-xs text-white">
              <span>9:41</span>
              <div className="flex gap-1">
                <span>📶</span>
                <span>🔋</span>
              </div>
            </div>

            {/* Preview Page Structure */}
            <div className="flex flex-col h-full overflow-y-auto">
              {/* 1. Hero Section - Topo (altura dinâmica baseada no conteúdo) */}
              {children}

              {/* 2. CTA Condicional (controlado pelo Hero) */}
              {heroValues?.isCTAEnabled && (
                <CTAPreview 
                  ctaText={heroValues.ctaText}
                  primaryColor="#FFFF00"
                  secondaryColor="#FF0000"
                />
              )}

              {/* 3. Conteúdo Dinâmico - Meio (flex-1 para preencher espaço restante) */}
              <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-blue-400 to-blue-600 p-6">
                <div className="text-center text-white">
                  <p className="text-sm font-medium">Conteúdo dinâmico</p>
                  <p className="text-xs text-white/70 mt-1">Blocos adicionais aparecerão aqui</p>
                </div>
              </div>

              {/* 3. Menu Mobile - Rodapé (altura fixa) */}
              <div className="h-16 bg-blue-800 border-t-2 border-blue-900 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">Menu Mobile</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Caption */}
      <p className="mt-6 text-xs text-muted-foreground">Preview</p>
    </div>
  );
}
