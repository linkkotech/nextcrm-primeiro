"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { ProfileSection } from "./ProfileSection";
import { AuthenticationSection } from "./AuthenticationSection";
import { AppearanceSection } from "./AppearanceSection";
import { LanguageRegionSection } from "./LanguageRegionSection";
import { DateTimeSection } from "./DateTimeSection";
import { SupportPermissionsSection } from "./SupportPermissionsSection";
import { DangerZoneSection } from "./DangerZoneSection";

interface SettingsClientProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

type SettingsSection = "profile" | "auth" | "appearance" | "language" | "datetime" | "support" | "danger";

const MENU_ITEMS: { id: SettingsSection; label: string }[] = [
  { id: "profile", label: "Perfil" },
  { id: "auth", label: "Autenticação" },
  { id: "appearance", label: "Aparência" },
  { id: "language", label: "Idioma e Região" },
  { id: "datetime", label: "Formato de Data/Hora" },
  { id: "support", label: "Permissões de Suporte" },
  { id: "danger", label: "Zona de Perigo" },
];

/**
 * Componente Client para a página de Configurações
 * Gerencia o estado da seção ativa e renderiza o layout de duas colunas
 */
export function SettingsClient({ user }: SettingsClientProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSection />;
      case "auth":
        return <AuthenticationSection />;
      case "appearance":
        return <AppearanceSection />;
      case "language":
        return <LanguageRegionSection />;
      case "datetime":
        return <DateTimeSection />;
      case "support":
        return <SupportPermissionsSection />;
      case "danger":
        return <DangerZoneSection />;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold">Minhas configurações</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e preferências
        </p>
      </div>

      {/* Layout de Duas Colunas */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sidebar - Menu de Navegação */}
        <aside className="lg:col-span-1">
          <nav className="sticky top-20 space-y-1">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full text-left rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Conteúdo Principal */}
        <div className="lg:col-span-3">
          <div className="rounded-lg border border-border bg-card p-6">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
}
