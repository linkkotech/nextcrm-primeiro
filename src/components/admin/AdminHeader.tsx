"use client";

import { Menu, X } from "lucide-react";
import { Button } from "@/components/untitled/Button";
import { cn } from "@/lib/utils";

interface AdminHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  title?: string;
}

export function AdminHeader({
  sidebarOpen,
  onToggleSidebar,
  title,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-background px-4 lg:px-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleSidebar}
        className="lg:hidden"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>
      
      {title && (
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      )}
    </header>
  );
}


