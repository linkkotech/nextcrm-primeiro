"use client";

import { ChevronDown, Settings, User, LogOut } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth.actions";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfileProps {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  isCollapsed?: boolean;
}

/**
 * Componente de Perfil de Usuário com Dropdown
 * 
 * Usado em:
 * - AdminSidebar (expandido)
 * - AppSidebar (expandido ou recolhido)
 * 
 * Renderização:
 * - Expandido: Avatar + Nome + Email + ChevronDown
 * - Recolhido: Apenas Avatar
 * 
 * Funcionalidades:
 * - Logout via logoutAction
 * - Links para Perfil e Configurações (admin)
 * - Status online (ponto verde)
 * 
 * @param name - Nome do usuário
 * @param email - Email do usuário
 * @param image - URL da imagem do avatar
 * @param isCollapsed - Se sidebar está recolhida (default: false)
 * @param workspaceSlug - Slug do workspace (para uso futuro em rotas customizáveis)
 */
export function UserProfile({
  name,
  email,
  image,
  isCollapsed = false,
}: UserProfileProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.push("/sign-in");
  };

  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isCollapsed ? (
          // Versão recolhida: Apenas Avatar centralizado
          <button className="flex justify-center w-full p-2 rounded-lg hover:bg-sidebar-accent transition-colors">
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarImage src={image || undefined} alt={name || "User"} />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-green-500" />
            </div>
          </button>
        ) : (
          // Versão expandida: Avatar + Nome + Email + ChevronDown
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-accent transition-colors">
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarImage src={image || undefined} alt={name || "User"} />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-green-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {name || "Usuário"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {email || "email@exemplo.com"}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" className="w-56">
        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/admin/profile")}>
          <User className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/admin/profile/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configurações</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


