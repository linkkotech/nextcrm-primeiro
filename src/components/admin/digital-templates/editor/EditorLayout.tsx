"use client";
import { useState, useCallback, useRef } from "react";
import { EditorSidebar } from "./EditorSidebar";
import { ContentEditor } from "./ContentEditor";
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
    <section className="h-full w-full overflow-hidden bg-background">
      <div className="flex h-full w-full">
        {/* Left Sidebar - Fixa */}
        <aside className="w-72 border-r border-border bg-card/30 flex-shrink-0">
          <EditorSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        </aside>

        {/* Center Content Editor - Rolável */}
        <main className="flex-1 overflow-y-auto min-w-0 min-h-0">
          <div className="p-8">
            <ContentEditor 
              templateId={templateId} 
              initialContent={initialContent} 
              onHeroValuesChange={handleHeroValuesChange}
            />
          </div>
        </main>

        {/* Right Mobile Preview - Fixa */}
        <aside className="w-96 h-full border-l border-border bg-muted/30 overflow-y-auto p-8 flex flex-col flex-shrink-0">
          <MobilePreview templateName="santinho" previewUrl="linqcard.app/santinho">
            <HeroPreview values={heroValues} />
          </MobilePreview>
        </aside>
      </div>
    </section>
  );
}
