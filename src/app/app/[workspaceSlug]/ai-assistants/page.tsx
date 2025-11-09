import { ModulePlaceholder } from "@/components/module-placeholder";

export default function WorkspaceAiAssistantsPage({
  params,
}: {
  params: { workspaceSlug: string };
}) {
  return (
    <ModulePlaceholder
      workspaceSlug={params.workspaceSlug}
      moduleName="Assistentes IA"
      description="Crie e treine assistentes de IA alinhados aos dados do workspace para automação contextual."
    />
  );
}
