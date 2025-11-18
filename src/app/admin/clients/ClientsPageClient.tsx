'use client';

import { useEffect, useState } from 'react';
import { useHeader } from '@/context/HeaderContext';
import { ClientsDataTable } from '@/components/admin/clients/ClientsDataTable';
import { CreateClientDialog } from '@/components/admin/clients/CreateClientDialog';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface Client {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: Date;
  workspaceMemberships: Array<{
    workspace: {
      id: string;
      name: string;
      slug: string;
      subscription: {
        status: string;
        plan: {
          id: string;
          name: string;
          price: number;
        };
      };
    };
    workspaceRole: {
      id: string;
      name: string;
    };
  }>;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
}

interface ClientsPageClientProps {
  clients: Client[];
  availablePlans: Plan[];
  initialSearch?: string;
}

/**
 * Componente cliente para a página de Clientes.
 * Responsável por:
 * 1. Definir conteúdo dinâmico dos headers via contexto
 * 2. Gerenciar modal de criação de novo cliente
 * 3. Renderizar a tabela de clientes
 * 
 * Usa useEffect para setar o contexto ao montar e limpar ao desmontar.
 */
export function ClientsPageClient({ clients, availablePlans, initialSearch }: ClientsPageClientProps) {
  const { setPrimaryTitle, setSecondaryHeaderContent } = useHeader();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    // Setar título no Header Primário
    setPrimaryTitle('Clientes');

    // Setar conteúdo no Header Secundário
    setSecondaryHeaderContent(
      <div className="flex items-center justify-between flex-1">
        {/* Breadcrumb à esquerda */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Clientes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Botão "+ Novo Cliente" à direita */}
        <Button onClick={() => setDialogOpen(true)}>+ Novo Cliente</Button>
      </div>
    );

    // Cleanup: remover conteúdo ao sair da página
    return () => {
      setPrimaryTitle('');
      setSecondaryHeaderContent(null);
    };
  }, [setPrimaryTitle, setSecondaryHeaderContent]);

  return (
    <>
      <div className="space-y-6">
        <ClientsDataTable data={clients} initialSearch={initialSearch} />
      </div>

      {/* Modal de Criação de Cliente */}
      <CreateClientDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        availablePlans={availablePlans} 
      />
    </>
  );
}
