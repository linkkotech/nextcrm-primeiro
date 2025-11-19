import { ModulePlaceholder } from "@/components/module-placeholder";

export default async function WorkspacePortfolioPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  return (
    <ModulePlaceholder
      workspaceSlug={workspaceSlug}
      moduleName="Portfolio"
      description="Exiba seus trabalhos, casos de sucesso e projetos em destaque."
    />
  );
}
