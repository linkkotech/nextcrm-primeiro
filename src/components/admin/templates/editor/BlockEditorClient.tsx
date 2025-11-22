"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useHeader } from "@/context/HeaderContext";
import { Button } from "@/components/ui/button";
import { Save, Boxes, Plus, Smartphone, Tablet, Monitor } from "lucide-react";
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { TemplateBlock, DigitalTemplate } from "@prisma/client";
import { Inspector } from "./Inspector";
import { BlockBuilderModal } from "@/components/admin/block-builder/BlockBuilderModal";
import { cn } from "@/lib/utils";

interface BlockEditorClientProps {
    block: TemplateBlock & {
        template: Pick<DigitalTemplate, "id" | "name" | "type">;
    };
    translations: {
        canvas: string;
        properties: string;
        save: string;
    };
}

/**
 * Block Editor Client Component
 * 
 * Renderiza a interface de edição de blocos de conteúdo com layout de 3 colunas.
 * Utiliza uma abordagem Flexbox estrita para garantir que o editor ocupe 100% da altura
 * disponível, compensando o padding do layout pai (AdminLayoutClient).
 * 
 * Estrutura:
 * - Container Principal: flex-col, h-[calc(100%+4rem)], -m-8 (compensa p-8 do pai)
 * - Wrapper de Conteúdo: flex-1, flex, overflow-hidden (contém Canvas e Inspector)
 * - Canvas: flex-1, overflow-y-auto (scroll independente)
 * - Inspector: w-80, overflow-y-auto (scroll independente)
 */
export function BlockEditorClient({ block, translations }: BlockEditorClientProps) {
    const { setPrimaryTitle, setSecondaryHeaderContent } = useHeader();
    const locale = useLocale();
    const [isBuilderOpen, setIsBuilderOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"mobile" | "tablet" | "desktop">("mobile");

    useEffect(() => {
        // Configurar header primário (nome do template + tipo do bloco)
        setPrimaryTitle(`${block.template.name} - ${block.type}`);

        // Configurar header secundário (breadcrumb + ações)
        setSecondaryHeaderContent(
            <div className="flex items-center justify-between w-full">
                {/* Breadcrumb - Lado Esquerdo */}
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={`/${locale}/admin`}>Admin</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href={`/${locale}/admin/digital-templates`}>
                                Templates Digitais
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href={`/${locale}/admin/digital-templates/${block.template.id}`}>
                                {block.template.name}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Editor de Blocos</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Botões de Ação - Lado Direito */}
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsBuilderOpen(true)}>
                        <Boxes className="h-4 w-4 mr-2" />
                        Construtor de Blocos
                    </Button>
                    <Button size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        {translations.save}
                    </Button>
                </div>
            </div>
        );

        // Cleanup ao desmontar
        return () => {
            setPrimaryTitle("");
            setSecondaryHeaderContent(null);
        };
    }, [setPrimaryTitle, setSecondaryHeaderContent, locale, block, translations.save]);

    return (
        <>
            <BlockBuilderModal open={isBuilderOpen} onOpenChange={setIsBuilderOpen} />
            {/* Container Principal: Compensa o padding de 2rem (32px) do pai em todos os lados */}
            {/* w-[calc(100%+4rem)] e h-[calc(100%+4rem)] garantem que ocupe todo o viewport */}
            <div className="flex flex-col -m-8 w-[calc(100%+4rem)] h-[calc(100%+4rem)] bg-background">

            {/* Wrapper de Conteúdo (Canvas + Inspector) */}
            {/* flex-1 faz ocupar todo o espaço vertical restante */}
            {/* overflow-hidden impede que o scroll do body seja ativado */}
            <div className="flex-1 flex overflow-hidden">

                {/* Coluna Central - Canvas de Edição */}
                {/* overflow-y-auto permite scroll apenas nesta área */}
                <main className="flex-1 bg-muted/30 overflow-y-auto">
                    <div className="p-8 min-h-full flex flex-col">
                        {/* Controles de Responsividade */}
                        <div className="flex justify-center mb-6">
                            <ToggleGroup
                                type="single"
                                value={viewMode}
                                onValueChange={(value) => {
                                    if (value) setViewMode(value as "mobile" | "tablet" | "desktop");
                                }}
                                className="bg-background border rounded-lg p-1 shadow-sm"
                            >
                                <ToggleGroupItem value="mobile" aria-label="Visualização Mobile" className="gap-2 px-4">
                                    <Smartphone className="h-4 w-4" />
                                    <span className="text-sm">Mobile</span>
                                </ToggleGroupItem>
                                <ToggleGroupItem value="tablet" aria-label="Visualização Tablet" className="gap-2 px-4">
                                    <Tablet className="h-4 w-4" />
                                    <span className="text-sm">Tablet</span>
                                </ToggleGroupItem>
                                <ToggleGroupItem value="desktop" aria-label="Visualização Desktop" className="gap-2 px-4">
                                    <Monitor className="h-4 w-4" />
                                    <span className="text-sm">Desktop</span>
                                </ToggleGroupItem>
                            </ToggleGroup>
                        </div>

                        {/* Canvas com largura responsiva */}
                        <div className="flex-1 flex items-center justify-center">
                            <div
                                className={cn(
                                    "transition-all duration-300 mx-auto space-y-4",
                                    viewMode === "mobile" && "w-[393px]",
                                    viewMode === "tablet" && "w-[768px]",
                                    viewMode === "desktop" && "w-full max-w-6xl"
                                )}
                            >
                                {/* Empty State do Canvas */}
                                <div className="min-h-[393px] rounded-2xl border-2 border-dashed border-muted-foreground/25 bg-background" />
                                
                                {/* Botão Adicionar Elemento */}
                                <div className="flex justify-center">
                                    <Button
                                        size="lg"
                                        onClick={() => setIsBuilderOpen(true)}
                                        className="w-[393px]"
                                    >
                                        <Boxes className="h-5 w-5 mr-2" />
                                        Adicionar Elemento
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Coluna Direita - Inspector de Propriedades */}
                {/* overflow-y-auto permite scroll apenas nesta área */}
                <aside className="w-80 border-l border-border bg-background overflow-y-auto">
                    <Inspector block={block} />
                </aside>
            </div>
        </div>
        </>
    );
}
