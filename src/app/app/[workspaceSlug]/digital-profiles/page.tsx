import { ModulePlaceholder } from "@/components/module-placeholder";

export default function WorkspaceDigitalProfilesPage({
  params,
}: {
  params: { workspaceSlug: string };
}) {
  return (
    <ModulePlaceholder
      workspaceSlug={params.workspaceSlug}
      moduleName="Perfis Digitais"
      description="Mantenha perfis sociais, reputação e presença digital dos seus clientes monitorados."
    />
  );
}
