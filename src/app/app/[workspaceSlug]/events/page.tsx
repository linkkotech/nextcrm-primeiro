import { ModulePlaceholder } from "@/components/module-placeholder";

export default function WorkspaceEventsPage({
  params,
}: {
  params: { workspaceSlug: string };
}) {
  return (
    <ModulePlaceholder
      workspaceSlug={params.workspaceSlug}
      moduleName="Eventos"
      description="Coordene eventos presenciais e digitais, convites, check-ins e follow-ups automáticos."
    />
  );
}
