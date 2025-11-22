import { getDigitalTemplateById } from "@/services/template.actions";
import { notFound } from "next/navigation";
import { TemplateEditorClient } from "@/components/admin/templates/editor/TemplateEditorClient";

interface PageProps {
    params: Promise<{
        locale: string;
        templateId: string;
    }>;
}

/**
 * Template Editor Page (Server Component)
 * 
 * Responsabilidades:
 * - Buscar dados do template do banco de dados
 * - Validar existência do template (notFound se não existir)
 * - Renderizar TemplateEditorClient (que gerencia headers)
 * 
 * NÃO renderiza layout próprio:
 * - AdminLayoutClient já fornece SidebarProvider + AdminSidebar + SidebarInset
 * - Headers são gerenciados via useHeader() no TemplateEditorClient
 * - Evita duplicação de layout ("double dashboard")
 */
export default async function TemplateEditorPage({ params }: PageProps) {
    const { templateId } = await params;
    const template = await getDigitalTemplateById(templateId);

    if (!template) {
        notFound();
    }

    return <TemplateEditorClient template={template} />;
}
