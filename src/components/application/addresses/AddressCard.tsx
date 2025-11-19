import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Building2 } from "lucide-react";
import { Address } from "@prisma/client";

interface AddressCardProps {
    address: Address;
    onEdit?: (address: Address) => void;
    onDelete?: (address: Address) => void;
}

export function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
    return (
        <Card className="overflow-hidden flex flex-col h-full">
            {/* Header / Image Placeholder */}
            <div className="h-32 bg-muted flex items-center justify-center">
                <Building2 className="h-12 w-12 text-muted-foreground/50" />
            </div>

            {/* Content */}
            <CardContent className="flex-1 p-4 pt-4">
                <div className="mb-2">
                    <h3 className="font-semibold text-lg truncate" title={address.name}>
                        {address.name}
                    </h3>
                    {address.label && (
                        <p className="text-sm text-muted-foreground truncate">{address.label}</p>
                    )}
                </div>

                <div className="text-sm text-muted-foreground space-y-1 mt-4">
                    <p className="line-clamp-2">
                        {address.street}, {address.number}
                        {address.complement && ` - ${address.complement}`}
                    </p>
                    <p>
                        {address.district}, {address.city} - {address.stateCode}
                    </p>
                    <p>{address.postalCode}</p>
                    <p>{address.country}</p>
                </div>
            </CardContent>

            {/* Footer / Actions */}
            <CardFooter className="p-4 flex gap-2 border-t bg-muted/10 mt-auto items-center justify-center">
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 gap-2 text-muted-foreground hover:text-primary"
                    onClick={() => onEdit?.(address)}
                >
                    <Edit className="h-4 w-4" />
                    Edit
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 gap-2 text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete?.(address)}
                >
                    <Trash2 className="h-4 w-4" />
                    Delete
                </Button>
            </CardFooter>
        </Card>
    );
}
