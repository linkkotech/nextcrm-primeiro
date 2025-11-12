import { ModulePlaceholder } from "@/components/module-placeholder";

export default async function WorkspaceReportsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  return (
    <ModulePlaceholder
      workspaceSlug={workspaceSlug}
      moduleName="Relatórios"
      description="Visualize métricas e dashboards analíticos do seu workspace."
    />
  );
}
