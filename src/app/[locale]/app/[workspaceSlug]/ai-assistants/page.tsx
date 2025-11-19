import { ModulePlaceholder } from "@/components/module-placeholder";

export default async function WorkspaceAiAssistantsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  return (
    <ModulePlaceholder
      workspaceSlug={workspaceSlug}
      moduleName="Assistentes IA"
      description="Crie e treine assistentes de IA alinhados aos dados do workspace para automação contextual."
    />
  );
}
