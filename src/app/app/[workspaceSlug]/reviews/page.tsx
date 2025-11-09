import { ModulePlaceholder } from "@/components/module-placeholder";

export default function WorkspaceReviewsPage({
  params,
}: {
  params: { workspaceSlug: string };
}) {
  return (
    <ModulePlaceholder
      workspaceSlug={params.workspaceSlug}
      moduleName="Reviews"
      description="Colete feedbacks e depoimentos dos clientes para alimentar campanhas e insights."
    />
  );
}
