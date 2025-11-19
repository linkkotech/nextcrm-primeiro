import { ModulePlaceholder } from "@/components/module-placeholder";

export default async function WorkspaceCrmPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  return (
    <ModulePlaceholder
      workspaceSlug={workspaceSlug}
      moduleName="CRM"
      description="Gerencie contatos, leads, oportunidades e pipeline de vendas."
    />
  );
}
