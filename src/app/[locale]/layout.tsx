import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { RouteProvider } from "@/components/providers/route-provider";
import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/globals.css";

/**
 * Layout LOCAL - Com locale
 * 
 * Este layout é renderizado para cada locale (pt, en, es).
 * Configura o NextIntlClientProvider para disponibilizar translations
 * em Client Components via hook useTranslations().
 * 
 * Server Components usam getTranslations() diretamente.
 */

export const metadata: Metadata = {
  title: "NextCRM Primeiro",
  description: "Plataforma CRM multi-tenant construída com Next.js 16 e Prisma",
};

export const viewport: Viewport = {
  colorScheme: "light",
};

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validar locale usando hasLocale da next-intl
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <NextIntlClientProvider>
      <RouteProvider>
        {children}
      </RouteProvider>
    </NextIntlClientProvider>
  );
}
