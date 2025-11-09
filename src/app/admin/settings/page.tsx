export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configurações do sistema
        </p>
      </header>

      <div className="rounded-lg border bg-card p-6">
        <p className="text-muted-foreground">Configurações em breve...</p>
      </div>
    </section>
  );
}


