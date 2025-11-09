import { ModulePlaceholder } from "@/components/module-placeholder";

export default function WorkspaceCalendarPage({
  params,
}: {
  params: { workspaceSlug: string };
}) {
  return (
    <ModulePlaceholder
      workspaceSlug={params.workspaceSlug}
      moduleName="Calendar"
      description="Sincronize reuniões, lembretes e atividades recorrentes com integrações externas."
    />
  );
}
