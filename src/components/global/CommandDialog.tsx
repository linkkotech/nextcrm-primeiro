"use client";

import { useRouter } from "next/navigation";
import {
  Command,
  CommandDialog as DialogCommand,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  LayoutDashboard,
  Users,
  Package,
  CreditCard,
  UsersRound,
  FileText,
  Mail,
  Building2,
  Settings,
  LogOut,
} from "lucide-react";

interface CommandDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

/**
 * Modal da Paleta de Comandos Global.
 * Permite que usuários naveguem e executem ações rapidamente usando busca.
 *
 * IMPORTANTE: Este componente é renderizado automaticamente pelo CommandPaletteProvider.
 * Não deve ser importado ou usado diretamente em outros componentes.
 *
 * Estrutura:
 * - Navegação: Links para páginas principais da aplicação
 * - Ações: Ações rápidas disponíveis
 * - Configurações: Links para settings e logout
 */
export function CommandDialog({ isOpen, setIsOpen }: CommandDialogProps) {
  const router = useRouter();

  // Função helper para navegar e fechar o dialog
  const navigate = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="overflow-hidden p-0 bg-white">
        <Command className="bg-white [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group]:overflow-hidden [&_[cmdk-group]]:p-1.5 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-1.5 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          <CommandInput placeholder="Pesquisar comandos..." />
          <CommandList>
            <CommandEmpty>Nenhum comando encontrado.</CommandEmpty>

            {/* GRUPO: Navegação */}
            <CommandGroup heading="Navegação">
              <CommandItem
                onSelect={() => navigate("/admin/dashboard")}
                value="dashboard"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </CommandItem>
              <CommandItem
                onSelect={() => navigate("/admin/clients")}
                value="clientes"
              >
                <Users className="mr-2 h-4 w-4" />
                <span>Clientes</span>
              </CommandItem>
              <CommandItem
                onSelect={() => navigate("/admin/plans")}
                value="planos"
              >
                <Package className="mr-2 h-4 w-4" />
                <span>Planos</span>
              </CommandItem>
              <CommandItem
                onSelect={() => navigate("/admin/products")}
                value="produtos"
              >
                <Package className="mr-2 h-4 w-4" />
                <span>Produtos</span>
              </CommandItem>
              <CommandItem
                onSelect={() => navigate("/admin/payments")}
                value="pagamentos"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Pagamentos</span>
              </CommandItem>
              <CommandItem
                onSelect={() => navigate("/admin/team")}
                value="equipe"
              >
                <UsersRound className="mr-2 h-4 w-4" />
                <span>Equipe</span>
              </CommandItem>
              <CommandItem
                onSelect={() => navigate("/admin/digital-templates")}
                value="templates-digitais"
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>Templates Digitais</span>
              </CommandItem>
              <CommandItem
                onSelect={() => navigate("/admin/workspace-users")}
                value="usuarios-workspace"
              >
                <Building2 className="mr-2 h-4 w-4" />
                <span>Usuários Workspace</span>
              </CommandItem>
            </CommandGroup>

            {/* GRUPO: Ações Rápidas */}
            <CommandGroup heading="Ações Rápidas">
              <CommandItem
                onSelect={() => navigate("/admin/clients?action=new")}
                value="novo-cliente"
              >
                <Users className="mr-2 h-4 w-4" />
                <span>Novo Cliente</span>
              </CommandItem>
              <CommandItem
                onSelect={() => navigate("/admin/plans?action=new")}
                value="novo-plano"
              >
                <Package className="mr-2 h-4 w-4" />
                <span>Novo Plano</span>
              </CommandItem>
              <CommandItem
                onSelect={() => navigate("/admin/team?action=invite")}
                value="convidar-membro"
              >
                <UsersRound className="mr-2 h-4 w-4" />
                <span>Convidar Membro</span>
              </CommandItem>
            </CommandGroup>

            {/* GRUPO: Configurações */}
            <CommandGroup heading="Configurações">
              <CommandItem
                onSelect={() => navigate("/admin/settings")}
                value="configuracoes"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </CommandItem>
              <CommandItem
                onSelect={() => navigate("/api/auth/signout")}
                value="sair"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
