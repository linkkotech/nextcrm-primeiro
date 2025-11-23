"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useLocale } from "next-intl";
import { useHeader } from "@/context/HeaderContext";
import { useEditorPanel } from "@/context/EditorPanelContext";
import { Button } from "@/components/ui/button";
import { Save, Boxes, Plus, Smartphone, Tablet, Monitor, Layers } from "lucide-react";
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
import { EditorElement, BlockContent, BlockMetadata } from "@/types/editor";
import { createElement } from "@/lib/element-factory";
import { Inspector } from "./Inspector";
import { StructurePanel } from "./StructurePanel";
import { EditorElementPreview } from "./EditorElementPreview";
import { BlockBuilderModal } from "@/components/admin/block-builder/BlockBuilderModal";
import { saveBlockContent } from "@/services/template-block.actions";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
/**
 * Helper para inicializar o estado do BlockContent a partir do TemplateBlock
 * Garante que blockContent e initialBlockContent iniciem com valores idênticos (DRY)
 */
function initializeBlockContent(block: TemplateBlock): BlockContent {
    try {
        const content = block.content as any;
        
        // Validar se content tem a estrutura esperada
        if (content && typeof content === 'object' && 'elements' in content && Array.isArray(content.elements)) {
            console.log("✅ [BlockEditorClient] Inicializando do banco com", content.elements.length, "elementos");
            return {
                elements: content.elements,
                metadata: content.metadata || {
                    name: block.name || "Novo Bloco",
                    description: undefined,
                },
            };
        }
    } catch (error) {
        console.error("🔴 Erro ao parsear block.content:", error);
    }
    
    // Fallback: estrutura vazia
    console.log("⚠️ [BlockEditorClient] Inicializando com estrutura vazia");
    return {
        elements: [],
        metadata: {
            name: block.name || "Novo Bloco",
            description: undefined,
        },
    };
}

