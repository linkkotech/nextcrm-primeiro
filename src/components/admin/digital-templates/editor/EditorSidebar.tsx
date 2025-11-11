import { File, Palette, Settings, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EditorSidebarProps {
  activeSection: "content" | "design" | "settings" | "advanced";
  onSectionChange: (section: "content" | "design" | "settings" | "advanced") => void;
}

const menuItems = [
  {
    id: "content",
    label: "Conteúdo",
    description: "Adicione e edite blocos de conteúdo",
    icon: File,
  },
  {
    id: "design",
    label: "Design",
    description: "Personalize cores, fontes e estilos",
    icon: Palette,
  },
  {
    id: "settings",
    label: "Configurações",
    description: "Gerencie URLs e privacidade",
    icon: Settings,
  },
  {
    id: "advanced",
    label: "Avançado",
    description: "Exclusão e configurações críticas",
    icon: Zap,
  },
] as const;

export function EditorSidebar({ activeSection, onSectionChange }: EditorSidebarProps) {
  return (
    <div className="p-4 space-y-2">
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground">EDITOR</h2>
      </div>

      <div className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start h-auto py-3 px-3 flex-col items-start",
                isActive && "bg-primary text-primary-foreground"
              )}
              onClick={() => onSectionChange(item.id as any)}
            >
              <div className="flex items-center gap-2 w-full mb-1">
                <Icon className="h-4 w-4" />
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
              <span className={cn(
                "text-xs w-full",
                isActive ? "text-primary-foreground/80" : "text-muted-foreground"
              )}>
                {item.description}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
