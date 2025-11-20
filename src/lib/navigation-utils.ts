/**
 * Navigation Utilities
 * Helper functions for extracting navigation context from pathname
 */

/**
 * Extrai o módulo ativo do pathname da URL
 * 
 * Analisa o pathname e identifica qual módulo está ativo baseado na estrutura:
 * /[locale]/app/[workspaceSlug]/[module]/[...rest]
 * 
 * @param pathname - O pathname atual da URL (ex: "/pt/app/workspace-slug/crm/leads")
 * @returns O identificador do módulo ativo (ex: "crm") ou null se estiver na raiz
 * 
 * @example
 * getActiveModuleFromPath("/pt/app/workspace-slug/crm/leads") // returns "crm"
 * getActiveModuleFromPath("/pt/app/workspace-slug/dashboard") // returns "dashboard"
 * getActiveModuleFromPath("/pt/app/workspace-slug") // returns null
 */
export function getActiveModuleFromPath(pathname: string): string | null {
  // Split do pathname e remove strings vazias
  const segments = pathname.split('/').filter(Boolean);
  
  // Estrutura esperada: [locale, 'app', workspaceSlug, module?, ...]
  // Índice 0: locale (ex: "pt", "en")
  // Índice 1: "app"
  // Índice 2: workspaceSlug
  // Índice 3: module (se existir)
  
  if (segments.length < 4) {
    return null; // Está na rota raiz do workspace
  }
  
  // O módulo está na posição 3 (após locale, app, workspaceSlug)
  const module = segments[3];
  
  // Lista de módulos válidos (pode ser expandida conforme necessário)
  const validModules = [
    'crm',
    'ai-agents',
    'payments',
    'projects',
    'marketing',
    'reports',
    'onboarding',
    'dashboard' // Dashboard também pode ser considerado um módulo
  ];
  
  return validModules.includes(module) ? module : null;
}
