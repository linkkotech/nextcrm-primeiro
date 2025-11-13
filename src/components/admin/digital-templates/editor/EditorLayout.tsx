"use client";
import { useState, useCallback, useRef } from "react";
import { EditorSidebar } from "./EditorSidebar";
import { ContentEditor } from "./ContentEditor";
import { MobilePreview } from "./MobilePreview";
import { HeroPreview } from "@/components/preview/HeroPreview";
import { HeroBlockContent } from "@/schemas/heroBlock.schemas";

interface EditorLayoutProps {
  templateId: string;
  initialContent: any;
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
      <div className="flex h-full w-full min-h-0">
        {/* Left Sidebar */}
        <aside className="w-72 border-r border-border bg-card/30 h-full">
          <EditorSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        </aside>

        {/* Center Content Editor */}
        <main className="flex-1 overflow-y-auto min-h-0">
          <ContentEditor 
            templateId={templateId} 
            initialContent={initialContent} 
            onHeroValuesChange={handleHeroValuesChange}
          />
        </main>

        {/* Right Mobile Preview */}
        <aside className="w-96 border-l border-border bg-muted/30 px-6 py-6 flex flex-col h-full">
          <MobilePreview templateName="santinho" previewUrl="linqcard.app/santinho">
            <HeroPreview values={heroValues} />
          </MobilePreview>
        </aside>
      </div>
    </section>
  );
}