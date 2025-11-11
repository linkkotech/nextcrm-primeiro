import { EditorLayout } from "@/components/admin/digital-templates/editor/EditorLayout";
import { TemplateEditorContainer } from "@/components/admin/digital-templates/editor/TemplateEditorContainer";

interface TemplateEditorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TemplateEditorPage({ params }: TemplateEditorPageProps) {
  const { id } = await params;
  return (
    <TemplateEditorContainer>
      <EditorLayout templateId={id} />
    </TemplateEditorContainer>
  );
}
