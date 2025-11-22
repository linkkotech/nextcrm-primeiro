"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
    Boxes,
    Columns3,
    Container,
    GalleryVerticalEnd,
    Heading1,
    Image as ImageIcon,
    LayoutPanelLeft,
    Rows3,
    Square,
    Text as TextIcon,
    Type,
    Video,
} from "lucide-react";

const ELEMENT_GROUPS = [
    {
        title: "Layout",
        items: [
            { key: "section", label: "Section", icon: LayoutPanelLeft },
            { key: "container", label: "Container", icon: Container },
            { key: "div", label: "Div", icon: Square },
            { key: "h-flex", label: "H Flex", icon: Rows3 },
            { key: "v-flex", label: "V Flex", icon: Columns3 },
            { key: "grid", label: "Grid", icon: GalleryVerticalEnd },
        ],
    },
    {
        title: "Basic",
        items: [
            { key: "heading", label: "Heading", icon: Heading1 },
            { key: "text", label: "Text", icon: TextIcon },
            { key: "rich-text", label: "Rich text", icon: Type },
            { key: "button", label: "Button", icon: Boxes },
            { key: "image", label: "Image", icon: ImageIcon },
            { key: "video", label: "Video", icon: Video },
            { key: "icon", label: "Icon", icon: Square },
            { key: "number", label: "Number", icon: Container },
        ],
    },
];

interface BlockBuilderModalProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

/**
 * BlockBuilderModal renders a compact element palette for the block builder.
 * Contains draggable primitive elements organized by category (Layout, Basic).
 * Designed to be used alongside the main canvas and inspector in BlockEditorClient.
 */
export function BlockBuilderModal({ open, onOpenChange }: BlockBuilderModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm p-0 gap-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle>Adicionar Elemento</DialogTitle>
                    <DialogDescription>
                        Arraste elementos para o canvas para construir seu bloco.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-6">
                        {ELEMENT_GROUPS.map(group => (
                            <section key={group.title}>
                                <div className="flex items-center gap-2 mb-3">
                                    <h3 className="text-sm font-semibold text-foreground">{group.title}</h3>
                                    <Separator className="flex-1" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {group.items.map(item => (
                                        <button
                                            key={item.key}
                                            type="button"
                                            draggable
                                            className="flex h-20 flex-col items-center justify-center gap-2 rounded-xl border border-muted bg-card text-xs font-medium text-foreground shadow-sm transition hover:border-primary hover:text-primary hover:shadow-md cursor-grab active:cursor-grabbing"
                                        >
                                            <item.icon className="h-5 w-5 text-muted-foreground" />
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
