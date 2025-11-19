'use client';

import React, { useState, useEffect } from "react";
import { Unit, Address, DigitalTemplate } from "@prisma/client";
import { useHeader } from "@/context/HeaderContext";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import Link from "next/link";
import { UnitCard } from "@/components/application/units/UnitCard";
import { UnitForm } from "@/components/application/units/UnitForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface UnitsClientProps {
    units: Unit[];
    templates: DigitalTemplate[];
    addresses: Address[];
    workspaceSlug: string;
}

const CARDS_PER_PAGE = 5; // 5 units + 1 "New Unit" card = 6 items total

export function UnitsClient({ units, templates, addresses, workspaceSlug }: UnitsClientProps) {
    const t = useTranslations("units");
    const router = useRouter();
    const { setPrimaryTitle, setSecondaryHeaderContent } = useHeader();
    const [currentPage, setCurrentPage] = useState(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<Unit | undefined>(undefined);

    const itemsOnFirstPage = CARDS_PER_PAGE;
    const itemsOnOtherPages = CARDS_PER_PAGE + 1;
    const pageSize = 6;

    const startIndex = currentPage === 1 ? 0 : (itemsOnFirstPage + (currentPage - 2) * itemsOnOtherPages);
    const endIndex = currentPage === 1 ? itemsOnFirstPage : (startIndex + itemsOnOtherPages);
    const currentUnits = units.slice(startIndex, endIndex);

    const totalPages = units.length <= itemsOnFirstPage
        ? 1
        : 1 + Math.ceil((units.length - itemsOnFirstPage) / itemsOnOtherPages);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleEditUnit = (unit: Unit) => {
        setSelectedUnit(unit);
        setIsDialogOpen(true);
    };

    const handleDeleteUnit = async (unit: Unit) => {
        try {
            const { deleteUnit } = await import("@/actions/unit.actions");
            await deleteUnit(workspaceSlug, unit.id);
            toast.success("Unidade deletada com sucesso!");
            router.refresh();
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Erro ao deletar unidade"
            );
        }
    };

    const handleSuccess = () => {
        setIsDialogOpen(false);
        setSelectedUnit(undefined);
        // Refresh the page to show updated data
        router.refresh();
    };

    const handleCancel = () => {
        setIsDialogOpen(false);
        setSelectedUnit(undefined);
    };

    /**
     * Atualizar headers dinâmicos ao montar/desmontar o componente.
     * Responsável por setar título primário e conteúdo secundário (breadcrumb + botão).
     */
    useEffect(() => {
        // Definir título primário
        setPrimaryTitle(t("title"));

        // Definir conteúdo secundário com breadcrumb e botão de ação
        setSecondaryHeaderContent(
            <div className="flex items-center justify-between w-full gap-4">
                {/* Lado Esquerdo: Breadcrumb */}
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href={`/app/${workspaceSlug}`}>
                                    Workspace
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            {t("title")}
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Lado Direito: Botão de Ação */}
                <Button
                    onClick={() => {
                        setSelectedUnit(undefined);
                        setIsDialogOpen(true);
                    }}
                    size="sm"
                    className="flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    {t("new_unit")}
                </Button>
            </div>
        );

        // Cleanup: Resetar headers ao desmontar
        return () => {
            setPrimaryTitle("");
            setSecondaryHeaderContent(null);
        };
    }, [setPrimaryTitle, setSecondaryHeaderContent, workspaceSlug, t]);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* New Unit Card - Only on Page 1 */}
                {currentPage === 1 && (
                    <Card
                        className="flex flex-col items-center justify-center h-full min-h-[300px] border-dashed border-2 cursor-pointer hover:border-primary hover:bg-accent/50 transition-colors group"
                        onClick={() => {
                            setSelectedUnit(undefined);
                            setIsDialogOpen(true);
                        }}
                    >
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors mb-4">
                            <Plus className="h-6 w-6 text-primary" />
                        </div>
                        <span className="font-medium text-primary">{t("new_unit")}</span>
                    </Card>
                )}

                {/* Unit Cards */}
                {currentUnits.map((unit) => (
                    <div key={unit.id} className="h-full min-h-[300px]">
                        <UnitCard
                            unit={unit}
                            onEdit={handleEditUnit}
                            onDelete={handleDeleteUnit}
                        />
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>

                            {Array.from({ length: totalPages }).map((_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                        isActive={currentPage === i + 1}
                                        onClick={() => handlePageChange(i + 1)}
                                        className="cursor-pointer"
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}

            {/* Unit Form Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedUnit ? t("form_title_edit") : t("form_title_create")}
                        </DialogTitle>
                    </DialogHeader>
                    <UnitForm
                        workspaceSlug={workspaceSlug}
                        templates={templates}
                        addresses={addresses}
                        initialData={selectedUnit}
                        onSuccess={handleSuccess}
                        onCancel={handleCancel}
                        onOpenAddressModal={() => {
                            setIsDialogOpen(false);
                            setIsAddressModalOpen(true);
                        }}
                    />
                </DialogContent>
            </Dialog>

            {/* Address Modal (Placeholder) */}
            <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Criar Novo Endereço</DialogTitle>
                    </DialogHeader>
                    <div className="py-8 text-center">
                        <p className="text-muted-foreground">
                            Modal de criação de endereço será implementado aqui.
                        </p>
                        <Button
                            className="mt-4"
                            onClick={() => setIsAddressModalOpen(false)}
                        >
                            Fechar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
