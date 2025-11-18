import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Minhas Configurações | NextCRM",
  description: "Gerencie suas configurações pessoais e preferências",
};

export const dynamic = "force-dynamic";

/**
 * Layout para a página de Configurações do Usuário
 * 
 * Responsabilidades:
 * - Validar autenticação do usuário
 * - Centralizar e adicionar padding ao conteúdo
 * - Limitar largura máxima em telas grandes
 */
export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Validar autenticação
  let user = null;
  try {
    user = await getUser();
  } catch (error) {
    console.error("Error fetching user in settings layout:", error);
    redirect("/sign-in");
  }

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      {children}
    </div>
  );
}
