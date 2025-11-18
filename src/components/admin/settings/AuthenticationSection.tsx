"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

/**
 * Seção de Autenticação de Dois Fatores (2FA)
 * Permite ativar/desativar SMS e TOTP
 */
export function AuthenticationSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Autenticação de dois fatores (2FA)</h2>
        <p className="text-sm text-muted-foreground">
          Mantenha sua conta segura habilitando a autenticação de dois fatores via SMS ou usando uma senha temporária (TOTP) de um aplicativo autenticador.
        </p>
      </div>

      {/* SMS 2FA */}
      <div className="flex items-center justify-between rounded-lg border border-border p-4">
        <div className="space-y-1">
          <Label className="text-base font-medium">Mensagem de Texto (SMS)</Label>
          <p className="text-sm text-muted-foreground">
            Receba um código de acesso único por SMS sempre que fizer login.
          </p>
        </div>
        <Switch />
      </div>

      {/* TOTP 2FA */}
      <div className="flex items-center justify-between rounded-lg border border-border p-4">
        <div className="space-y-1">
          <Label className="text-base font-medium">Aplicativo autenticador (TOTP)</Label>
          <p className="text-sm text-muted-foreground">
            Use um aplicativo para receber uma senha temporária única cada vez que você fizer login.
          </p>
        </div>
        <Switch />
      </div>
    </div>
  );
}
