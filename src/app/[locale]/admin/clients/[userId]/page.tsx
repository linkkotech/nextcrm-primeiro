import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ClientDetailsPageProps {
  params: Promise<{
    locale: string;
    userId: string;
  }>;
}

export const metadata = {
  title: 'Detalhes do Cliente | Admin',
  description: 'Visualize os detalhes completos do cliente',
};

/**
 * Página de Detalhes do Cliente (Admin)
 * 
 * PLACEHOLDER: Esta página será implementada com dados reais do Prisma.
 * Por enquanto, apenas exibe o userId para confirmar que a navegação funcionou.
 * 
 * TODO:
 * - Buscar dados do cliente do Prisma
 * - Exibir informações completas (perfil, workspaces, assinaturas)
 * - Adicionar tabs para diferentes seções
 * - Implementar permissões de acesso
 */
export default async function ClientDetailsPage({ params }: ClientDetailsPageProps) {
  const { locale, userId } = await params;

  // TODO: Buscar cliente do banco de dados
  // const client = await prisma.user.findUnique({
  //   where: { id: userId },
  //   include: { workspaceMemberships: true }
  // });
  // 
  // if (!client) {
  //   notFound();
  // }

  return (
    <div className="space-y-6">
      {/* Header com botão Voltar */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/clients">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Detalhes do Cliente</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie as informações do cliente
          </p>
        </div>
      </div>

      {/* Card Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Página em Construção</CardTitle>
          <CardDescription>
            Esta página está sendo desenvolvida e em breve exibirá os detalhes completos do cliente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Locale:</strong> {locale}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              <strong>User ID:</strong> {userId}
            </p>
            <p className="text-xs text-muted-foreground">
              A navegação está funcionando corretamente. Os dados do cliente serão carregados em breve.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/admin/clients/${userId}/edit`}>
                Editar Cliente
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/clients">
                Voltar para Lista
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
