"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Globe, Link2, MapPin, Megaphone, Menu, Music, QrCode, Share2 } from "lucide-react";
import { BlockListContainer } from "./BlockListContainer";
import { AddBlockSheet } from "@/components/admin/digital-templates/editor/AddBlockSheet";
import { HeroBlockContent } from "@/schemas/heroBlock.schemas";

interface Block {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  clickCount?: number;
  isActive: boolean;
  content: HeroBlockContent | Record<string, unknown>;
  icon: React.ReactNode;
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

function resolveBlockMeta(blockType: string) {
  if (blockType in BLOCK_TYPE_CONFIG) {
    return BLOCK_TYPE_CONFIG[blockType as BlockType];
  }

  return FALLBACK_BLOCK_META;
}

interface ContentEditorProps {
  templateId: string;
  initialContent: HeroBlockContent;
  onHeroValuesChange?: (values: HeroBlockContent) => void;
}

export function ContentEditor({ templateId, initialContent, onHeroValuesChange }: ContentEditorProps) {
  const [dynamicBlocks, setDynamicBlocks] = useState<Block[]>([]);
  const [isAddBlockSheetOpen, setIsAddBlockSheetOpen] = useState(false);

  // Carregar blocos dinâmicos do banco de dados
  useEffect(() => {
    const content = initialContent as any;
    if (content?.dynamicBlocks && Array.isArray(content.dynamicBlocks)) {
      const loadedBlocks: Block[] = content.dynamicBlocks.map((dbBlock: any) => {
        const meta = resolveBlockMeta(dbBlock.type);
        return {
          id: dbBlock.id,
          type: dbBlock.type,
          title: meta.title,
          subtitle: meta.subtitle,
          isActive: dbBlock.isActive ?? true,
          content: dbBlock.content || {},
          icon: meta.icon(),
        };
      });
      setDynamicBlocks(loadedBlocks);
    }
  }, [initialContent]);
  
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
  const heroBlock: Block = useMemo(() => ({
    id: "hero",
    type: "hero",
    title: "Hero Section",
    subtitle: "Este é o bloco Hero inicial do Perfil Digital.",
    isActive: heroActive,
    content: initialContent || {},
    icon: <Music className="h-5 w-5" />,
  }), [heroActive, initialContent]);

  const menuBlock: Block = useMemo(() => ({
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

    const newBlock: Block = {
      id: generateId(),
      type: blockIdentifier,
      title: meta.title,
      subtitle: meta.subtitle,
      clickCount: isLink ? 0 : undefined,
      isActive: true,
      content: {},
      icon: meta.icon(),
    };
    setDynamicBlocks((prev) => [...prev, newBlock]);
    setIsAddBlockSheetOpen(false);
  }, [customBlockOptions]);

  const handleCTAToggle = useCallback((enabled: boolean) => {
    if (enabled) {
      // Verificar se já existe um bloco CTA
      const ctaExists = dynamicBlocks.some(block => block.type === 'cta');
      if (!ctaExists) {
        const meta = resolveBlockMeta('cta');
        const newCTABlock: Block = {
          id: generateId(),
          type: 'cta',
          title: meta.title,
          subtitle: meta.subtitle,
          isActive: true,
          content: {
            ctaText: 'AGENDAR UMA REUNIÃO',
            destinationUrl: '',
            primaryColor: '#FFFF00',
            secondaryColor: '#FF0000',
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
    <div className="p-6 max-w-2xl mx-auto space-y-6">
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