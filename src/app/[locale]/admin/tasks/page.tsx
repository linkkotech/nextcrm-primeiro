export const dynamic = "force-dynamic";

export default function AdminTasksPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Tasks</h1>
        <p className="text-sm text-muted-foreground">
          Gerenciar tarefas do sistema
        </p>
      </header>

      <div className="rounded-lg border bg-card p-6">
        <p className="text-muted-foreground">Lista de tarefas em breve...</p>
      </div>
    </section>
  );
}


