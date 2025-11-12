import { ModulePlaceholder } from "@/components/module-placeholder";

export default async function WorkspaceAutomationsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  return (
    <ModulePlaceholder
      workspaceSlug={workspaceSlug}
      moduleName="Automations"
      description="Configure fluxos de automação e regras de negócio."
    />
  );
}
