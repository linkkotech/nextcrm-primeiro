import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ClientEditPageProps {
  params: Promise<{
    locale: string;
    userId: string;
  }>;
}

export const metadata = {
  title: 'Editar Cliente | Admin',
  description: 'Edite as informações do cliente',
};

/**
 * Página de Edição do Cliente (Admin)
 * 
 * PLACEHOLDER: Esta página será implementada com formulário de edição completo.
 * Por enquanto, apenas exibe o userId para confirmar que a navegação funcionou.
 * 
 * TODO:
 * - Buscar dados do cliente do Prisma
 * - Implementar formulário com react-hook-form + Zod
 * - Criar server action para atualizar cliente
 * - Adicionar validações e feedback de erro
 * - Implementar permissões de acesso
 */
export default async function ClientEditPage({ params }: ClientEditPageProps) {
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
          <Link href={`/admin/clients/${userId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Cliente</h1>
          <p className="text-muted-foreground">
            Atualize as informações do cliente
          </p>
        </div>
      </div>

      {/* Card Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Formulário em Construção</CardTitle>
          <CardDescription>
            Esta página está sendo desenvolvida e em breve terá um formulário completo de edição.
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
              A navegação está funcionando corretamente. O formulário de edição será implementado em breve.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/admin/clients/${userId}`}>
                Cancelar e Voltar
              </Link>
            </Button>
            <Button disabled>
              Salvar Alterações (Em breve)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
