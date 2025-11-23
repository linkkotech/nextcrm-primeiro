"use client";

import { TemplateBlock } from "@prisma/client";
import { EditorElement, BlockContent, BlockMetadata } from "@/types/editor";
import { blockMetadataSchema } from "@/schemas/editor.schemas";
import { HeroPropertiesForm } from "./forms/HeroPropertiesForm";
import { 
    SectionPropertiesForm,
    SectionContentForm,
    SectionStyleForm,
    SectionAdvancedForm 
} from "./forms/SectionPropertiesForm";
import { StylePropertiesForm } from "./forms/StylePropertiesForm";
import { BlockMetadataForm } from "./forms/BlockMetadataForm";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Palette, Settings, Info } from "lucide-react";
import { saveBlockContent } from "@/services/template-block.actions";
import { toast } from "sonner";
import { useState } from "react";

interface InspectorProps {
    block?: TemplateBlock;
    blockContent: BlockContent;
    selectedElement?: EditorElement;
    selectedElementId?: string | null;
    onAddElement?: () => void;
    onUpdateMetadata: (metadata: BlockMetadata) => void;
    onUpdateElementProps: (id: string, props: Partial<EditorElement["props"]>) => void;
    onDeleteElement: (id: string) => void;
    isSaving?: boolean;
}

/**
 * Inspector - Painel de propriedades do bloco (estilo Elementor)
 * 
 * Comportamento:
 * - Se NENHUM elemento está selecionado: Renderiza BlockMetadataForm (editar nome e descrição do bloco)
 * - Se UM elemento está selecionado: Renderiza formulário específico baseado em element.type
 * 
 * Estrutura quando elemento selecionado:
 * - Conteúdo: Propriedades específicas do tipo (título, texto, etc)
 * - Estilo: Design, tipografia, cores, espaçamento, sombra com suporte a Normal/Hover
 * - Avançado: Configurações de animação, atributos HTML, etc (placeholder)
 */
