"use client";
import { useState, useCallback, useRef } from "react";
import { File, Palette, Settings, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentEditor } from "./ContentEditor";
import { DesignEditor } from "@/components/editors/DesignEditor";
import { SettingsEditor } from "@/components/editors/SettingsEditor";
import { AdvancedEditor } from "@/components/editors/AdvancedEditor";
import { ImageMockup } from "@/components/ui/ImageMockup";
import { MobileScreen } from "@/components/preview/MobileScreen";
import { HeroBlockContent } from "@/schemas/heroBlock.schemas";

interface EditorLayoutProps {
  templateId: string;
  initialContent: HeroBlockContent;
}

export function EditorLayout({ templateId, initialContent }: EditorLayoutProps) {
  const [heroValues, setHeroValues] = useState<HeroBlockContent | undefined>(initialContent);
  const [dynamicBlocks, setDynamicBlocks] = useState<any[]>([]);
  
  // ✅ SOLUÇÃO: Usar ref para evitar comparações desnecessárias
  const heroValuesRef = useRef<HeroBlockContent | undefined>(initialContent);

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

  // Carregar blocos dinâmicos do initialContent
  const handleDynamicBlocksChange = useCallback((blocks: any[]) => {
    setDynamicBlocks(blocks);
  }, []);

  return (
    <div className="w-full max-w-[1280px] mx-auto p-8 h-full">
      <div className="flex h-full w-full gap-8">
        {/* Coluna Principal - Conteúdo com Tabs */}
        <main className="flex-1 h-full min-h-0 overflow-y-auto">
          <Tabs defaultValue="content" className="h-full flex flex-col">
            {/* Navegação por Tabs - Estilo Pill */}
            <div className="p-4 max-w-2xl mx-auto">
              <TabsList className="flex w-full gap-2 p-1 bg-muted/50 rounded-lg">
                <TabsTrigger 
                  value="content" 
                  className="flex-1 rounded-lg px-4 py-2 text-sm font-medium data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  <File className="h-4 w-4 mr-2" />
                  Conteúdo
                </TabsTrigger>
                <TabsTrigger 
                  value="design" 
                  className="flex-1 rounded-lg px-4 py-2 text-sm font-medium data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  <Palette className="h-4 w-4 mr-2" />
                  Design
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="flex-1 rounded-lg px-4 py-2 text-sm font-medium data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </TabsTrigger>
                <TabsTrigger 
                  value="advanced" 
                  className="flex-1 rounded-lg px-4 py-2 text-sm font-medium data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Avançado
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Conteúdo das Tabs */}
            <div className="flex-1 overflow-y-auto">
              <div className="w-full">
                <TabsContent value="content" className="h-full m-0 focus-visible:outline-none focus-visible:ring-0">
                  <ContentEditor 
                    templateId={templateId} 
                    initialContent={initialContent} 
                    onHeroValuesChange={handleHeroValuesChange}
                    onDynamicBlocksChange={handleDynamicBlocksChange}
                  />
                </TabsContent>

                <TabsContent value="design" className="h-full m-0 focus-visible:outline-none focus-visible:ring-0">
                  <DesignEditor templateId={templateId} />
                </TabsContent>

                <TabsContent value="settings" className="h-full m-0 focus-visible:outline-none focus-visible:ring-0">
                  <SettingsEditor templateId={templateId} />
                </TabsContent>

                <TabsContent value="advanced" className="h-full m-0 focus-visible:outline-none focus-visible:ring-0">
                  <AdvancedEditor 
                    templateId={templateId}
                    templateName="Meu Template"
                    linkedClientsCount={0}
                  />
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </main>

        {/* Right Mobile Preview - Fixa */}
        <aside className="w-96 h-full flex-shrink-0 overflow-hidden border-l border-border">
          <div className="p-8 h-full flex justify-center items-start">
            <ImageMockup>
              <MobileScreen heroValues={heroValues} dynamicBlocks={dynamicBlocks} />
            </ImageMockup>
          </div>
        </aside>
      </div>
    </div>
  );
}