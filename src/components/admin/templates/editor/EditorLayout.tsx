"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { File, Plus } from "lucide-react";
import { toast } from "sonner";

import { TemplateBlock } from "@prisma/client";
import { ContentBlock } from "./ContentBlock";
import { createTemplateBlock } from "@/services/block.actions";

interface EditorLayoutProps {
    templateId: string;
    templateName: string;
    blocks: TemplateBlock[];
}

export function EditorLayout({ templateId, templateName, blocks }: EditorLayoutProps) {
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();

    async function handleAddBlock() {
        setIsCreating(true);
        try {
            const result = await createTemplateBlock(templateId, "HERO");

            if (result.error) {
                toast.error(result.error);
            } else if (result.blockId) {
                toast.success("Bloco criado com sucesso!");
                router.refresh();
            }
        } catch (error) {
            toast.error("Erro ao criar bloco");
        } finally {
            setIsCreating(false);
        }
    }

    return (
        <div className="flex h-full w-full gap-8">
            {/* Coluna Esquerda - Editor com Tabs */}
            <main className="flex-1 h-full min-h-0 overflow-y-auto">
                <Tabs defaultValue="content" className="h-full flex flex-col">
                    {/* Navegação por Tabs */}
                    <div className="pb-4">
                        <TabsList className="flex w-full max-w-md gap-2 p-1 bg-muted/50 rounded-lg">
                            <TabsTrigger
                                value="content"
                                className="flex-1 rounded-lg px-4 py-2 text-sm font-medium"
                            >
                                <File className="h-4 w-4 mr-2" />
                                Conteúdo
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Conteúdo das Tabs */}
                    <div className="flex-1 overflow-y-auto">
                        <TabsContent value="content" className="h-full m-0 focus-visible:outline-none focus-visible:ring-0">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-6 bg-muted/50 rounded-lg mb-6">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Editor de Conteúdo</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Gerencie os blocos de conteúdo do seu template.
                                        </p>
                                    </div>
                                    <Button
                                        onClick={handleAddBlock}
                                        disabled={isCreating}
                                        size="sm"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        {isCreating ? "Criando..." : "Adicionar Bloco"}
                                    </Button>
                                </div>

                                {/* Lista de Blocos */}
                                <div className="space-y-2">
                                    {blocks.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                                            Nenhum bloco adicionado ainda.
                                        </div>
                                    ) : (
                                        blocks.map((block) => (
                                            <ContentBlock key={block.id} block={block} />
                                        ))
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </main>

            {/* Coluna Direita - Preview Mobile */}
            <aside className="w-96 h-full flex-shrink-0 border-l border-border pl-8">
                <div className="h-full flex flex-col">
                    {/* Header do Preview */}
                    <div className="mb-6 flex flex-col gap-1">
                        <h2 className="text-lg font-semibold">Preview</h2>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="h-2 w-2 rounded-full bg-primary" />
                            <span>Visualização em tempo real</span>
                        </div>
                    </div>

                    {/* Mobile Frame */}
                    <div className="flex flex-1 items-center justify-center">
                        <div className="relative w-[320px] h-[640px] rounded-3xl bg-slate-900 shadow-2xl overflow-hidden border-8 border-slate-900">
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-slate-900 rounded-b-3xl z-10" />

                            {/* Screen Content */}
                            <div className="h-full w-full bg-gradient-to-b from-slate-100 to-slate-200 flex items-center justify-center">
                                <div className="text-center p-6">
                                    <p className="text-sm font-medium text-slate-700">Preview do Template</p>
                                    <p className="text-xs text-slate-500 mt-2">{templateName}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}
