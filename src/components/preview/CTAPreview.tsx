"use client";

import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CTAPreviewProps {
  ctaText?: string;
  icon?: React.ReactNode;
  primaryColor?: string;
  secondaryColor?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function CTAPreview({
  ctaText = "AGENDAR UMA REUNIÃO",
  icon,
  primaryColor = "#FFFF00",
  secondaryColor = "#FF0000",
  buttonVariant = "default",
}: CTAPreviewProps) {
  const defaultIcon = <Calendar className="mr-2 h-5 w-5" />;
  
  return (
    // Camada 1: Container Externo (amarelo)
    <div 
      className="w-full my-0 px-4 py-2"
      style={{ backgroundColor: primaryColor }}
    >
      {/* Camada 2: Container Intermediário (vermelho, bordas superiores arredondadas) */}
      <div 
        className="w-full rounded-t-3xl rounded-b-none p-6"
        style={{ backgroundColor: secondaryColor }}
      >
        {/* Camada 3: Botão CTA */}
        <Button 
          variant={buttonVariant}
          className="w-full h-14 text-lg font-semibold"
        >
          {icon || defaultIcon}
          {ctaText}
        </Button>
      </div>
    </div>
  );
}
