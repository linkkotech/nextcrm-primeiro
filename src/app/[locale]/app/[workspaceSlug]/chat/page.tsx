import { ModulePlaceholder } from "@/components/module-placeholder";

export default async function WorkspaceChatPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  return (
    <ModulePlaceholder
      workspaceSlug={workspaceSlug}
      moduleName="Chat"
      description="Converse em tempo real com sua equipe e clientes."
    />
  );
}
