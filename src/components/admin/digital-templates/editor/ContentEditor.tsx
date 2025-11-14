"use client";

import { useMemo, useState, useCallback } from "react";
import { Globe, Link2, MapPin, Menu, Music, QrCode, Share2 } from "lucide-react";
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

type BlockType = "link" | "website" | "social" | "address" | "qr";

const BLOCK_TYPE_CONFIG: Record<BlockType, { title: string; subtitle: string; icon: () => React.ReactNode }> = {
  link: {
    title: "Link Externo",
    subtitle: "Nenhuma URL definida",
    icon: () => <Link2 className="h-5 w-5" />,
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

  const handleDeleteBlock = useCallback((id: string) => {
    setDynamicBlocks((prev) => prev.filter((block) => block.id !== id));
  }, []);

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
      {/* Back Button */}
      <div className="flex items-center justify-between mb-6">
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          ← Voltar
        </button>
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