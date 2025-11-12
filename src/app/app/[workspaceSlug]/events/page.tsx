import { ModulePlaceholder } from "@/components/module-placeholder";

export default async function WorkspaceEventsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  return (
    <ModulePlaceholder
      workspaceSlug={workspaceSlug}
      moduleName="Eventos"
      description="Planeje e gerencie eventos presenciais ou online vinculados ao workspace."
    />
  );
}
