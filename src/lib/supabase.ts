import { createServerClient as createSupabaseServerClient, type CookieOptions } from '@supabase/ssr'
import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Cria cliente Supabase para Server Components e Server Actions
 * 
 * Características:
 * - Usa `next/headers` cookies (assíncrono)
 * - Mantém sessão entre requisições via cookies
 * - Pode ser chamado múltiplas vezes (idempotente)
 * - Sincroniza tokens de ambos os lados (request/response)
 * 
 * Fluxo:
 * Request cookies → Supabase client → Response cookies (para navegador)
 */
export async function createServerClient() {
  const cookieStore = await cookies()

  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // Lê cookies da request (tokens do cliente)
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            // Atualiza cookies no servidor (novos tokens)
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            /**
             * setAll pode ser chamado de Server Component (erro silencioso)
             * Middleware já sincroniza os cookies via supabaseResponse
             * Então esse erro pode ser ignorado
             */
          }
        },
      },
    }
  )
}

/**
 * Cria cliente Supabase para Client Components
 * 
 * Características:
 * - Síncrono (sem await)
 * - Gerencia cookies no browser via localStorage/cookies
 * - Use uma instância única (criar uma vez, reutilizar)
 * 
 * Padrão:
 * const supabase = createBrowserClient()  // Top of component
 * 
 * const { data, error } = await supabase.auth.getSession()
 */
export function createBrowserClient() {
  return createSupabaseBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
