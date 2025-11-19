import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Factory } from "lucide-react";
import { Unit } from "@prisma/client";

interface UnitCardProps {
    unit: Unit;
    onEdit?: (unit: Unit) => void;
    onDelete?: (unit: Unit) => void;
}

export function UnitCard({ unit, onEdit, onDelete }: UnitCardProps) {
    return (
        <Card className="overflow-hidden flex flex-col h-full">
            {/* Header / Image Placeholder */}
            <div className="h-32 bg-muted flex items-center justify-center">
                <Factory className="h-12 w-12 text-muted-foreground/50" />
            </div>

            {/* Content */}
            <CardContent className="flex-1 p-4 pt-4">
                <div className="mb-2">
                    <h3 className="font-semibold text-lg truncate" title={unit.name}>
                        {unit.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {unit.isActive ? "Ativa" : "Inativa"}
                    </p>
                </div>

                <div className="text-sm text-muted-foreground space-y-2 mt-4">
                    <p>
                        <span className="font-medium">ID:</span> {unit.id}
                    </p>
                    <p>
                        <span className="font-medium">Criado em:</span>{" "}
                        {new Date(unit.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                </div>
            </CardContent>

            {/* Footer / Actions */}
            <CardFooter className="p-4 flex gap-2 border-t bg-muted/10 mt-auto items-center justify-center">
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 gap-2 text-muted-foreground hover:text-primary"
                    onClick={() => onEdit?.(unit)}
                >
                    <Edit className="h-4 w-4" />
                    Edit
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 gap-2 text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete?.(unit)}
                >
                    <Trash2 className="h-4 w-4" />
                    Delete
                </Button>
            </CardFooter>
        </Card>
    );
}
