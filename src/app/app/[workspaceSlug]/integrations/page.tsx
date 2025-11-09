import { ModulePlaceholder } from "@/components/module-placeholder";

export default function WorkspaceIntegrationsPage({
  params,
}: {
  params: { workspaceSlug: string };
}) {
  return (
    <ModulePlaceholder
      workspaceSlug={params.workspaceSlug}
      moduleName="Integrações"
      description="Configure conectores com ferramentas externas para sincronizar dados em tempo real."
    />
  );
}
