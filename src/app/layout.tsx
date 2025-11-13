import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { RouteProvider } from "@/components/providers/route-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
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
    <html lang="pt-BR" className={`${inter.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <RouteProvider>
          <ThemeProvider defaultTheme="light" enableSystem>
            {children}
            <Toaster richColors position="top-right" closeButton />
          </ThemeProvider>
        </RouteProvider>
      </body>
    </html>
  );
}
