"use client";

import { Separator } from "@/components/ui/separator";
import { ProfileSection } from "@/components/admin/settings/ProfileSection";
import { AuthenticationSection } from "@/components/admin/settings/AuthenticationSection";
import { AppearanceSection } from "@/components/admin/settings/AppearanceSection";
import { LanguageRegionSection } from "@/components/admin/settings/LanguageRegionSection";
import { DateTimeSection } from "@/components/admin/settings/DateTimeSection";
import { SupportPermissionsSection } from "@/components/admin/settings/SupportPermissionsSection";
import { DangerZoneSection } from "@/components/admin/settings/DangerZoneSection";

/**
 * Página de Configurações do Usuário - Coluna Única
 * 
 * Exibe todas as seções de configuração em uma única página rolável.
 * Estrutura:
 * 1. Título principal
 * 2. Perfil
 * 3. Autenticação (2FA)
 * 4. Aparência
 * 5. Idioma e Região
 * 6. Formato de Data/Hora
 * 7. Permissões de Suporte
 * 8. Zona de Perigo
 * 
 * Separadores visuais entre cada seção para melhor organização.
 */
export default function SettingsProfilePage() {
  return (
    <main className="space-y-8">
      {/* Cabeçalho da Página */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Minhas Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie suas informações pessoais e preferências
        </p>
      </div>

      <Separator />

      {/* Seção 1: Perfil */}
      <ProfileSection />

      <Separator />

      {/* Seção 2: Autenticação (2FA) */}
      <AuthenticationSection />

      <Separator />

      {/* Seção 3: Aparência */}
      <AppearanceSection />

      <Separator />

      {/* Seção 4: Idioma e Região */}
      <LanguageRegionSection />

      <Separator />

      {/* Seção 5: Formato de Data e Hora */}
      <DateTimeSection />

      <Separator />

      {/* Seção 6: Permissões de Suporte */}
      <SupportPermissionsSection />

      <Separator />

      {/* Seção 7: Zona de Perigo */}
      <DangerZoneSection />
    </main>
  );
}
