import { ModulePlaceholder } from "@/components/module-placeholder";

export default async function WorkspacePlanningPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  return (
    <ModulePlaceholder
      workspaceSlug={workspaceSlug}
      moduleName="Planning"
      description="Planeje sprints, recursos e roadmaps de produto."
    />
  );
}
