export const dynamic = "force-dynamic";

export default function AdminProjectsSharedWithMePage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Shared with me</h1>
        <p className="text-sm text-muted-foreground">
          Projetos compartilhados comigo
        </p>
      </header>

      <div className="rounded-lg border bg-card p-6">
        <p className="text-muted-foreground">Lista de projetos compartilhados em breve...</p>
      </div>
    </section>
  );
}

