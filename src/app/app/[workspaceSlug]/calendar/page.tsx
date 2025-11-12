import { ModulePlaceholder } from "@/components/module-placeholder";

export default async function WorkspaceCalendarPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  return (
    <ModulePlaceholder
      workspaceSlug={workspaceSlug}
      moduleName="Calendar"
      description="Visualize e agende eventos, reuniões e prazos no calendário."
    />
  );
}
