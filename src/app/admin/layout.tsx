import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NextCRM | Admin",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-zinc-100">
      <header className="border-b border-white/10 bg-black/40 px-8 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span className="text-lg font-semibold uppercase tracking-[0.3em] text-white/70">
            NextCRM Admin
          </span>
          <nav className="flex items-center gap-4 text-sm text-white/50">
            <span>Visão Geral</span>
            <span>Workspaces</span>
            <span>Configurações</span>
          </nav>
        </div>
      </header>
      <main className="mx-auto flex max-w-5xl flex-1 flex-col gap-6 px-8 py-10">
        {children}
      </main>
    </div>
  );
}
