export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
        <p className="text-sm text-white/60">
          Visão geral da plataforma, métricas de uso e operações críticas.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border border-white/10 bg-white/5 p-5">
          <span className="text-xs uppercase tracking-wide text-white/50">
            Workspaces Ativos
          </span>
          <p className="mt-2 text-3xl font-bold text-white">0</p>
        </article>
        <article className="rounded-lg border border-white/10 bg-white/5 p-5">
          <span className="text-xs uppercase tracking-wide text-white/50">
            Usuários no Último Dia
          </span>
          <p className="mt-2 text-3xl font-bold text-white">0</p>
        </article>
        <article className="rounded-lg border border-white/10 bg-white/5 p-5">
          <span className="text-xs uppercase tracking-wide text-white/50">
            Erros Críticos
          </span>
          <p className="mt-2 text-3xl font-bold text-emerald-400">0</p>
        </article>
      </div>
    </section>
  );
}
