"use client";

import type { Block } from "@/types/editor";
import type { TemplateType } from "@prisma/client";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Globe, Link2, MapPin, Megaphone, Menu, Music, QrCode, Share2 } from "lucide-react";
import { BlockListContainer } from "./BlockListContainer";
import { AddBlockSheet } from "@/components/admin/digital-templates/editor/AddBlockSheet";
import { HeroBlockContent } from "@/schemas/heroBlock.schemas";

/**
 * Tipo interno para representação de blocos na UI do ContentEditor
 * Define estrutura independente para necessidades específicas de UI (icon, title, subtitle)
 * type é string para permitir identificadores customizados ('cta', 'link', etc.)
 */
interface UIBlock {
  id: string;
  type: string;
  title?: string;
  subtitle?: string;
  clickCount?: number;
  isActive: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: Record<string, any>;
  icon?: React.ReactNode;
}

type BlockType = "link" | "cta" | "website" | "social" | "address" | "qr";

const BLOCK_TYPE_CONFIG: Record<BlockType, { title: string; subtitle: string; icon: () => React.ReactNode }> = {
  link: {
    title: "Link Externo",
    subtitle: "Nenhuma URL definida",
    icon: () => <Link2 className="h-5 w-5" />,
  },
  cta: {
    title: "CTA (Call to Action)",
    subtitle: "Link Externo",
    icon: () => <Megaphone className="h-5 w-5" />,
  },
  website: {
    title: "Website",
    subtitle: "Direcione visitantes para o seu site",
    icon: () => <Globe className="h-5 w-5" />,
  },
  social: {
    title: "Redes Sociais",
    subtitle: "Agrupe perfis do Instagram, TikTok e outros",
    icon: () => <Share2 className="h-5 w-5" />,
  },
  address: {
    title: "Endereço & Mapa",
    subtitle: "Mostre localização e informações de contato",
    icon: () => <MapPin className="h-5 w-5" />,
  },
  qr: {
    title: "Código QR",
    subtitle: "Gere acessos rápidos via QR Code",
    icon: () => <QrCode className="h-5 w-5" />,
  },
};

let blockCounter = 0;

function generateId(): string {
  return `block-${++blockCounter}`;
}

const FALLBACK_BLOCK_META = {
  title: "Bloco Personalizado",
  subtitle: "Configure este bloco personalizado nas próximas etapas.",
  icon: () => <Music className="h-5 w-5" />,
};

function resolveBlockMeta(blockType: TemplateType | string) {
  const typeString = String(blockType);
  if (typeString in BLOCK_TYPE_CONFIG) {
    return BLOCK_TYPE_CONFIG[typeString as BlockType];
  }

  return FALLBACK_BLOCK_META;
}

interface ContentEditorProps {
  templateId: string;
  initialContent: HeroBlockContent;
  onHeroValuesChange?: (values: HeroBlockContent) => void;
  onDynamicBlocksChange?: (blocks: Block[]) => void;
}

