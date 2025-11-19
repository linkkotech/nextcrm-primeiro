import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configurações da Plataforma | NextCRM",
  description: "Gerencie as configurações globais da plataforma, integrações e licenças",
};

/**
 * Página de Configurações da Plataforma (Admin)
 * 
 * Destinada a configurações globais da plataforma:
 * - Integrações
 * - Licenças
 * - Políticas globais
 * - Configurações de segurança do sistema
 * 
 * Nota: Configurações de perfil do usuário foram movidas para /admin/profile/settings
 */
export default function PlatformSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações da Plataforma</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie as configurações globais da plataforma, integrações e licenças.
        </p>
      </div>

      <div className="flex h-96 w-full items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/5">
        <p className="text-muted-foreground text-center">
          O painel de configurações da plataforma será implementado aqui.
        </p>
      </div>
    </div>
  );
}


