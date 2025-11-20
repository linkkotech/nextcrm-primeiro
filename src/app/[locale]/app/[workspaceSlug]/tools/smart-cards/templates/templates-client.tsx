"use client";

import { useState } from "react";
import { Plus, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CreateTemplateDialog } from "@/components/application/templates/CreateTemplateDialog";
import { TemplatesCardView } from "@/components/application/templates/TemplatesCardView";
import { TemplatesListView } from "@/components/application/templates/TemplatesListView";
import type { Template } from "@/types/template";

interface TemplatesClientProps {
  templates: Template[];
  workspaceId: string;
}

export function TemplatesClient({ templates, workspaceId }: TemplatesClientProps) {
  const [view, setView] = useState<"card" | "list">("card");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <header>
          <h1 className="text-3xl font-semibold">Templates</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Templates globais e específicos do workspace
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
        workspaceId={workspaceId}
      />
    </section>
  );
}