export function BlockEditorClient({ block, translations }: BlockEditorClientProps) {
    const { setPrimaryTitle, setSecondaryHeaderContent } = useHeader();
    const { toggleStructurePanel } = useEditorPanel();
    const locale = useLocale();
    const [isBuilderOpen, setIsBuilderOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"mobile" | "tablet" | "desktop">("mobile");
    const [isSaving, setIsSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    
    // Inicializar estado uma única vez usando useMemo (evita re-execução em re-renders)
    const initialState = useMemo(() => initializeBlockContent(block), [block.id]);
    
    // Estado unificado do Page Builder (elementos + metadados)
    const [blockContent, setBlockContent] = useState<BlockContent>(initialState);
    
    // Estado "pristine" para detectar mudanças não salvas
    const [initialBlockContent, setInitialBlockContent] = useState<BlockContent>(initialState);
    
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

    // Detectar mudanças não salvas comparando com estado inicial
    // TODO: Consider lodash.isEqual for better performance if object size grows
    useEffect(() => {
        const hasChanges = JSON.stringify(blockContent) !== JSON.stringify(initialBlockContent);
        console.log("🔔 [useEffect] Verificando mudanças. Elementos:", blockContent.elements.length, "| Mudanças:", hasChanges);
        setHasUnsavedChanges(hasChanges);
    }, [blockContent, initialBlockContent]);

    /**
     * Handler para salvar o conteúdo completo do bloco
     * 
     * Utiliza o Server Action saveBlockContent() que:
     * 1. Valida com blockContentSchema
     * 2. Atualiza TemplateBlock.content no banco
     * 3. Retorna success/error
     */
    const handleSave = useCallback(async () => {
        console.log("🔍 [BlockEditorClient] Estado atual do blockContent:", blockContent);
        console.log("📊 [BlockEditorClient] Total de elementos:", blockContent.elements.length);
        console.log("📝 [BlockEditorClient] Metadados:", blockContent.metadata);
        
        setIsSaving(true);
        try {
            const result = await saveBlockContent(block.id, blockContent);
            
            if (result.success) {
                setHasUnsavedChanges(false); // Resetar flag
                setInitialBlockContent(blockContent); // Atualizar baseline após save bem-sucedido
                toast.success("Bloco salvo", {
                    description: "Todas as alterações foram salvas com sucesso.",
                });
            } else {
                console.error("🔴 Erro ao salvar:", result.error);
                toast.error("Erro ao salvar", {
                    description: result.error || "Erro desconhecido ao salvar bloco.",
                });
            }
        } catch (error) {
            console.error("🔴 Exceção ao salvar:", error);
            toast.error("Erro inesperado", {
                description: "Ocorreu um erro ao tentar salvar o bloco.",
            });
        } finally {
            setIsSaving(false);
        }
    }, [block.id, blockContent]); // ← Dependências: block.id e blockContent

    /**
     * Handler para atualizar metadados do bloco (nome e descrição)
     */
    const updateMetadata = (metadata: BlockMetadata) => {
        setBlockContent(prev => ({
            ...prev,
            metadata,
        }));
    };

    /**
     * Handler para adicionar um novo elemento à lista
     */
    const addElement = (element: EditorElement) => {
        console.log("➕ [addElement] Adicionando elemento:", element.type, element.id);
        setBlockContent(prev => {
            const newState = {
                ...prev,
                elements: [...prev.elements, element],
            };
            console.log("📋 [addElement] Novo estado (total elementos):", newState.elements.length);
            return newState;
        });
    };

    /**
     * Handler para atualizar propriedades de um elemento específico
     * 
     * IMPORTANTE: Este helper será usado pelo Inspector.tsx quando
     * o formulário de propriedades do elemento for salvo.
     */
    const updateElementProps = (id: string, props: Partial<EditorElement["props"]>) => {
        console.log("✏️ [updateElementProps] Atualizando elemento:", id);
        console.log("📝 [updateElementProps] Novas props:", props);
        setBlockContent(prev => ({
            ...prev,
            elements: prev.elements.map(el =>
                el.id === id ? { ...el, props: { ...el.props, ...props } } : el
            ),
        }));
    };

    /**
     * Função auxiliar para remover elemento recursivamente
     * 
     * Remove o elemento com o ID especificado, seja ele um elemento raiz
     * ou um elemento aninhado dentro de children de qualquer nível.
     * 
     * @param elements - Array de elementos para processar
     * @param id - ID do elemento a ser removido
     * @returns Novo array sem o elemento removido
     */
    const removeElementRecursively = (elements: EditorElement[], id: string): EditorElement[] => {
        return elements
            .filter(el => el.id !== id) // Remove se for o elemento buscado
            .map(el => ({
                ...el,
                // Se tem children, processar recursivamente
                children: el.children ? removeElementRecursively(el.children, id) : undefined,
            }));
    };

    /**
     * Handler para deletar um elemento
     * 
     * Remove o elemento recursivamente (busca em todos os níveis da árvore),
     * limpa a seleção se necessário, e salva automaticamente as alterações.
     */
    const deleteElement = async (id: string) => {
        // Atualizar estado local
        setBlockContent(prev => {
            const updatedContent = {
                ...prev,
                elements: removeElementRecursively(prev.elements, id),
            };
            
            // Salvar automaticamente após atualizar o estado
            setTimeout(async () => {
                setIsSaving(true);
                try {
                    const result = await saveBlockContent(block.id, updatedContent);
                    
                    if (result.success) {
                        setHasUnsavedChanges(false);
                        setInitialBlockContent(updatedContent);
                        toast.success("Elemento excluído", {
                            description: "O elemento foi removido e as alterações foram salvas.",
                        });
                    } else {
                        toast.error("Erro ao salvar exclusão", {
                            description: result.error || "Erro ao persistir a exclusão.",
                        });
                    }
                } catch (error) {
                    toast.error("Erro ao salvar", {
                        description: "Ocorreu um erro ao salvar a exclusão.",
                    });
                } finally {
                    setIsSaving(false);
                }
            }, 0);
            
            return updatedContent;
        });
        
        // Se o elemento deletado estava selecionado, limpar seleção
        if (selectedElementId === id) {
            setSelectedElementId(null);
        }
    };

    /**
     * Handler para quando o usuário seleciona um elemento no BlockBuilderModal
     * 
     * Responsabilidades:
     * 1. Criar novo elemento via factory (ex: createDefaultSection)
     * 2. Adicionar ao blockContent.elements
     * 3. Definir como selecionado (selectedElementId)
     * 4. Fechar o modal
     */
    const handleElementSelect = (elementType: string) => {
        console.log("🎯 [handleElementSelect] Tipo selecionado:", elementType);
        try {
            // Criar novo elemento do tipo selecionado
            const newElement = createElement(elementType);
            console.log("✅ [handleElementSelect] Elemento criado:", newElement);
            
            // Adicionar ao blockContent usando helper
            addElement(newElement);
            
            // Selecionar automaticamente o novo elemento
            setSelectedElementId(newElement.id);
            console.log("👆 [handleElementSelect] Elemento selecionado:", newElement.id);
            
            // Fechar modal
            setIsBuilderOpen(false);
        } catch (error) {
            console.error("🔴 Erro ao criar elemento:", error);
        }
    };

    // Encontrar o elemento selecionado no array
    const selectedElement = blockContent.elements.find(el => el.id === selectedElementId);

    // Proteção contra navegação com mudanças não salvas
    useEffect(() => {
        const handler = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = ''; // Chrome exige que returnValue seja setado
            }
        };
        
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [hasUnsavedChanges]);

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
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => toggleStructurePanel()}
                        title="Mostrar/ocultar painel de estrutura"
                    >
                        <Layers className="h-4 w-4 mr-2" />
                        Estrutura
                    </Button>
                    <Button 
                        size="sm" 
                        onClick={handleSave}
                        disabled={isSaving}
                        variant={hasUnsavedChanges ? "default" : "outline"}
                        className={cn(hasUnsavedChanges && "animate-pulse")}
                    >
                        <Save className={cn("h-4 w-4 mr-2", isSaving && "animate-spin")} />
                        {isSaving ? "Salvando..." : (hasUnsavedChanges ? "Salvar *" : translations.save)}
                    </Button>
                </div>
            </div>
        );

        // Cleanup ao desmontar
        return () => {
            setPrimaryTitle("");
            setSecondaryHeaderContent(null);
        };
    }, [
        setPrimaryTitle, 
        setSecondaryHeaderContent, 
        locale, 
        block, 
        translations.save, 
        isSaving, 
        hasUnsavedChanges, 
        handleSave, // ← CRÍTICO: incluir handleSave nas dependências
        toggleStructurePanel
    ]);

    return (
        <>
            <BlockBuilderModal 
                open={isBuilderOpen} 
                onOpenChange={setIsBuilderOpen}
                onElementSelect={handleElementSelect}
            />
            <StructurePanel block={block} onDelete={deleteElement} />
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
                        <div 
                            className="flex-1 flex items-center justify-center"
                            onClick={(e) => {
                                // Desselecionar elemento ao clicar no fundo do canvas (não nos elementos)
                                if (e.target === e.currentTarget) {
                                    setSelectedElementId(null);
                                }
                            }}
                        >
                            <div
                                className={cn(
                                    "transition-all duration-300 mx-auto w-full space-y-4",
                                    viewMode === "mobile" && "w-[393px]",
                                    viewMode === "tablet" && "w-[768px]",
                                    viewMode === "desktop" && "w-full max-w-6xl"
                                )}
                                onClick={(e) => {
                                    // Também desselecionar ao clicar no espaço entre elementos
                                    if (e.target === e.currentTarget) {
                                        setSelectedElementId(null);
                                    }
                                }}
                            >
                                {/* Canvas: Renderizar elementos ou empty state */}
                                {blockContent.elements.length === 0 ? (
                                    <>
                                        {/* Empty State do Canvas */}
                                        <div className="min-h-[393px] border-2 border-dashed border-muted-foreground/25 bg-background" />
                                        
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
                                    </>
                                ) : (
                                    /* Renderizar elementos */
                                    <div className="space-y-4">
                                        {blockContent.elements.map((element) => (
                                            <EditorElementPreview
                                                key={element.id}
                                                element={element}
                                                isSelected={selectedElementId === element.id}
                                                onSelect={setSelectedElementId}
                                            />
                                        ))}
                                        
                                        {/* Botão para adicionar mais elementos */}
                                        <div className="flex justify-center pt-4">
                                            <Button
                                                variant="outline"
                                                onClick={() => setIsBuilderOpen(true)}
                                                className="w-[393px]"
                                            >
                                                <Boxes className="h-5 w-5 mr-2" />
                                                Adicionar Elemento
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>

                {/* Coluna Direita - Inspector de Propriedades */}
                {/* overflow-y-auto permite scroll apenas nesta área */}
                <aside className="w-80 border-l border-border bg-background overflow-y-auto">
                    <Inspector 
                        block={block}
                        blockContent={blockContent}
                        selectedElement={selectedElement}
                        selectedElementId={selectedElementId}
                        onAddElement={() => setIsBuilderOpen(true)}
                        onUpdateMetadata={updateMetadata}
                        onUpdateElementProps={updateElementProps}
                        onDeleteElement={deleteElement}
                        isSaving={isSaving}
                    />
                </aside>
            </div>
        </div>
        </>
    );
}
