"use client";

import { Link2, Type, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SelectBlockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectBlock: (blockType: string) => void;
}

const blockTypes = [
  {
    id: "link",
    label: "Link",
    description: "Adicione um link clicável",
    icon: Link2,
  },
  {
    id: "text",
    label: "Texto",
    description: "Adicione um bloco de texto",
    icon: Type,
  },
  {
    id: "image",
    label: "Imagem",
    description: "Adicione uma imagem",
    icon: Image,
  },
];

export function SelectBlockDialog({
  open,
  onOpenChange,
  onSelectBlock,
}: SelectBlockDialogProps) {
  const handleSelectBlock = (blockType: string) => {
    onSelectBlock(blockType);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Bloco de Conteúdo</DialogTitle>
          <DialogDescription>
            Selecione o tipo de bloco que deseja adicionar
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3">
          {blockTypes.map((block) => {
            const Icon = block.icon;
            return (
              <Button
                key={block.id}
                variant="outline"
                className="h-auto py-4 px-4 justify-start flex-col items-start"
                onClick={() => handleSelectBlock(block.id)}
              >
                <div className="flex items-center gap-3 w-full">
                  <Icon className="h-5 w-5" />
                  <div>
                    <div className="font-semibold text-sm">{block.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {block.description}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
