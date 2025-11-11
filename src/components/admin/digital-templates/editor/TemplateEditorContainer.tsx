"use client";

import { ReactNode } from "react";

interface TemplateEditorContainerProps {
  children: ReactNode;
}

export function TemplateEditorContainer({ children }: TemplateEditorContainerProps) {
  return (
    <div className="-m-6 flex-1 overflow-hidden min-h-0">
      <div className="h-full w-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}
