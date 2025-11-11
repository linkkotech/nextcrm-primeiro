"use client";

import { ReactNode } from "react";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface BlockTypeCardProps {
  value: string;
  title: string;
  description: string;
  icon: ReactNode;
  selected: boolean;
}

export function BlockTypeCard({ value, title, description, icon, selected }: BlockTypeCardProps) {
  return (
    <label
      htmlFor={value}
      className={cn(
        "group flex w-full cursor-pointer items-center gap-4 rounded-2xl border p-4 transition",
        selected ? "border-primary/60 bg-primary/10" : "border-border hover:border-primary/30 hover:bg-accent"
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <RadioGroupItem value={value} id={value} className="h-4 w-4 border-2" />
    </label>
  );
}