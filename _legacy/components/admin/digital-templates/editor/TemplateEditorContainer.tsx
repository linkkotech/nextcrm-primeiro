"use client";

import { ReactNode } from "react";

interface TemplateEditorContainerProps {
  children: ReactNode;
}

export function TemplateEditorContainer({ children }: TemplateEditorContainerProps) {
  return (
    <div className="h-full w-full flex flex-col">
      {children}
    </div>
  );
}
