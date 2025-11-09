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
    <section className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-6 text-white">
      <header className="space-y-2">
        <span className="text-xs uppercase tracking-[0.3em] text-white/40">
          {workspaceSlug}
        </span>
        <h1 className="text-3xl font-semibold">{moduleName}</h1>
      </header>
      <p className="text-sm text-white/60">{description}</p>
      <div className="rounded-md border border-white/10 bg-black/50 p-4 text-sm text-white/50">
        <p>
          Este é um placeholder para o módulo <strong>{moduleName}</strong>.
          Substitua por UI, server actions e componentes específicos quando a
          definição funcional estiver pronta.
        </p>
      </div>
    </section>
  );
}
