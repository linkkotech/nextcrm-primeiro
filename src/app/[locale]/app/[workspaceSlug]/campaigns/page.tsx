import { ModulePlaceholder } from "@/components/module-placeholder";

export default async function WorkspaceCampaignsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  return (
    <ModulePlaceholder
      workspaceSlug={workspaceSlug}
      moduleName="Campanhas"
      description="Crie e monitore campanhas de marketing, e-mail e redes sociais."
    />
  );
}
