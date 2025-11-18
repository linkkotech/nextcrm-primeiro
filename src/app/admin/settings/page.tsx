import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import { SettingsClient } from "@/components/admin/settings/SettingsClient";

export const metadata: Metadata = {
  title: "Minhas Configurações | NextCRM",
  description: "Gerencie suas configurações de perfil, segurança e preferências",
};

export const dynamic = "force-dynamic";

/**
 * Página de Configurações da Conta (Admin)
 * Permite que usuários gerenciem seu perfil, segurança e preferências
 *
 * Fluxo:
 * 1. Validar que usuário está autenticado (middleware já protege /admin/*)
 * 2. Renderizar componente client-side com todas as seções
 */
export default async function SettingsPage() {
  // Validar autenticação
  let user = null;
  try {
    user = await getUser();
  } catch (error) {
    console.error("Error fetching user in settings page:", error);
    redirect("/sign-in");
  }

  if (!user) {
    redirect("/sign-in");
  }

  return <SettingsClient user={user} />;
}


