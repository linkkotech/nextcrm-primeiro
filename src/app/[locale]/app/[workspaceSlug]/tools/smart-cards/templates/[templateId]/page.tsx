import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/session";

interface EditTemplatePageProps {
  params: {
    locale: string;
    workspaceSlug: string;
    templateId: string;
  };
}

export default async function EditTemplatePage({ params }: EditTemplatePageProps) {
  const { workspaceSlug, templateId } = params;

  // 1. Autenticação
  const { user } = await getAuthSession();

  if (!user) {
    notFound();
  }

  // 2. Buscar workspace
  const workspace = await prisma.workspace.findUnique({
    where: { slug: workspaceSlug },
    select: { id: true, name: true },
  });

  if (!workspace) {
    notFound();
  }

  // 3. Buscar template
  const template = await prisma.digitalTemplate.findUnique({
    where: { id: templateId },
    select: { 
      id: true, 
      name: true,
      workspaceId: true,
    },
  });

  if (!template) {
    notFound();
  }

  // 4. Verificar permissões (apenas templates do workspace podem ser editados)
  const isPlatformAdmin = 
    user.adminRole?.name === "super_admin" || 
    user.adminRole?.name === "admin";

  if (!isPlatformAdmin && template.workspaceId !== workspace.id) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Editor de Template</h1>
          <p className="text-muted-foreground">
            Template ID: <span className="font-mono">{templateId}</span>
          </p>
          <p className="text-muted-foreground">
            Nome: <span className="font-semibold">{template.name}</span>
          </p>
        </header>

        <div className="border rounded-lg p-12 text-center space-y-4 bg-muted/30">
          <div className="text-6xl">🚧</div>
          <h2 className="text-xl font-semibold">Funcionalidade em Desenvolvimento</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            O editor de templates será construído do zero seguindo a nova arquitetura limpa. 
            Esta é apenas a estrutura de roteamento preparada para a implementação futura.
          </p>
        </div>

        <div className="text-center">
          <a 
            href={`/${params.locale}/app/${workspaceSlug}/tools/smart-cards/templates`}
            className="text-sm text-primary hover:underline"
          >
            ← Voltar para Templates
          </a>
        </div>
      </div>
    </div>
  );
}
