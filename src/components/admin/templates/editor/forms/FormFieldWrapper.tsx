"use client";

import { ReactNode } from "react";
import { Label } from "@/components/ui/label";

interface FormFieldWrapperProps {
  /**
   * Label text displayed above the input
   */
  label: string;

  /**
   * Unique ID for htmlFor attribute (connects label to input)
   */
  htmlFor?: string;

  /**
   * Form control component (Input, Select, Textarea, etc.)
   */
  children: ReactNode;

  /**
   * Optional help text displayed below the input
   */
  helpText?: string;

  /**
   * Optional error message (overrides helpText when present)
   */
  error?: string;

  /**
   * Additional CSS classes for the wrapper div
   */
  className?: string;
}

/**
 * FormFieldWrapper - Componente reutilizável para campos de formulário
 *
 * Implementa o padrão de design consistente para Inspector forms:
 * - space-y-1.5: Espaçamento entre label e controle
 * - text-xs font-medium: Label padronizado
 * - helpText/error: Feedback visual abaixo do input
 *
 * @example
 * <FormFieldWrapper label="Nome" htmlFor="name" helpText="Digite seu nome completo">
 *   <Input id="name" className="h-9" />
 * </FormFieldWrapper>
 *
 * @example
 * // Com erro
 * <FormFieldWrapper label="Email" htmlFor="email" error="Email inválido">
 *   <Input id="email" className="h-9" type="email" />
 * </FormFieldWrapper>
 */
export function FormFieldWrapper({
  label,
  htmlFor,
  children,
  helpText,
  error,
  className = "",
}: FormFieldWrapperProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label */}
      <Label htmlFor={htmlFor} className="text-xs font-medium">
        {label}
      </Label>

      {/* Control */}
      <div className="space-y-1">{children}</div>

      {/* Help Text ou Error */}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
      {!error && helpText && (
        <p className="text-xs text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
}
