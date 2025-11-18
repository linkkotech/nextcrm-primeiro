'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateClientDialog } from './CreateClientDialog';

interface Plan {
  id: string;
  name: string;
  price: number;
  billingCycle?: string;
}

interface ClientsHeaderProps {
  availablePlans: Plan[];
}

/**
 * Header da página de clientes com botão para criar novo cliente.
 * Gerencia o estado do dialog de criação e passa os planos disponíveis.
 */
export function ClientsHeader({ availablePlans }: ClientsHeaderProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie todos os clientes (usuários) da plataforma
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <CreateClientDialog open={dialogOpen} onOpenChange={setDialogOpen} availablePlans={availablePlans} />
    </>
  );
}
