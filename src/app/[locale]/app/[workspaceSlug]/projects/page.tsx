import { ModulePlaceholder } from "@/components/module-placeholder";

export default async function WorkspaceProjectsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  return (
    <ModulePlaceholder
      workspaceSlug={workspaceSlug}
      moduleName="Projects"
      description="Gerencie projetos complexos com marcos, entregáveis e colaboração."
    />
  );
}
