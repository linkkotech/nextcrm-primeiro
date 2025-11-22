"use client";

import Link from "next/link";
import { TemplateBlock } from "@prisma/client";
import { MoreVertical, Edit, Trash, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ContentBlock({ block }: { block: TemplateBlock }) {
    return (
        <div className="flex items-center gap-4 p-4 bg-card border rounded-lg mb-3 group hover:border-primary/50 transition-colors">
            <GripVertical className="h-5 w-5 text-muted-foreground cursor-move opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex-1">
                <h4 className="font-medium text-sm">{block.type}</h4>
                <p className="text-xs text-muted-foreground">ID: {block.id.slice(-8)}</p>
            </div>

            <div className="flex items-center gap-2">
                <Switch checked={block.isActive} />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/editor/${block.id}`} className="flex items-center cursor-pointer">
                                <Edit className="h-4 w-4 mr-2" />
                                Editar Bloco
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
                            <Trash className="h-4 w-4 mr-2" />
                            Excluir
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
