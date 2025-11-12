export default async function WorkspaceDashboardPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold text-white">
          Dashboard · {workspaceSlug}
        </h1>
        <p className="text-sm text-white/60">
          Acompanhe indicadores gerais do workspace e principais atividades.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-lg border border-white/10 bg-white/5 p-5">
          <span className="text-xs uppercase tracking-wide text-white/50">
            Novos Leads
          </span>
          <p className="mt-2 text-3xl font-bold text-white">0</p>
        </article>
        <article className="rounded-lg border border-white/10 bg-white/5 p-5">
          <span className="text-xs uppercase tracking-wide text-white/50">
            Tarefas Abertas
          </span>
          <p className="mt-2 text-3xl font-bold text-white">0</p>
        </article>
        <article className="rounded-lg border border-white/10 bg-white/5 p-5">
          <span className="text-xs uppercase tracking-wide text-white/50">
            Conversões
          </span>
          <p className="mt-2 text-3xl font-bold text-emerald-400">0%</p>
        </article>
      </div>
    </section>
  );
}
