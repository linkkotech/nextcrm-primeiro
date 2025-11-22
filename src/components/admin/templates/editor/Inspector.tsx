"use client";

import { TemplateBlock } from "@prisma/client";
import { HeroPropertiesForm } from "./forms/HeroPropertiesForm";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface InspectorProps {
    block: TemplateBlock;
}

export function Inspector({ block }: InspectorProps) {
    // Função auxiliar para renderizar o formulário correto
    const renderForm = () => {
        switch (block.type) {
            case "HERO":
                return <HeroPropertiesForm block={block} />;
            default:
                return (
                    <div className="p-4 text-sm text-muted-foreground">
                        Formulário para {block.type} ainda não implementado.
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header do Inspector */}
            <div className="p-4 border-b bg-background space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-sm">
                            {block.type === "HERO" ? "Hero Section" : block.type}
                        </h3>
                        <p className="text-xs text-muted-foreground font-mono mt-1">
                            ID: {block.id.slice(-8)}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="block-active"
                            checked={block.isActive}
                            onCheckedChange={(checked) => {
                                // TODO: Implementar toggle de status via Server Action
                                console.log("Toggle active:", checked);
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Accordion de Propriedades */}
            <div className="flex-1 overflow-y-auto">
                <Accordion type="multiple" defaultValue={["content"]} className="w-full">

                    {/* Seção de Conteúdo */}
                    <AccordionItem value="content">
                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                            Conteúdo
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-4">
                            {renderForm()}
                        </AccordionContent>
                    </AccordionItem>

                    {/* Seção de Design (Placeholder) */}
                    <AccordionItem value="design">
                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                            Design
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-4">
                            <div className="text-sm text-muted-foreground text-center py-8 border-2 border-dashed rounded-lg">
                                Opções de design em breve
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Seção Avançado (Placeholder) */}
                    <AccordionItem value="advanced">
                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                            Avançado
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-4">
                            <div className="text-sm text-muted-foreground text-center py-8 border-2 border-dashed rounded-lg">
                                Configurações avançadas em breve
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                </Accordion>
            </div>
        </div>
    );
}
