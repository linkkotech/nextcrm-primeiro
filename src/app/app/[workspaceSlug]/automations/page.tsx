import { ModulePlaceholder } from "@/components/module-placeholder";

export default function WorkspaceAutomationsPage({
  params,
}: {
  params: { workspaceSlug: string };
}) {
  return (
    <ModulePlaceholder
      workspaceSlug={params.workspaceSlug}
      moduleName="Automations"
      description="Construa fluxos automatizados baseados em gatilhos e dados do CRM para escalar operações."
    />
  );
}
