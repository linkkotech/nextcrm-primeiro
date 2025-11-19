import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

/**
 * Configuração per-request para next-intl
 * 
 * Este arquivo é necessário para que next-intl funcione corretamente.
 * É lido automaticamente pelo plugin next-intl integrado no next.config.mjs
 * 
 * Carrega as traduções dinâmicas baseado no locale da requisição
 * Referência: https://next-intl-docs.vercel.app/docs/getting-started/app-router
 */
export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale corresponde ao [locale] segment da URL
  const requested = await requestLocale;
  
  // Validar se locale é suportado, senão usar default
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
