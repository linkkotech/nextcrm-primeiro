import { redirect } from "next/navigation";

/**
 * Página raiz do workspace
 * Redireciona automaticamente para o dashboard
 */
export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  redirect(`/app/${workspaceSlug}/dashboard`);
}
