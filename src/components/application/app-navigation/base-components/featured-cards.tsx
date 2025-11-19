"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FeaturedCardProgressBarProps {
  title: string;
  description: string;
  confirmLabel: string;
  progress: number;
  className?: string;
  onDismiss?: () => void;
  onConfirm?: () => void;
}

export function FeaturedCardProgressBar({
  title,
  description,
  confirmLabel,
  progress,
  className,
  onDismiss,
  onConfirm,
}: FeaturedCardProgressBarProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg border border-brand-200 bg-brand-50 p-4 text-brand-700 dark-mode:border-brand-800 dark-mode:bg-brand-950/50 dark-mode:text-brand-400",
        className
      )}
    >
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute right-2 top-2 rounded-md p-1 text-brand-600 hover:bg-brand-100 dark-mode:text-brand-400 dark-mode:hover:bg-brand-900/50"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      
      <div className="pr-8">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="mt-1 text-xs">{description}</p>
        
        <div className="mt-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-brand-200 dark-mode:bg-brand-800">
            <div
              className="h-full rounded-full bg-brand-600 transition-all dark-mode:bg-brand-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between text-xs">
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="font-medium text-brand-600 hover:underline dark-mode:text-brand-400"
            >
              Dismiss
            </button>
          )}
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="ml-auto font-semibold text-brand-600 hover:underline dark-mode:text-brand-400"
            >
              {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


