import { ModulePlaceholder } from "@/components/module-placeholder";

export default function WorkspaceProjectsPage({
  params,
}: {
  params: { workspaceSlug: string };
}) {
  return (
    <ModulePlaceholder
      workspaceSlug={params.workspaceSlug}
      moduleName="Projects"
      description="Organize squads, fases e entregáveis vinculados aos clientes e campanhas."
    />
  );
}
