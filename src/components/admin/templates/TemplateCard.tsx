"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { MoreVertical, Pencil, Trash2, Layers, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Template {
    id: string;
    name: string;
    description: string | null;
    type: "profile_template" | "content_block";
    createdAt: Date;
    blocks: { id: string }[];
    createdByUser: {
        name: string | null;
        email: string | null;
    };
    _count: {
        blocks: number;
        usedInProfiles: number;
    };
}

interface TemplateCardProps {
    template: Template;
}

export function TemplateCard({ template }: TemplateCardProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const locale = useLocale();
    const firstBlockId = template.blocks?.[0]?.id;

    const editHref = template.type === "profile_template"
        ? `/${locale}/admin/digital-templates/${template.id}`
        : firstBlockId
            ? `/${locale}/admin/editor/${firstBlockId}`
            : "";
    const editDisabled = !editHref;

    return (
        <>
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-4">
                    {/* Header: Nome + Menu */}
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg line-clamp-1">
                                {template.name}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {template.description || "Sem descrição"}
                            </p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">Abrir menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild disabled={editDisabled}>
                                    {editHref ? (
                                        <Link href={editHref}>
                                            <Pencil className="h-4 w-4 mr-2" />
                                            Editar
                                        </Link>
                                    ) : (
                                        <span className="flex items-center opacity-60 cursor-not-allowed">
                                            <Pencil className="h-4 w-4 mr-2" />
                                            Editar
                                        </span>
                                    )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => setDeleteDialogOpen(true)}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remover
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                                <Layers className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground">Blocos</p>
                                <p className="text-sm font-medium">{template._count.blocks}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-md bg-blue-500/10 flex items-center justify-center">
                                <Users className="h-4 w-4 text-blue-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground">Usado em</p>
                                <p className="text-sm font-medium">{template._count.usedInProfiles} perfis</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer: Tipo + Criador */}
                    <div className="flex items-center justify-between gap-2 pt-4 border-t">
                        <span className="text-xs text-muted-foreground truncate">
                            Por: {template.createdByUser.name || "Desconhecido"}
                        </span>
                        <Badge variant={template.type === "profile_template" ? "default" : "secondary"} className="text-xs">
                            {template.type === "profile_template" ? "Perfil" : "Bloco"}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
