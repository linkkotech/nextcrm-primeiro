import { getDigitalTemplates } from "@/services/template.actions";
import { TemplatesPageClient } from "@/components/admin/templates/TemplatesPageClient";

export default async function DigitalTemplatesPage() {
    const templates = await getDigitalTemplates();

    return <TemplatesPageClient templates={templates} />;
}
