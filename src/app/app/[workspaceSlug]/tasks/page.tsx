import { ModulePlaceholder } from "@/components/module-placeholder";

export default function WorkspaceTasksPage({
  params,
}: {
  params: { workspaceSlug: string };
}) {
  return (
    <ModulePlaceholder
      workspaceSlug={params.workspaceSlug}
      moduleName="Tasks"
      description="Planeje, atribua e monitore tarefas relacionadas a cada cliente com automações."
    />
  );
}
