import { ModulePlaceholder } from "@/components/module-placeholder";

export default async function WorkspaceReviewsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  return (
    <ModulePlaceholder
      workspaceSlug={workspaceSlug}
      moduleName="Reviews"
      description="Colete e gerencie avaliações de clientes e testemunhos."
    />
  );
}
