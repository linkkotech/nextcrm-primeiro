"use client";
import { useState, useCallback, useRef } from "react";
import { EditorSidebar } from "./EditorSidebar";
import { ContentEditor } from "./ContentEditor";
import { DesignEditor } from "@/components/editors/DesignEditor";
import { SettingsEditor } from "@/components/editors/SettingsEditor";
import { AdvancedEditor } from "@/components/editors/AdvancedEditor";
import { MobilePreview } from "./MobilePreview";
import { HeroPreview } from "@/components/preview/HeroPreview";
import { HeroBlockContent } from "@/schemas/heroBlock.schemas";

interface EditorLayoutProps {
  templateId: string;
  initialContent: HeroBlockContent;
}

export function EditorLayout({ templateId, initialContent }: EditorLayoutProps) {
  const [activeSection, setActiveSection] = useState<"content" | "design" | "settings" | "advanced">("content");
  const [heroValues, setHeroValues] = useState<HeroBlockContent | undefined>(undefined);
  
  // ✅ SOLUÇÃO: Usar ref para evitar comparações desnecessárias
  const heroValuesRef = useRef<HeroBlockContent | undefined>(undefined);

  // ✅ Callback estável que só atualiza se valores realmente mudaram
  const handleHeroValuesChange = useCallback((values: HeroBlockContent) => {
    const currentSerialized = JSON.stringify(values);
    const previousSerialized = JSON.stringify(heroValuesRef.current);
    
    // Só atualiza se os valores realmente mudaram
    if (currentSerialized !== previousSerialized) {
      heroValuesRef.current = values;
      setHeroValues(values);
    }
  }, []);

  return (
    <div className="h-full w-full flex bg-background">
      {/* Left Sidebar - Fixa */}
      <aside className="w-72 h-full flex-shrink-0 overflow-hidden border-r border-border bg-card/30">
        <EditorSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      </aside>

      {/* Center Content Editor - Rolável */}
      <main className="flex-1 h-full overflow-y-auto">
        {activeSection === "content" && (
          <ContentEditor 
            templateId={templateId} 
            initialContent={initialContent} 
            onHeroValuesChange={handleHeroValuesChange}
          />
        )}
        {activeSection === "design" && (
          <DesignEditor templateId={templateId} />
        )}
        {activeSection === "settings" && (
          <SettingsEditor templateId={templateId} />
        )}
        {activeSection === "advanced" && (
          <AdvancedEditor 
            templateId={templateId}
            templateName="Meu Template"
            linkedClientsCount={0}
          />
        )}
      </main>

      {/* Right Mobile Preview - Fixa */}
      <aside className="w-96 h-full flex-shrink-0 overflow-hidden border-l border-border bg-muted/30">
        <div className="p-8">
          <MobilePreview 
            templateName="santinho" 
            previewUrl="linqcard.app/santinho"
            heroValues={heroValues}
          >
            <HeroPreview values={heroValues} />
          </MobilePreview>
        </div>
      </aside>
    </div>
  );
}
