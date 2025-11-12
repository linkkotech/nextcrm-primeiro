import { ModulePlaceholder } from "@/components/module-placeholder";

export default async function WorkspaceIntegrationsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  return (
    <ModulePlaceholder
      workspaceSlug={workspaceSlug}
      moduleName="Integrações"
      description="Conecte seu workspace a serviços externos como CRMs, automação de e-mail, e gateways de pagamento."
    />
  );
}
