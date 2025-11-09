import { ModulePlaceholder } from "@/components/module-placeholder";

export default function WorkspaceCrmPage({
  params,
}: {
  params: { workspaceSlug: string };
}) {
  return (
    <ModulePlaceholder
      workspaceSlug={params.workspaceSlug}
      moduleName="CRM"
      description="Gerencie contatos, contas, pipelines de vendas e histórico de interações em um só lugar."
    />
  );
}
