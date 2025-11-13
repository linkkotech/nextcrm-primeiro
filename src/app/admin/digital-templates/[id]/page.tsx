import { prisma } from "@/lib/prisma";
import { EditorLayout } from "@/components/admin/digital-templates/editor/EditorLayout";
import { TemplateEditorContainer } from "@/components/admin/digital-templates/editor/TemplateEditorContainer";
import { notFound } from "next/navigation";

interface TemplateEditorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TemplateEditorPage({ params }: TemplateEditorPageProps) {
  const { id } = await params;
  
  // Buscar dados do template do banco de dados
  const template = await prisma.digitalTemplate.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      type: true,
      content: true,
    },
  });

  if (!template) {
    notFound();
  }

  return (
    <TemplateEditorContainer>
      <EditorLayout templateId={id} initialContent={template.content} />
    </TemplateEditorContainer>
  );
}
