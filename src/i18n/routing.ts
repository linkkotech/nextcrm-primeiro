import { defineRouting } from 'next-intl/routing';

/**
 * Configuração de roteamento para next-intl
 * Define locais suportados, locale padrão e estratégia de prefixo
 */
export const routing = defineRouting({
  // Locales suportados
  locales: ['pt', 'en', 'es'],
  
  // Locale padrão quando nenhum é especificado
  defaultLocale: 'pt',
  
  // Sempre incluir locale na URL: /pt/app, /en/admin, /es/sign-in
  localePrefix: 'always',
});
