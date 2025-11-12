import Link from "next/link";
import { ReactNode } from "react";

const modules = [
  { href: "dashboard", label: "Dashboard" },
  { href: "crm", label: "CRM" },
  { href: "chat", label: "Chat" },
  { href: "tasks", label: "Tasks" },
  { href: "calendar", label: "Calendar" },
  { href: "projects", label: "Projects" },
  { href: "digital-profiles", label: "Perfis Digitais" },
  { href: "campaigns", label: "Campanhas" },
  { href: "ai-assistants", label: "Assistentes IA" },
  { href: "reports", label: "Relatórios" },
  { href: "portfolio", label: "Portfolio" },
  { href: "events", label: "Eventos" },
  { href: "automations", label: "Automations" },
  { href: "reviews", label: "Reviews" },
  { href: "planning", label: "Planning" },
  { href: "integrations", label: "Integrações" },
];

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <aside className="hidden w-72 flex-col border-r border-white/10 bg-black/40 p-6 backdrop-blur lg:flex">
        <span className="text-xs uppercase tracking-[0.4em] text-white/40">
          Workspace
        </span>
        <h2 className="mt-2 text-xl font-semibold">
          {workspaceSlug.replaceAll("-", " ")}
        </h2>
        <nav className="mt-8 flex flex-1 flex-col gap-2 text-sm text-white/60">
          {modules.map((module) => (
            <Link
              key={module.href}
              href={`/app/${workspaceSlug}/${module.href}`}
              className="rounded-md px-3 py-2 transition hover:bg-white/10 hover:text-white"
            >
              {module.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="border-b border-white/10 bg-black/40 px-6 py-4 backdrop-blur">
          <div className="flex items-center justify-between text-sm">
            <span className="uppercase tracking-[0.3em] text-white/40">
              Área do Cliente
            </span>
            <Link
              href="/admin/dashboard"
              className="rounded-full border border-white/20 px-4 py-1 text-xs uppercase tracking-[0.25em] text-white/80 transition hover:border-white/40 hover:text-white"
            >
              Ir para Admin
            </Link>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-6 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
