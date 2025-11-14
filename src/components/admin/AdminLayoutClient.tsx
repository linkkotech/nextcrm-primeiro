"use client";

import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeaderBar } from "./AdminHeaderBar";
import { AiAssistantSidebar } from "@/components/layout/AiAssistantSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
}

export function AdminLayoutClient({
  children,
  userName,
  userEmail,
  userImage,
}: AdminLayoutClientProps) {
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);

  return (
    <SidebarProvider className="h-screen min-h-0">
      <AdminSidebar
        userName={userName}
        userEmail={userEmail}
        userImage={userImage}
      />
      <SidebarInset className="overflow-hidden">
        <AdminHeaderBar onToggleAiSidebar={() => setIsAiSidebarOpen(true)} />
        <div className="flex flex-1 flex-col overflow-hidden p-6 min-h-0">
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
  );
}


