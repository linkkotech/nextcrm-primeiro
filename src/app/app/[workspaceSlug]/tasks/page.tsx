import { ModulePlaceholder } from "@/components/module-placeholder";

export default async function WorkspaceTasksPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  return (
    <ModulePlaceholder
      workspaceSlug={workspaceSlug}
      moduleName="Tasks"
      description="Organize tarefas, defina responsáveis e acompanhe prazos."
    />
  );
}
