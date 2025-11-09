"use client";

import { useState, useEffect } from "react";
import { SidebarNavigation } from "./SidebarNavigation";
import { AdminHeader } from "./AdminHeader";
import { cn } from "@/lib/utils";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fechar sidebar em mobile quando clicar fora
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform border-r border-border bg-background transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarNavigation
          userName={userName}
          userEmail={userEmail}
          userImage={userImage}
        />
      </aside>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}


