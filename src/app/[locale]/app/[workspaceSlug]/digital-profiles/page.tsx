import { ModulePlaceholder } from "@/components/module-placeholder";

export default async function WorkspaceDigitalProfilesPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  return (
    <ModulePlaceholder
      workspaceSlug={workspaceSlug}
      moduleName="Perfis Digitais"
      description="Gerencie cartões de visita digitais personalizados para sua equipe."
    />
  );
}
