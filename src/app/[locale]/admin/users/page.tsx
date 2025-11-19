export const dynamic = "force-dynamic";

export default function AdminUsersPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Users</h1>
        <p className="text-sm text-muted-foreground">
          Gerenciar usuários do sistema
        </p>
      </header>

      <div className="rounded-lg border bg-card p-6">
        <p className="text-muted-foreground">Lista de usuários em breve...</p>
      </div>
    </section>
  );
}


