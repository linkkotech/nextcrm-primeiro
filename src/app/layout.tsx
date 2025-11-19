/**
 * Layout ROOT - Sem locale
 * 
 * Este é o layout mais externo. O Next.js processará qualquer rota como:
 * /[locale]/...
 * 
 * Este layout apenas configura HTML global, fonts e providers.
 * O layout específico do locale é [locale]/layout.tsx
 */

import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import "@/styles/globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "NextCRM Primeiro",
  description: "Plataforma CRM multi-tenant construída com Next.js 16 e Prisma",
};

export const viewport: Viewport = {
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${outfit.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider defaultTheme="light" enableSystem>
          {children}
          <Toaster richColors position="top-center" closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
