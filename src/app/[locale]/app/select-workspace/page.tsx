import { getUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Plus,
  ArrowLeft,
} from "lucide-react";

/**
 * Página de Seleção de Workspace
 * Destino padrão para usuários clientes após login/signup.
 *
 * Funcionalidade Atual:
 * - Exibe mensagem de boas-vindas
 * - Placeholder para seleção de workspace (implementação futura)
 * - Link para voltar ao admin como fallback
 *
 * Implementação Futura:
 * - Buscar lista de workspaces do usuário (WorkspaceMember)
 * - Exibir cards clicáveis para cada workspace
 * - Permitir criação de novo workspace
 * - Redirecionar para /app/[workspaceSlug]/dashboard ao selecionar
 */
export default async function SelectWorkspacePage() {
  // Validar que usuário está autenticado
  let user = null;
  try {
    user = await getUser();
  } catch (error) {
    console.error("Error fetching user in select-workspace:", error);
    redirect("/sign-in");
  }

  if (!user) {
    redirect("/sign-in");
  }

  // Buscar workspaces do usuário
  const workspaces = await prisma.workspaceMember.findMany({
    where: { userId: user.id },
    include: {
      workspace: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      {/* Container Principal */}
      <div className="w-full max-w-2xl space-y-8">
        {/* Cabeçalho */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="flex aspect-square size-16 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayoutDashboard className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Bem-vindo, {user.name || "Usuário"}!
          </h1>
          <p className="text-muted-foreground">
            Selecione um workspace para continuar ou crie um novo
          </p>
        </div>

        {/* Card de Seleção de Workspace */}
        <div className="space-y-4">
          {workspaces.length > 0 ? (
            <>
              <p className="text-sm font-medium text-foreground">
                Seus Workspaces ({workspaces.length})
              </p>
              <div className="grid gap-4">
                {workspaces.map((membership) => (
                  <Link
                    key={membership.workspace.id}
                    href={`/app/${membership.workspace.slug}/dashboard`}
                  >
                    <Card className="cursor-pointer transition hover:border-primary hover:shadow-lg">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">
                          {membership.workspace.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Clique para acessar este workspace
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Nenhum Workspace Encontrado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Você ainda não é membro de nenhum workspace. Em breve você poderá criar um novo.
                </p>
                <div className="flex items-center gap-2 rounded-lg bg-muted p-4">
                  <Plus className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Funcionalidade de criar workspace em desenvolvimento
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Ações Secundárias */}
        <div className="flex flex-col gap-3 pt-4">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/sign-in" className="flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Fazer Login Novamente
            </Link>
          </Button>
        </div>

        {/* Footer Informativo */}
        <div className="rounded-lg bg-muted p-4 text-center">
          <p className="text-xs text-muted-foreground">
            Precisa de ajuda? Entre em contato com o suporte
          </p>
        </div>
      </div>
    </div>
  );
}
