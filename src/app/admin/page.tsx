export const dynamic = "force-dynamic";

export default function AdminHomePage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Home</h1>
        <p className="text-sm text-muted-foreground">
          Visão geral do sistema administrativo
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
            Usuários Totais
          </span>
          <p className="mt-2 text-3xl font-bold">0</p>
        </article>
        <article className="rounded-lg border bg-card p-5">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            Status do Sistema
          </span>
          <p className="mt-2 text-3xl font-bold text-green-600">Online</p>
        </article>
      </div>
    </section>
  );
}