export function ContentEditor({ templateId, initialContent, onHeroValuesChange, onDynamicBlocksChange }: ContentEditorProps) {
  const [dynamicBlocks, setDynamicBlocks] = useState<UIBlock[]>([]);
  const [isAddBlockSheetOpen, setIsAddBlockSheetOpen] = useState(false);

  // Função auxiliar para converter UIBlock para Block
  const convertToBlock = useCallback((uiBlock: UIBlock): Block => ({
    id: uiBlock.id,
    name: uiBlock.title || 'Sem título',
    description: uiBlock.subtitle || null,
    type: 'content_block' as TemplateType,
    content: uiBlock.content,
    workspaceId: null,
    createdByUserId: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  }), []);

  // Carregar blocos dinâmicos do banco de dados
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content = initialContent as any;
    if (content?.dynamicBlocks && Array.isArray(content.dynamicBlocks)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const loadedBlocks: UIBlock[] = (content.dynamicBlocks as any[]).map((dbBlock: any) => {
        const blockType = String(dbBlock.type);
        const meta = resolveBlockMeta(blockType);
        return {
          id: String(dbBlock.id),
          type: blockType,
          title: meta.title,
          subtitle: meta.subtitle,
          isActive: Boolean(dbBlock.isActive ?? true),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          content: (dbBlock.content as any) || {},
          icon: meta.icon(),
        };
      });
      setDynamicBlocks(loadedBlocks);
      // Converter para Block[] ao passar para o callback
      onDynamicBlocksChange?.(loadedBlocks.map(convertToBlock));
    }
  }, [initialContent, onDynamicBlocksChange, convertToBlock]);
  
  // ✅ SOLUÇÃO: Estado separado para blocos fixos
  const [heroActive, setHeroActive] = useState(true);
  const [menuActive, setMenuActive] = useState(true);

  const customBlockOptions = useMemo(
    () => [
      { value: "custom-announcement", label: "Banner de Anúncio" },
      { value: "custom-faq", label: "FAQ Interativo" },
    ],
    []
  );

  // ✅ Blocos fixos usando estado controlado
  const heroBlock: UIBlock = useMemo(() => ({
    id: "hero",
    type: "hero",
    title: "Hero Section",
    subtitle: "Este é o bloco Hero inicial do Perfil Digital.",
    isActive: heroActive,
    content: initialContent || {},
    icon: <Music className="h-5 w-5" />,
  }), [heroActive, initialContent]);

  const menuBlock: UIBlock = useMemo(() => ({
    id: "menu-mobile",
    type: "menu",
    title: "Menu Mobile",
    subtitle: "Este é o bloco do Menu Mobile do seu Perfil Digital.",
    isActive: menuActive,
    content: {},
    icon: <Menu className="h-5 w-5" />,
  }), [menuActive]);

  const handleAddBlockClick = useCallback(() => {
    setIsAddBlockSheetOpen(true);
  }, []);

  const handleAddBlock = useCallback((blockIdentifier: string) => {
    const customOption = customBlockOptions.find((option) => option.value === blockIdentifier);
    const meta = customOption
      ? {
          title: customOption.label,
          subtitle: "Conteúdo reutilizável pronto para ajuste.",
          icon: () => <Music className="h-5 w-5" />,
        }
      : resolveBlockMeta(blockIdentifier);

    const isLink = blockIdentifier === "link";

    const newBlock: UIBlock = {
      id: generateId(),
      type: blockIdentifier,
      title: meta.title,
      subtitle: meta.subtitle,
      clickCount: isLink ? 0 : undefined,
      isActive: true,
      content: {},
      icon: meta.icon(),
    };
    setDynamicBlocks((prev) => {
      const updated = [...prev, newBlock];
      onDynamicBlocksChange?.(updated.map(convertToBlock));
      return updated;
    });
    setIsAddBlockSheetOpen(false);
  }, [customBlockOptions, onDynamicBlocksChange, convertToBlock]);

  const handleCTAToggle = useCallback((enabled: boolean) => {
    if (enabled) {
      // Verificar se já existe um bloco CTA
      const ctaExists = dynamicBlocks.some(block => block.type === 'cta');
      if (!ctaExists) {
        const meta = resolveBlockMeta('cta');
        const newCTABlock: UIBlock = {
          id: generateId(),
          type: 'cta',
          title: meta.title,
          subtitle: meta.subtitle,
          isActive: true,
          content: {
            ctaText: 'AGENDAR UMA REUNIÃO',
            destinationUrl: '',
            primaryColor: '#373F4B',
            secondaryColor: '#9CA3AF',
          },
          icon: meta.icon(),
        };
        setDynamicBlocks((prev) => [newCTABlock, ...prev]);
      }
    } else {
      // Remover bloco CTA se existir
      setDynamicBlocks((prev) => prev.filter(block => block.type !== 'cta'));
    }
  }, [dynamicBlocks]);

  const handleDeleteBlock = useCallback(async (id: string) => {
    // Encontrar o bloco para verificar se é CTA
    const blockToDelete = dynamicBlocks.find(block => block.id === id);
    
    if (blockToDelete?.type === 'cta') {
      // Deletar do banco de dados
      const { deleteCTABlock } = await import('@/lib/actions/ctaBlock.actions');
      const result = await deleteCTABlock(templateId, id);
      
      if (!result.success) {
        const { toast } = await import('sonner');
        toast.error(result.error || 'Erro ao deletar CTA');
        return;
      }
    }
    
    // Remover do estado local
    setDynamicBlocks((prev) => prev.filter((block) => block.id !== id));
  }, [dynamicBlocks, templateId]);

  // ✅ SOLUÇÃO: Gerenciar estado dos blocos fixos também
  const handleToggleBlock = useCallback((id: string, isActive: boolean) => {
    if (id === "hero") {
      setHeroActive(isActive);
      return;
    }
    
    if (id === "menu-mobile") {
      setMenuActive(isActive);
      return;
    }
    
    // Para blocos dinâmicos
    setDynamicBlocks((prev) =>
      prev.map((block) => (block.id === id ? { ...block, isActive } : block))
    );
  }, []);

  const handleReorderBlocks = useCallback((reorderedBlocks: Block[]) => {
    setDynamicBlocks(reorderedBlocks);
  }, []);

  return (
    <div className="p-6 pr-2 w-full space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground">BLOCOS</h2>
      </div>

      {/* Block List Container */}
      <BlockListContainer
        templateId={templateId}
        heroBlock={heroBlock}
        menuBlock={menuBlock}
        dynamicBlocks={dynamicBlocks}
        onAddBlock={handleAddBlockClick}
        onReorderBlocks={handleReorderBlocks}
        onToggleBlock={handleToggleBlock}
        onDeleteBlock={handleDeleteBlock}
        onFormValuesChange={onHeroValuesChange}
        onCTAToggle={handleCTAToggle}
      />

      <AddBlockSheet
        open={isAddBlockSheetOpen}
        onOpenChange={setIsAddBlockSheetOpen}
        onBlockSelect={handleAddBlock}
        customBlocks={customBlockOptions}
      />
    </div>
  );
}