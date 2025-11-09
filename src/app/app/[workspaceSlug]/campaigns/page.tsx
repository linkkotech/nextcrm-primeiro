import { ModulePlaceholder } from "@/components/module-placeholder";

export default function WorkspaceCampaignsPage({
  params,
}: {
  params: { workspaceSlug: string };
}) {
  return (
    <ModulePlaceholder
      workspaceSlug={params.workspaceSlug}
      moduleName="Campanhas"
      description="Planeje e acompanhe campanhas multicanal conectadas a leads e métricas de conversão."
    />
  );
}
