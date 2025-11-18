"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

/**
 * Seção de Permissões de Suporte
 * Controla quais permissões o suporte tem para acessar a conta
 */
export function SupportPermissionsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Permissões de login para o suporte da Linkko</h2>
        <p className="text-sm text-muted-foreground">
          Se as permissões de login foram concedidas, nossos especialistas de suporte treinados poderão acessar sua conta para solucionar problemas específicos mencionados em um ticket de suporte. Leia mais sobre nossa Política de Segurança{" "}
          <a href="#" className="underline text-primary hover:text-primary/80">
            aqui
          </a>
          .
        </p>
      </div>

      <RadioGroup defaultValue="disabled">
        {/* Desabilitado */}
        <div className="flex items-start gap-3 rounded-lg border border-border p-4">
          <RadioGroupItem value="disabled" id="support-disabled" className="mt-1" />
          <div className="flex-1 space-y-1">
            <Label htmlFor="support-disabled" className="text-base font-medium cursor-pointer">
              Desabilitado
            </Label>
          </div>
        </div>

        {/* Login e teste */}
        <div className="flex items-start gap-3 rounded-lg border border-border p-4">
          <RadioGroupItem value="login-test" id="support-login-test" className="mt-1" />
          <div className="flex-1 space-y-1">
            <Label htmlFor="support-login-test" className="text-base font-medium cursor-pointer">
              Permissões de login e teste concedidas
            </Label>
            <p className="text-sm text-muted-foreground">
              Os especialistas de suporte podem fazer login na sua conta e testar recursos.
            </p>
          </div>
        </div>

        {/* Login, screenshot e vídeo */}
        <div className="flex items-start gap-3 rounded-lg border border-border p-4">
          <RadioGroupItem value="login-screen-record" id="support-full" className="mt-1" />
          <div className="flex-1 space-y-1">
            <Label htmlFor="support-full" className="text-base font-medium cursor-pointer">
              Permissões de login, captura de tela e gravação de vídeos concedidas
            </Label>
            <p className="text-sm text-muted-foreground">
              Os especialistas de suporte podem fazer login, tirar capturas de tela e gravar vídeos da sua tela.
            </p>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
}
