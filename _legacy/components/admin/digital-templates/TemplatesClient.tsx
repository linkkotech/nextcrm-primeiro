"use client";

import { useState } from "react";
import { Plus, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CreateTemplateDialog } from "@/components/admin/digital-templates/CreateTemplateDialog";
import { TemplatesCardView } from "@/components/admin/digital-templates/TemplatesCardView";
import { TemplatesListView } from "@/components/admin/digital-templates/TemplatesListView";

interface Template {
  id: string;
  name: string;
  description: string | null;
  type: string;
  createdAt: Date;
}

interface TemplatesClientProps {
  templates: Template[];
}

export function TemplatesClient({ templates }: TemplatesClientProps) {
  const [view, setView] = useState<"card" | "list">("card");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <header>
          <h1 className="text-3xl font-semibold">Templates Digitais</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Gerencie os templates digitais da plataforma
          </p>
        </header>

        <div className="flex items-center gap-3">
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(value: string) => value && setView(value as "card" | "list")}
            className="border rounded-md"
          >
            <ToggleGroupItem value="card" aria-label="Visualização em cards">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="Visualização em lista">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>

          <Button className="gap-2" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Criar Template
          </Button>
        </div>
      </div>

      {/* Conditional Rendering */}
      {view === "card" ? (
        <TemplatesCardView templates={templates} />
      ) : (
        <TemplatesListView templates={templates} />
      )}

      {/* Create Template Dialog */}
      <CreateTemplateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </section>
  );
}
