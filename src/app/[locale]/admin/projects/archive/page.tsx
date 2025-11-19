export const dynamic = "force-dynamic";

export default function AdminProjectsArchivePage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Archive</h1>
        <p className="text-sm text-muted-foreground">
          Projetos arquivados
        </p>
      </header>

      <div className="rounded-lg border bg-card p-6">
        <p className="text-muted-foreground">Lista de projetos arquivados em breve...</p>
      </div>
    </section>
  );
}

