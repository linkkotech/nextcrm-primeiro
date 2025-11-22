"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { useHeader } from "@/context/HeaderContext";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { CreateTemplateSheet } from "./CreateTemplateSheet";
import { TemplatesCardView } from "./TemplatesCardView";

interface TemplatesPageClientProps {
    templates: any[];
}

export function TemplatesPageClient({ templates }: TemplatesPageClientProps) {
    const { setPrimaryTitle, setSecondaryHeaderContent } = useHeader();
    const locale = useLocale();

    useEffect(() => {
        // Configurar header primário
        setPrimaryTitle("Templates Digitais");

        // Configurar header secundário
        setSecondaryHeaderContent(
            <div className="flex items-center justify-between w-full">
                {/* Breadcrumb - Lado Esquerdo */}
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={`/${locale}/admin`}>Admin</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Templates Digitais</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Botão Novo Template - Lado Direito */}
                <CreateTemplateSheet />
            </div>
        );

        // Cleanup ao desmontar
        return () => {
            setPrimaryTitle("");
            setSecondaryHeaderContent(null);
        };
    }, [setPrimaryTitle, setSecondaryHeaderContent, locale]);

    return <TemplatesCardView templates={templates} />;
}
