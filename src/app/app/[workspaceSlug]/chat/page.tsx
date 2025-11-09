import { ModulePlaceholder } from "@/components/module-placeholder";

export default function WorkspaceChatPage({
  params,
}: {
  params: { workspaceSlug: string };
}) {
  return (
    <ModulePlaceholder
      workspaceSlug={params.workspaceSlug}
      moduleName="Chat"
      description="Centralize conversas com clientes, bots e time interno em threads acionáveis."
    />
  );
}
