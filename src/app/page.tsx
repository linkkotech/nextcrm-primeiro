/**
 * Página ROOT - Redirect para locale padrão
 * 
 * Como o Next.js agora espera /[locale]/... para todas as rotas,
 * esta página redireciona / para /pt (locale padrão).
 */

import { routing } from "@/i18n/routing";
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
