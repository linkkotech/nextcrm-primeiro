"use client";

import React, { useCallback } from "react";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContentBlock } from "./ContentBlock";
import { HeroBlockEditor } from "@/components/editors/HeroBlockEditor";
import { CTAEditor } from "@/components/editors/CTAEditor";
import { updateHeroBlockContent } from "@/lib/actions/heroBlock.actions";
import { saveCTABlock, deleteCTABlock } from "@/lib/actions/ctaBlock.actions";
import { heroBlockContentSchema, type HeroBlockContent } from "@/schemas/heroBlock.schemas";
import { type CTABlockContent } from "@/schemas/ctaBlock.schemas";
import { Plus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface Block {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  clickCount?: number;
  isActive: boolean;
  content: Record<string, unknown>;
  icon: React.ReactNode;
}

interface BlockListContainerProps {
  templateId: string;
  heroBlock: Block;
  menuBlock: Block;
  dynamicBlocks: Block[];
  onAddBlock: () => void;
  onReorderBlocks: (blocks: Block[]) => void;
  onToggleBlock: (id: string, active: boolean) => void;
  onDeleteBlock: (id: string) => void;
  onFormValuesChange?: (values: HeroBlockContent) => void;
  onCTAToggle?: (enabled: boolean) => void;
}

export function BlockListContainer({
  templateId,
  heroBlock,
  menuBlock,
  dynamicBlocks,
  onAddBlock,
  onReorderBlocks,
  onToggleBlock,
  onDeleteBlock,
  onFormValuesChange,
  onCTAToggle,
}: BlockListContainerProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState,
  } = useForm<HeroBlockContent>({
    resolver: zodResolver(heroBlockContentSchema),
    defaultValues: {
      // NEW FIELDS - Visual Refactor
      destinationUrl: (heroBlock?.content?.destinationUrl as string) || '',
      openInNewTab: (heroBlock?.content?.openInNewTab as boolean) || false,
      iconClass: (heroBlock?.content?.iconClass as string) || '',
      animation: (heroBlock?.content?.animation as 'none' | 'fade' | 'slide' | 'bounce') || 'none',
      sensitiveContentWarning: (heroBlock?.content?.sensitiveContentWarning as boolean) || false,
      columns: (heroBlock?.content?.columns as '1' | '2') || '1',
      // EXISTING FIELDS
      profileImage: (heroBlock?.content?.profileImage as string) || '',
      userName: (heroBlock?.content?.userName as string) || '',
      userInfo: (heroBlock?.content?.userInfo as string) || '',
      phoneNumber: (heroBlock?.content?.phoneNumber as string) || '',
      emailAddress: (heroBlock?.content?.emailAddress as string) || '',
      whatsappNumber: (heroBlock?.content?.whatsappNumber as string) || '',
      scheduleLink: (heroBlock?.content?.scheduleLink as string) || '',
      scheduleEnabled: (heroBlock?.content?.scheduleEnabled as boolean) || false,
      emailMode: (heroBlock?.content?.emailMode as 'mailto' | 'form') || 'mailto',
      isHeaderEnabled: (heroBlock?.content?.isHeaderEnabled as boolean) || false,
      headerLogoUrl: (heroBlock?.content?.headerLogoUrl as string) || '',
      headerLogoImage: (heroBlock?.content?.headerLogoImage as string) || '',
      headerLogoWidth: (heroBlock?.content?.headerLogoWidth as number) || 80,
      headerMenuEnabled: (heroBlock?.content?.headerMenuEnabled as boolean) || false,
      isCTAEnabled: (heroBlock?.content?.isCTAEnabled as boolean) || false,
      styles: {
        // NEW FIELDS - Colors & Alignment
        textColor: ((heroBlock?.content as HeroBlockContent)?.styles?.textColor as string) || '#1F2937',
        textAlignment: ((heroBlock?.content as HeroBlockContent)?.styles?.textAlignment as 'center' | 'left' | 'justify' | 'right') || 'center',
        backgroundColor: ((heroBlock?.content as HeroBlockContent)?.styles?.backgroundColor as string) || '#F7F7F7',
        // EXISTING FIELDS
        blockBackgroundColor: ((heroBlock?.content as HeroBlockContent)?.styles?.blockBackgroundColor as string) || '#F7F7F7',
        blockTitleColor: ((heroBlock?.content as HeroBlockContent)?.styles?.blockTitleColor as string) || '#1F2937',
        blockSubtitleColor: ((heroBlock?.content as HeroBlockContent)?.styles?.blockSubtitleColor as string) || '#6B7280',
        blockTextColor: ((heroBlock?.content as HeroBlockContent)?.styles?.blockTextColor as string) || '#1F2937',
        blockLinkColor: ((heroBlock?.content as HeroBlockContent)?.styles?.blockLinkColor as string) || '#373F4B',
        buttonBackgroundColor: ((heroBlock?.content as HeroBlockContent)?.styles?.buttonBackgroundColor as string) || '#373F4B',
        buttonTextColor: ((heroBlock?.content as HeroBlockContent)?.styles?.buttonTextColor as string) || '#F7F7F7',
        borderWidth: ((heroBlock?.content as HeroBlockContent)?.styles?.borderWidth as number) || 0,
        borderColor: ((heroBlock?.content as HeroBlockContent)?.styles?.borderColor as string) || '#1F2937',
        borderRadius: ((heroBlock?.content as HeroBlockContent)?.styles?.borderRadius as 'reto' | 'arredondado' | 'redondo') || 'reto',
        borderStyle: ((heroBlock?.content as HeroBlockContent)?.styles?.borderStyle as 'solid' | 'dashed' | 'dotted' | 'hidden') || 'solid',
        boxShadowHOffset: ((heroBlock?.content as HeroBlockContent)?.styles?.boxShadowHOffset as number) || 0,
        boxShadowVOffset: ((heroBlock?.content as HeroBlockContent)?.styles?.boxShadowVOffset as number) || 0,
        boxShadowBlur: ((heroBlock?.content as HeroBlockContent)?.styles?.boxShadowBlur as number) || 0,
        boxShadowSpread: ((heroBlock?.content as HeroBlockContent)?.styles?.boxShadowSpread as number) || 0,
        boxShadowColor: ((heroBlock?.content as HeroBlockContent)?.styles?.boxShadowColor as string) || '#1F2937',
      },
    },
  });

  const watchedValues = watch();

  // ✅ SOLUÇÃO: Debounce e comparação para evitar loop infinito
  const previousValuesRef = React.useRef<string>("");
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (!onFormValuesChange) return;

    // Limpar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce de 100ms para evitar muitas atualizações
    timeoutRef.current = setTimeout(() => {
      const currentSerialized = JSON.stringify(watchedValues);
      
      // Só chama callback se valores realmente mudaram
      if (currentSerialized !== previousValuesRef.current) {
        previousValuesRef.current = currentSerialized;
        onFormValuesChange(watchedValues);
      }
    }, 100);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [watchedValues, onFormValuesChange]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = dynamicBlocks.findIndex((item) => item.id === active.id);
      const newIndex = dynamicBlocks.findIndex((item) => item.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedBlocks = arrayMove(dynamicBlocks, oldIndex, newIndex);
        onReorderBlocks(reorderedBlocks);
      }
    }
  };

  const dynamicBlockIds = dynamicBlocks.map((b) => b.id);

  const handleSaveHeroBlock = useCallback(async (data: HeroBlockContent) => {
    const result = await updateHeroBlockContent(templateId, data);

    if (result.success) {
      toast.success("Sucesso!", {
        description: result.message || "Hero Section atualizada com sucesso!",
      });
    } else {
      toast.error("Erro", {
        description: result.error || "Não foi possível salvar as alterações.",
      });
    }

    return result;
  }, [templateId]);

  // ✅ SOLUÇÃO: Memoizar as funções de toggle para cada bloco
  const handleHeroToggle = useCallback((isActive: boolean) => {
    onToggleBlock(heroBlock.id, isActive);
  }, [heroBlock.id, onToggleBlock]);

  const handleMenuToggle = useCallback((isActive: boolean) => {
    onToggleBlock(menuBlock.id, isActive);
  }, [menuBlock.id, onToggleBlock]);

  // ✅ Para blocos dinâmicos, criar um mapa de funções memoizadas
  const toggleHandlers = React.useMemo(() => {
    const handlers: Record<string, (isActive: boolean) => void> = {};
    dynamicBlocks.forEach(block => {
      handlers[block.id] = (isActive: boolean) => onToggleBlock(block.id, isActive);
    });
    return handlers;
  }, [dynamicBlocks, onToggleBlock]);

  return (
    <div className="space-y-4">
      {/* SEÇÃO 1: Hero Section (Fixo Topo) */}
      <Accordion type="single" collapsible>
        <ContentBlock
          id={heroBlock.id}
          type={heroBlock.type}
          title={heroBlock.title}
          subtitle={heroBlock.subtitle}
          clickCount={heroBlock.clickCount}
          isActive={heroBlock.isActive}
          isDraggable={false}
          onToggle={handleHeroToggle}
          icon={heroBlock.icon}
        >
          <HeroBlockEditor
            templateId={templateId}
            blockData={heroBlock}
            register={register}
            control={control}
            handleSubmit={handleSubmit}
            formState={formState}
            onSave={handleSaveHeroBlock}
            onCTAToggle={onCTAToggle}
          />
        </ContentBlock>
      </Accordion>

      {/* SEÇÃO 2: Blocos Dinâmicos (Área de Drag & Drop) */}
      {dynamicBlocks.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={dynamicBlockIds} strategy={verticalListSortingStrategy}>
            <Accordion type="single" collapsible className="space-y-4">
              {dynamicBlocks.map((block) => (
                <ContentBlock
                  key={block.id}
                  id={block.id}
                  type={block.type}
                  title={block.title}
                  subtitle={block.subtitle}
                  clickCount={block.clickCount}
                  isActive={block.isActive}
                  isDraggable={true}
                  onToggle={toggleHandlers[block.id]}
                  onDelete={() => onDeleteBlock(block.id)}
                  icon={block.icon}
                >
                  {block.type === "cta" ? (
                    <CTAEditor
                      blockId={block.id}
                      initialContent={block.content as Partial<CTABlockContent>}
                      onContentChange={(content) => {
                        console.log("CTA content changed:", content);
                      }}
                      onSave={async (content) => {
                        const result = await saveCTABlock(templateId, block.id, content);
                        if (result.success) {
                          toast.success(result.message || "CTA salvo com sucesso!");
                        } else {
                          toast.error(result.error || "Erro ao salvar CTA");
                        }
                      }}
                    />
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      <p>Formulário de edição para {block.type} (em desenvolvimento)</p>
                    </div>
                  )}
                </ContentBlock>
              ))}
            </Accordion>
          </SortableContext>
        </DndContext>
      )}

      {/* SEÇÃO 3: Botão Adicionar (Fixo) */}
      <Button
        variant="outline"
        className="w-full border-dashed border-2 h-[62px] hover:bg-input rounded-xl"
        onClick={onAddBlock}
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Bloco de Conteúdo
      </Button>

      {/* SEÇÃO 4: Menu Mobile (Fixo Base) */}
      <Accordion type="single" collapsible>
        <ContentBlock
          id={menuBlock.id}
          type={menuBlock.type}
          title={menuBlock.title}
          subtitle={menuBlock.subtitle}
          clickCount={menuBlock.clickCount}
          isActive={menuBlock.isActive}
          isDraggable={false}
          onToggle={handleMenuToggle}
          icon={menuBlock.icon}
        >
          <div className="text-sm space-y-2 text-primary-foreground/90">
            <p>Configure os links de navegação que aparecerão na base do perfil.</p>
          </div>
        </ContentBlock>
      </Accordion>
    </div>
  );
}