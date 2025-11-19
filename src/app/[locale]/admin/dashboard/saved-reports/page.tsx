export const dynamic = "force-dynamic";

export default function AdminDashboardSavedReportsPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Saved Reports</h1>
        <p className="text-sm text-muted-foreground">
          Relatórios salvos do sistema
        </p>
      </header>

      <div className="rounded-lg border bg-card p-6">
        <p className="text-muted-foreground">Lista de relatórios salvos em breve...</p>
      </div>
    </section>
  );
}