export function Inspector({ 
    block, 
    blockContent,
    selectedElement, 
    selectedElementId, 
    onAddElement,
    onUpdateMetadata,
    onUpdateElementProps,
    onDeleteElement,
    isSaving
}: InspectorProps) {
    const [isMetadataSaving, setIsMetadataSaving] = useState(false);

    /**
     * Handler para salvar apenas os metadados do bloco
     * 
     * IMPORTANTE: Este handler é usado apenas no BlockMetadataForm
     * para salvar name/description sem afetar os elementos.
     * 
     * Validação acontece aqui (Zod) antes de persistir no banco.
     */
    const handleSaveMetadata = async () => {
        setIsMetadataSaving(true);
        try {
            // Validar metadados com Zod antes de salvar
            const validation = blockMetadataSchema.safeParse(blockContent.metadata);
            
            if (!validation.success) {
                const firstError = validation.error.errors[0];
                toast.error("Erro de validação", {
                    description: firstError.message || "Dados inválidos no formulário.",
                });
                setIsMetadataSaving(false);
                return;
            }
            
            // Preparar conteúdo atualizado (já validado)
            const updatedContent: BlockContent = {
                ...blockContent,
                metadata: validation.data,
            };
            
            // Salvar no banco de dados
            const result = await saveBlockContent(block?.id!, updatedContent);
            
            if (result.success) {
                toast.success("Metadados salvos", {
                    description: "Nome e descrição do bloco foram atualizados.",
                });
            } else {
                console.error("🔴 Erro ao salvar metadados:", result.error);
                toast.error("Erro ao salvar", {
                    description: result.error || "Erro ao atualizar metadados.",
                });
            }
        } catch (error) {
            console.error("🔴 Exceção ao salvar metadados:", error);
            toast.error("Erro inesperado", {
                description: "Ocorreu um erro ao tentar salvar os metadados.",
            });
        } finally {
            setIsMetadataSaving(false);
        }
    };

    // Se não há elemento selecionado, mostrar formulário de metadados do bloco
    if (!selectedElement || !selectedElementId) {
        return (
            <div className="flex flex-col h-full bg-background">
                <div className="p-4 border-b bg-background">
                    <h3 className="font-semibold text-sm">Propriedades do Bloco</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                        Configure o nome e descrição deste bloco
                    </p>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <BlockMetadataForm
                        name={blockContent.metadata.name}
                        description={blockContent.metadata.description}
                        onNameChange={(value) => onUpdateMetadata({ ...blockContent.metadata, name: value })}
                        onDescriptionChange={(value) => onUpdateMetadata({ ...blockContent.metadata, description: value })}
                        onSave={handleSaveMetadata}
                        isSaving={isMetadataSaving}
                    />
                </div>
            </div>
        );
    }

    // Se há elemento selecionado, renderizar formulário específico do tipo
    // Renderizar formulário específico baseado no tipo do elemento
    const renderFormsForElement = () => {
        switch (selectedElement.type) {
            case "Section":
                return (
                    <SectionPropertiesForm 
                        block={block as TemplateBlock}
                        selectedElement={selectedElement}
                        onUpdateProps={(props) => onUpdateElementProps(selectedElement.id, props)}
                    >
                        <TabsContent value="content" className="p-4 space-y-4 m-0">
                            <SectionContentForm block={block as TemplateBlock} />
                        </TabsContent>
                        <TabsContent value="style" className="p-4 m-0">
                            <SectionStyleForm />
                        </TabsContent>
                        <TabsContent value="advanced" className="p-4 m-0">
                            <SectionAdvancedForm />
                        </TabsContent>
                    </SectionPropertiesForm>
                );
            case "Container":
                return (
                    <div className="p-4 text-sm text-muted-foreground">
                        Formulário para Container em desenvolvimento
                    </div>
                );
            default:
                return (
                    <div className="p-4 text-sm text-muted-foreground">
                        Formulário de edição para o tipo "{selectedElement.type}" ainda não foi implementado.
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
                            {selectedElement.type}
                        </h3>
                        <p className="text-xs text-muted-foreground font-mono mt-1">
                            ID: {selectedElement.id.slice(-8)}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="block-active"
                            defaultChecked={true}
                            onCheckedChange={(checked) => {
                                console.log("Toggle active:", checked);
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Tabs Principais - Estilo Elementor */}
            <div className="flex-1 overflow-hidden flex flex-col">
                <Tabs defaultValue="content" className="flex flex-col flex-1 overflow-hidden">
                    {/* Navegação com Ícones */}
                    <TabsList className="w-full justify-start bg-muted/30 rounded-none border-b p-0 h-auto">
                        <TabsTrigger
                            value="content"
                            className="gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                        >
                            <FileText className="h-4 w-4" />
                            <span className="uppercase tracking-wide" style={{ fontSize: "0.65rem" }}>Conteúdo</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="style"
                            className="gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                        >
                            <Palette className="h-4 w-4" />
                            <span className="uppercase tracking-wide" style={{ fontSize: "0.65rem" }}>Estilo</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="advanced"
                            className="gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                        >
                            <Settings className="h-4 w-4" />
                            <span className="uppercase tracking-wide" style={{ fontSize: "0.65rem" }}>Avançado</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Conteúdo das Tabs - renderizado pelos sub-componentes */}
                    <div className="flex-1 overflow-y-auto">
                        {renderFormsForElement()}
                    </div>

                    {/* Alert Footer - Instrução de Salvamento */}
                    <div className="border-t bg-muted/30 p-3">
                        <Alert variant="default" className="border-0 bg-transparent p-0">
                            <Info className="h-4 w-4" />
                            <AlertDescription className="text-xs ml-3">
                                Use o botão <strong>Salvar</strong> no cabeçalho para persistir as alterações.
                            </AlertDescription>
                        </Alert>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
