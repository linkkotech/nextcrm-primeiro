import { ModulePlaceholder } from "@/components/module-placeholder";

export default function WorkspacePortfolioPage({
  params,
}: {
  params: { workspaceSlug: string };
}) {
  return (
    <ModulePlaceholder
      workspaceSlug={params.workspaceSlug}
      moduleName="Portfolio"
      description="Gerencie ativos, cases e materiais compartilháveis com prospects e clientes."
    />
  );
}
