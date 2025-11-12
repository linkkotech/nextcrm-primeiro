"use client";

import { useState } from "react";
import { EditorSidebar } from "./EditorSidebar";
import { ContentEditor } from "./ContentEditor";
import { MobilePreview } from "./MobilePreview";

interface EditorLayoutProps {
  templateId: string;
}

export function EditorLayout({ templateId }: EditorLayoutProps) {
  const [activeSection, setActiveSection] = useState<"content" | "design" | "settings" | "advanced">("content");

  return (
  <section className="h-full w-full overflow-hidden bg-background">
      <div className="flex h-full w-full min-h-0">
        {/* Left Sidebar */}
  <aside className="w-72 border-r border-border bg-card/30 h-full">
          <EditorSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        </aside>

        {/* Center Content Editor */}
        <main className="flex-1 overflow-y-auto min-h-0">
          <ContentEditor templateId={templateId} />
        </main>

        {/* Right Mobile Preview */}
        <aside className="w-96 border-l border-border bg-muted/30 px-6 py-6 flex flex-col h-full">
          <MobilePreview templateName="santinho" previewUrl="linqcard.app/santinho" />
        </aside>
      </div>
    </section>
  );
}
