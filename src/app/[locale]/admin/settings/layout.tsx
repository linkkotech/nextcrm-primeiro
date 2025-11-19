"use client";

import { usePathname } from "next/navigation";
import { SettingsSidebar } from "@/components/admin/settings/SettingsSidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-[280px_1fr] gap-6 p-6">
      {/* Sidebar de Configurações */}
      <aside className="space-y-1">
        <h3 className="mb-4 px-3 text-sm font-semibold text-muted-foreground">
          Configurações
        </h3>
        <SettingsSidebar pathname={pathname} />
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
