type ModulePlaceholderProps = {
  workspaceSlug: string;
  moduleName: string;
  description: string;
};

export function ModulePlaceholder({
  workspaceSlug,
  moduleName,
  description,
}: ModulePlaceholderProps) {
  return (
    <section className="space-y-4 rounded-lg border border-border bg-card p-6 text-foreground">
      <header className="space-y-2">
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {workspaceSlug}
        </span>
        <h1 className="text-3xl font-semibold">{moduleName}</h1>
      </header>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="rounded-md border border-border bg-muted p-4 text-sm text-muted-foreground">
        <p>
          Este é um placeholder para o módulo <strong>{moduleName}</strong>.
          Substitua por UI, server actions e componentes específicos quando a
          definição funcional estiver pronta.
        </p>
      </div>
    </section>
  );
}
