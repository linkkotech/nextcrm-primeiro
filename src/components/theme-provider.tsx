"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      disableTransitionOnChange
      attribute="class"
      value={{ light: "light-mode", dark: "dark-mode" }}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

