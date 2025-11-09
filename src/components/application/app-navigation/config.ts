import { ComponentType } from "react";

export interface NavItemType {
  label: string;
  href: string;
  icon?: ComponentType<{ className?: string }>;
  badge?: number | React.ReactNode;
  items?: Omit<NavItemType, "items">[];
}


