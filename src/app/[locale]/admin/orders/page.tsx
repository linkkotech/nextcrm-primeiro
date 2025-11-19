export const dynamic = "force-dynamic";

export default function AdminOrdersPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Gerenciar pedidos do sistema
        </p>
      </header>

      <div className="rounded-lg border bg-card p-6">
        <p className="text-muted-foreground">Lista de pedidos em breve...</p>
      </div>
    </section>
  );
}

