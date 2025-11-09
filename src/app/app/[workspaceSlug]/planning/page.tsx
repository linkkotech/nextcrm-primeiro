import { ModulePlaceholder } from "@/components/module-placeholder";

export default function WorkspacePlanningPage({
  params,
}: {
  params: { workspaceSlug: string };
}) {
  return (
    <ModulePlaceholder
      workspaceSlug={params.workspaceSlug}
      moduleName="Planning"
      description="Planeje OKRs, metas e roteiros estratégicos conectados às iniciativas do workspace."
    />
  );
}
