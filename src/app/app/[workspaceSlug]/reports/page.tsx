import { ModulePlaceholder } from "@/components/module-placeholder";

export default function WorkspaceReportsPage({
  params,
}: {
  params: { workspaceSlug: string };
}) {
  return (
    <ModulePlaceholder
      workspaceSlug={params.workspaceSlug}
      moduleName="Relatórios"
      description="Monte dashboards e relatórios customizados alimentados pelos dados do workspace."
    />
  );
}
