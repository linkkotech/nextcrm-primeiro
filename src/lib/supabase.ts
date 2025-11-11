import { createServerClient as createSupabaseServerClient, type CookieOptions } from '@supabase/ssr'
import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Creates a Supabase client scoped to the current server request so authentication can be performed in Server Components and Server Actions.
 *
 * @example
 * ```ts
 * const supabase = await createServerClient()
 * const { data } = await supabase.auth.getUser()
 * ```
 *
 * @throws {Error} When required Supabase environment variables are missing.
 * @returns {Promise<ReturnType<typeof createSupabaseServerClient>>} A request-scoped Supabase client with automatic cookie synchronisation.
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
 * Creates a browser-ready Supabase client for React components that run on the client.
 *
 * @example
 * ```ts
 * const supabase = createBrowserClient()
 * const { data } = await supabase.auth.getSession()
 * ```
 *
 * @throws {Error} When Supabase credentials are not provided via environment variables.
 * @returns {ReturnType<typeof createSupabaseBrowserClient>} A Supabase client instance managed in the browser context.
 */
export function createBrowserClient() {
  return createSupabaseBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
