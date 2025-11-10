export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Visão geral da plataforma, métricas de uso e operações críticas.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border bg-card p-5">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            Workspaces Ativos
          </span>
          <p className="mt-2 text-3xl font-bold">0</p>
        </article>
        <article className="rounded-lg border bg-card p-5">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            Usuários no Último Dia
          </span>
          <p className="mt-2 text-3xl font-bold">0</p>
        </article>
        <article className="rounded-lg border bg-card p-5">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            Erros Críticos
          </span>
          <p className="mt-2 text-3xl font-bold text-green-600 dark-mode:text-green-400">0</p>
        </article>
      </div>
    </section>
  );
}
