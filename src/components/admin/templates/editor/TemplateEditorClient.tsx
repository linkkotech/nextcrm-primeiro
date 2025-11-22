"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { useHeader } from "@/context/HeaderContext";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { EditorLayout } from "./EditorLayout";
import type { DigitalTemplate, TemplateBlock } from "@prisma/client";

interface TemplateEditorClientProps {
    template: DigitalTemplate & {
        blocks: TemplateBlock[];
    };
}

/**
 * Template Editor Client Component
 * 
 * Gerencia headers dinâmicos e renderiza o layout do editor.
 * Usa useHeader() para configurar título e ações sem duplicar layout.
 */
export function TemplateEditorClient({ template }: TemplateEditorClientProps) {
    const { setPrimaryTitle, setSecondaryHeaderContent } = useHeader();
    const locale = useLocale();

    useEffect(() => {
        // Configurar header primário (nome do template)
        setPrimaryTitle(template.name);

        // Configurar header secundário (breadcrumb + ações)
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
                            <BreadcrumbLink href={`/${locale}/admin/digital-templates`}>
                                Templates Digitais
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{template.name}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Botão Salvar - Lado Direito */}
                <Button size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                </Button>
            </div>
        );

        // Cleanup ao desmontar
        return () => {
            setPrimaryTitle("");
            setSecondaryHeaderContent(null);
        };
    }, [setPrimaryTitle, setSecondaryHeaderContent, locale, template.name]);

    return <EditorLayout templateId={template.id} templateName={template.name} blocks={template.blocks} />;
}
