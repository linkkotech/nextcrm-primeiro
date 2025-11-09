import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface BadgeWithDotProps {
  color?: "success" | "warning" | "error" | "info";
  type?: "modern" | "classic";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  className?: string;
}

export function BadgeWithDot({
  color = "success",
  type = "modern",
  size = "sm",
  children,
  className,
}: BadgeWithDotProps) {
  const colorClasses = {
    success: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400",
    warning: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
    error: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
    info: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  const dotColorClasses = {
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        type === "modern" && "gap-1.5",
        colorClasses[color],
        sizeClasses[size],
        className
      )}
    >
      {type === "modern" && (
        <span className={cn("h-1.5 w-1.5 rounded-full", dotColorClasses[color])} />
      )}
      {children}
    </span>
  );
}


