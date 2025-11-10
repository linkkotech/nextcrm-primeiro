"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "@untitledui/icons";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItemType } from "../config";
import { Input } from "@/components/untitled/Input";

interface SidebarNavigationSimpleProps {
  items: NavItemType[];
  footerItems?: NavItemType[];
  featureCard?: React.ReactNode;
  userProfile?: React.ReactNode;
}

export function SidebarNavigationSimple({
  items,
  footerItems = [],
  featureCard,
  userProfile,
}: SidebarNavigationSimpleProps) {
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (href: string) => {
    setOpenItems((prev) =>
      prev.includes(href) ? prev.filter((item) => item !== href) : [...prev, href]
    );
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const hasActiveChild = (item: NavItemType): boolean => {
    if (isActive(item.href)) return true;
    if (item.items) {
      return item.items.some((child) => isActive(child.href) || hasActiveChild(child as NavItemType));
    }
    return false;
  };

  return (
    <div className="flex h-screen w-72 flex-col border-r border-border bg-background">
      {/* Logo e Search */}
      <div className="border-b border-border p-4">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700">
            <span className="text-sm font-bold text-white">N</span>
          </div>
          <span className="text-lg font-semibold text-foreground">NextCRM</span>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search"
            className="pl-9 pr-9"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {items.map((item) => {
            const hasItems = item.items && item.items.length > 0;
            const isOpen = openItems.includes(item.href);
            const active = isActive(item.href) || hasActiveChild(item);

            return (
              <li key={item.href}>
                <div>
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      if (hasItems) {
                        e.preventDefault();
                        toggleItem(item.href);
                      }
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-brand-50 text-brand-700 dark-mode:bg-brand-950/50 dark-mode:text-brand-400"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {item.icon && (
                      <item.icon className={cn("h-5 w-5", active && "text-brand-600 dark-mode:text-brand-400")} />
                    )}
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                        {typeof item.badge === "number" ? item.badge : item.badge}
                      </span>
                    )}
                    {hasItems && (
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-muted-foreground transition-transform",
                          isOpen && "rotate-180"
                        )}
                      />
                    )}
                  </Link>
                  
                  {hasItems && isOpen && (
                    <ul className="ml-8 mt-1 space-y-1 border-l border-border pl-4">
                      {item.items!.map((subItem) => {
                        const subActive = isActive(subItem.href);
                        return (
                          <li key={subItem.href}>
                            <Link
                              href={subItem.href}
                              className={cn(
                                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                                subActive
                                  ? "bg-brand-50 text-brand-700 dark-mode:bg-brand-950/50 dark-mode:text-brand-400"
                                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                              )}
                            >
                              {subItem.icon && (
                                <subItem.icon className="h-4 w-4" />
                              )}
                              <span>{subItem.label}</span>
                              {subItem.badge && (
                                <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                                  {typeof subItem.badge === "number" ? subItem.badge : subItem.badge}
                                </span>
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Feature Card */}
      {featureCard && <div className="px-4 pb-4">{featureCard}</div>}

      {/* Footer Items */}
      {footerItems.length > 0 && (
        <div className="border-t border-border p-4">
          <ul className="space-y-1">
            {footerItems.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-brand-50 text-brand-700 dark-mode:bg-brand-950/50 dark-mode:text-brand-400"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {item.icon && (
                      <item.icon className={cn("h-5 w-5", active && "text-brand-600 dark-mode:text-brand-400")} />
                    )}
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto">
                        {typeof item.badge === "number" ? (
                          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                            {item.badge}
                          </span>
                        ) : (
                          item.badge
                        )}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* User Profile */}
      {userProfile && <div className="border-t border-border p-4">{userProfile}</div>}
    </div>
  );
}

