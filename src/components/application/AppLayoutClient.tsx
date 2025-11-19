"use client";

import { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { AdminHeaderBar } from "@/components/admin/AdminHeaderBar";
import { SecondaryHeader } from "@/components/layout/SecondaryHeader";
import { AiAssistantSidebar } from "@/components/layout/AiAssistantSidebar";
import { CommandPaletteProvider } from "@/context/CommandPaletteContext";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";

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
 * Características:
 * - SidebarProvider para responsividade mobile
 * - AppSidebar com navegação específica
 * - Headers reutilizados (Admin)
 * - CommandPaletteProvider ativo
 * - AI Assistant Sheet
 */
export function AppLayoutClient({
  children,
  workspaceSlug,
  userName,
  userEmail,
  userImage,
}: AppLayoutClientProps) {
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);

  return (
    <CommandPaletteProvider>
      <SidebarProvider className="h-screen min-h-0">
        <AppSidebar
          workspaceSlug={workspaceSlug}
          userName={userName}
          userEmail={userEmail}
          userImage={userImage}
        />
        <SidebarInset className="overflow-y-hidden">
          <AdminHeaderBar onToggleAiSidebar={() => setIsAiSidebarOpen(true)} />
          <SecondaryHeader />
          <div className="flex flex-1 flex-col overflow-y-auto p-6 min-h-0">
            {children}
          </div>
        </SidebarInset>

        {/* AI Assistant Sheet */}
        <Sheet open={isAiSidebarOpen} onOpenChange={setIsAiSidebarOpen}>
          <SheetContent>
            <AiAssistantSidebar />
          </SheetContent>
        </Sheet>
      </SidebarProvider>
    </CommandPaletteProvider>
  );
}
