"use client";

import React, { useCallback } from "react";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContentBlock } from "./ContentBlock";
import { HeroBlockEditor } from "@/components/editors/HeroBlockEditor";
import { updateHeroBlockContent } from "@/lib/actions/heroBlock.actions";
import { heroBlockContentSchema, type HeroBlockContent } from "@/schemas/heroBlock.schemas";
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
  onFormValuesChange?: (values: HeroBlockContent) => void; // Nova prop para passar valores ao preview
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
}: BlockListContainerProps) {
  // Inicializar useForm no componente pai
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState,
  } = useForm<HeroBlockContent>({
    resolver: zodResolver(heroBlockContentSchema),
    defaultValues: {
      userName: heroBlock?.content?.userName || '',
      userInfo: heroBlock?.content?.userInfo || '',
      phoneNumber: heroBlock?.content?.phoneNumber || '',
      emailAddress: heroBlock?.content?.emailAddress || '',
      whatsappNumber: heroBlock?.content?.whatsappNumber || '',
      scheduleLink: heroBlock?.content?.scheduleLink || '',
      scheduleEnabled: heroBlock?.content?.scheduleEnabled || false,
      emailMode: heroBlock?.content?.emailMode || 'mailto',
      isHeaderEnabled: heroBlock?.content?.isHeaderEnabled || false,
      headerLogoWidth: heroBlock?.content?.headerLogoWidth || 80,
      headerMenuEnabled: heroBlock?.content?.headerMenuEnabled || false,
      isCTAEnabled: heroBlock?.content?.isCTAEnabled || false,
      styles: {
        blockBackgroundColor: heroBlock?.content?.styles?.blockBackgroundColor || '#ffffff',
        blockTitleColor: heroBlock?.content?.styles?.blockTitleColor || '#ffffff',
        blockSubtitleColor: heroBlock?.content?.styles?.blockSubtitleColor || '#ffffff',
        blockTextColor: heroBlock?.content?.styles?.blockTextColor || '#ffffff',
        blockLinkColor: heroBlock?.content?.styles?.blockLinkColor || '#0066cc',
        buttonBackgroundColor: heroBlock?.content?.styles?.buttonBackgroundColor || '#0066cc',
        buttonTextColor: heroBlock?.content?.styles?.buttonTextColor || '#ffffff',
        borderWidth: heroBlock?.content?.styles?.borderWidth || 0,
        borderColor: heroBlock?.content?.styles?.borderColor || '#000000',
        borderRadius: heroBlock?.content?.styles?.borderRadius || 'reto',
        borderStyle: heroBlock?.content?.styles?.borderStyle || 'solid',
        boxShadowHOffset: heroBlock?.content?.styles?.boxShadowHOffset || 0,
        boxShadowVOffset: heroBlock?.content?.styles?.boxShadowVOffset || 0,
        boxShadowBlur: heroBlock?.content?.styles?.boxShadowBlur || 0,
        boxShadowSpread: heroBlock?.content?.styles?.boxShadowSpread || 0,
        boxShadowColor: heroBlock?.content?.styles?.boxShadowColor || '#000000',
      },
    },
  });

  // Observar mudanças em tempo real
  const watchedValues = watch();

  // Notificar pai sobre mudanças (para passar ao preview)
  React.useEffect(() => {
    if (onFormValuesChange) {
      onFormValuesChange(watchedValues);
    }
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

  // Estabilizar função de save do Hero Block
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
          onToggle={(isActive) => onToggleBlock(heroBlock.id, isActive)}
          icon={heroBlock.icon}
        >
          <HeroBlockEditor
            templateId={templateId}
            blockData={heroBlock}
            register={register}
            control={control}
            handleSubmit={handleSubmit}
            formState={formState}
            watch={watch}
            onSave={handleSaveHeroBlock}
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
                  onToggle={(isActive) => onToggleBlock(block.id, isActive)}
                  onDelete={() => onDeleteBlock(block.id)}
                  icon={block.icon}
                >
                  <div className="text-sm text-muted-foreground">
                    <p>Formulário de edição para {block.type} (em desenvolvimento)</p>
                  </div>
                </ContentBlock>
              ))}
            </Accordion>
          </SortableContext>
        </DndContext>
      )}

      {/* SEÇÃO 3: Botão Adicionar (Fixo) */}
      <Button
        variant="outline"
        className="w-full border-dashed border-2 h-[62px] hover:bg-accent rounded-xl"
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
          onToggle={(isActive) => onToggleBlock(menuBlock.id, isActive)}
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
