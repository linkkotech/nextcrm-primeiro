"use client";

import { useEffect, useMemo, useState } from "react";
import { Globe, Info, Link2, MapPin, Megaphone, QrCode, Share2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { BlockTypeCard } from "./BlockTypeCard";

const BLOCK_OPTIONS = [
  {
    value: "link",
    title: "Link",
    description: "Direcione para páginas externas ou campanhas.",
    icon: <Link2 className="h-5 w-5" />,
  },
  {
    value: "cta",
    title: "CTA (Call to Action)",
    description: "Botão de chamada para ação com design destacado em camadas.",
    icon: <Megaphone className="h-5 w-5" />,
  },
  {
    value: "website",
    title: "Website",
    description: "Realce seu site institucional em destaque.",
    icon: <Globe className="h-5 w-5" />,
  },
  {
    value: "social",
    title: "Redes Sociais",
    description: "Agrupe links das principais redes em um só lugar.",
    icon: <Share2 className="h-5 w-5" />,
  },
  {
    value: "address",
    title: "Endereço / Mapa",
    description: "Exiba informações de contato e mapa dinâmico.",
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    value: "qr",
    title: "Código QR",
    description: "Crie acessos rápidos por meio de QR Codes.",
    icon: <QrCode className="h-5 w-5" />,
  },
] as const;

interface AddBlockSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBlockSelect: (blockType: string) => void;
  customBlocks?: { value: string; label: string }[];
}

export function AddBlockSheet({
  open,
  onOpenChange,
  onBlockSelect,
  customBlocks = [],
}: AddBlockSheetProps) {
  const [selectedBlockType, setSelectedBlockType] = useState("");
  const [selectedCustomBlock, setSelectedCustomBlock] = useState("");

  const isConfirmDisabled = !selectedBlockType && !selectedCustomBlock;
  const hasCustomBlocks = customBlocks.length > 0;

  useEffect(() => {
    if (!open) {
      setSelectedBlockType("");
      setSelectedCustomBlock("");
    }
  }, [open]);

  const customBlockPlaceholder = useMemo(() => {
    if (!hasCustomBlocks) {
      return "Nenhum bloco personalizado disponível";
    }
    return "Selecione um bloco reutilizável";
  }, [hasCustomBlocks]);

  const handleConfirm = () => {
    const blockToAdd = selectedCustomBlock || selectedBlockType;

    if (!blockToAdd) {
      return;
    }

    onBlockSelect(blockToAdd);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Tipos de Conteúdo</SheetTitle>
          <SheetDescription>
            Escolha o tipo de bloco que deseja inserir no seu Perfil Digital.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-6 pr-2">
          <Alert className="border-primary/20 bg-primary/5 text-primary">
            <Info className="h-4 w-4" />
            <AlertTitle>Personalize depois</AlertTitle>
            <AlertDescription>
              Selecione o bloco ideal e configure detalhes como links, textos e mídia na etapa seguinte.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <RadioGroup
              value={selectedBlockType}
              onValueChange={(value) => {
                setSelectedBlockType(value);
                setSelectedCustomBlock("");
              }}
              className="grid gap-3"
            >
              {BLOCK_OPTIONS.map((option) => (
                <BlockTypeCard
                  key={option.value}
                  value={option.value}
                  title={option.title}
                  description={option.description}
                  icon={option.icon}
                  selected={selectedBlockType === option.value}
                />
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Blocos de Conteúdo Personalizados
              </p>
              <p className="text-xs text-muted-foreground">
                Reutilize blocos aprovados pela sua equipe sem começar do zero.
              </p>
            </div>
            <Select
              value={selectedCustomBlock}
              onValueChange={(value) => {
                setSelectedCustomBlock(value);
                setSelectedBlockType("");
              }}
              disabled={!hasCustomBlocks}
            >
              <SelectTrigger>
                <SelectValue placeholder={customBlockPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {hasCustomBlocks ? (
                  customBlocks.map((customBlock) => (
                    <SelectItem key={customBlock.value} value={customBlock.value}>
                      {customBlock.label}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    Nenhum bloco cadastrado
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className="flex flex-row gap-2 sm:space-x-0 pt-4 border-t">
          <Button variant="outline" className="flex-1" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button className="flex-1" onClick={handleConfirm} disabled={isConfirmDisabled}>
            Selecionar e Adicionar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
