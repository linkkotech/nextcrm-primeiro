"use client";

import { Button } from "@/components/ui/button";

/**
 * Seção de Zona de Perigo
 * Contém ações destrutivas: sair de todas as sessões, excluir conta
 */
export function DangerZoneSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Zona de perigo</h2>
        <p className="text-sm text-muted-foreground">
          Ações irreversíveis. Proceda com cuidado.
        </p>
      </div>

      <div className="space-y-3">
        {/* Sign Out All Sessions */}
        <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background p-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Sair de todas as sessões</p>
            <p className="text-xs text-muted-foreground">
              Saia de todas as sessões, inclusive as do dispositivo móvel, do iPad e de outros navegadores.
            </p>
          </div>
          <Button variant="outline" size="sm">
            Sair de todas as sessões
          </Button>
        </div>

        {/* Delete Account */}
        <div className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-destructive">Excluir conta</p>
            <p className="text-xs text-muted-foreground">
              Remova sua conta permanentemente. Esta ação não pode ser desfeita.
            </p>
          </div>
          <Button variant="destructive" size="sm">
            Excluir conta
          </Button>
        </div>
      </div>
    </div>
  );
}
