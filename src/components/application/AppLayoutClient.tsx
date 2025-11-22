"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { AppSidebar } from "./AppSidebar";
import { IconSidebar } from "./layout/IconSidebar";
import { AdminHeaderBar } from "@/components/admin/AdminHeaderBar";
import { SecondaryHeader } from "@/components/layout/SecondaryHeader";
import { AiAssistantSidebar } from "@/components/layout/AiAssistantSidebar";
import { CommandPaletteProvider } from "@/context/CommandPaletteContext";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { getActiveModuleFromPath } from "@/lib/navigation-utils";

interface AppLayoutClientProps {
  children: React.ReactNode;
  workspaceSlug: string;
  workspaceName?: string;
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
}

/**
 * Layout Client da Área de Cliente (Multi-tenant)
 * Gerencia estado local e renderiza estrutura do workspace.
 *
 * Arquitetura:
 * - Layout flex de 3 colunas por composição
 * - IconSidebar (64px) no fluxo normal (não fixed)
 * - SidebarProvider com AppSidebar (navegação contextual)
 * - Main content com headers e children
 * 
 * Características:
 * - Módulo ativo derivado do pathname (Single Source of Truth)
 * - IconSidebar oculta em mobile (hidden md:flex)
 * - SidebarProvider intacto para responsividade
 * - CommandPaletteProvider ativo
 * - AI Assistant Sheet
 * - As duas sidebars funcionam lado a lado sem conflitos
 */
export function AppLayoutClient({
  children,
  workspaceSlug,
  userName,
  userEmail,
  userImage,
}: AppLayoutClientProps) {
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);

  // Derivar módulo ativo do pathname (Single Source of Truth)
  const pathname = usePathname();
  const locale = useLocale();
  const activeModule = getActiveModuleFromPath(pathname);

  return (
    <CommandPaletteProvider>
      {/* Layout flex de alto nível: IconSidebar + SidebarProvider como irmãos */}
      <div className="flex h-screen w-full bg-background overflow-hidden">

        {/* FILHO 1: IconSidebar independente (64px, no fluxo normal) */}
        <IconSidebar
          workspaceSlug={workspaceSlug}
          locale={locale}
          activeModule={activeModule}
        />

        {/* FILHO 2: Sistema shadcn/ui contido (SidebarProvider + AppSidebar + Main) */}
        <SidebarProvider>
          <AppSidebar
            workspaceSlug={workspaceSlug}
            userName={userName}
            userEmail={userEmail}
            userImage={userImage}
            activeModule={activeModule}
            hasIconSidebar={true}
          />
          <SidebarInset className="overflow-y-hidden">
            <AdminHeaderBar onToggleAiSidebar={() => setIsAiSidebarOpen(true)} />
            <SecondaryHeader />
            <div className="flex flex-1 flex-col overflow-y-auto p-8 min-h-0">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>

      {/* AI Assistant Sheet */}
      <Sheet open={isAiSidebarOpen} onOpenChange={setIsAiSidebarOpen}>
        <SheetContent>
          <AiAssistantSidebar />
        </SheetContent>
      </Sheet>
    </CommandPaletteProvider>
  );
}