import { createBrowserClient, createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { NextRequest, NextResponse } from 'next/server'

/**
 * Cria um cliente Supabase para uso em Client Components ("use client")
 * 
 * Este cliente roda no navegador e gerencia cookies automaticamente.
 * Use uma instância única por componente ou crie no topo do arquivo.
 * 
 * @example
 * ```ts
 * "use client"
 * const supabase = createClient()
 * const { data, error } = await supabase.auth.getSession()
 * ```
 * 
 * @returns Cliente Supabase configurado para o navegador
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * Cria um cliente Supabase para uso em Server Components e Server Actions
 * 
 * Este cliente roda no servidor e sincroniza cookies automaticamente
 * via next/headers. Deve ser chamado dentro de funções assíncronas
 * que têm acesso ao contexto de requisição.
 * 
 * @example
 * ```ts
 * export async function getUser() {
 *   const cookieStore = await cookies()
 *   const supabase = await createServerClient(cookieStore)
 *   const { data: { user } } = await supabase.auth.getUser()
 *   return user
 * }
 * ```
 * 
 * @param cookieStore - Obtido de `await cookies()` via next/headers
 * @returns Cliente Supabase configurado para o servidor
 */
export async function createServerClient(
  cookieStore: Awaited<ReturnType<typeof cookies>>
) {
  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options as CookieOptions)
            )
          } catch {
            /**
             * setAll pode ser chamado de um Server Component durante renderização
             * Neste caso, não é possível modificar headers (erro silencioso é esperado)
             * O middleware será responsável por sincronizar os cookies na próxima requisição
             */
          }
        },
      },
    }
  )
}

/**
 * Cria um cliente Supabase para uso em Middleware e Route Handlers
 * 
 * Este cliente é otimizado para o contexto de middleware, onde temos
 * acesso direto ao objeto NextRequest. Sincroniza cookies diretamente
 * com request/response sem passar por next/headers.
 * 
 * IMPORTANTE: Este cliente deve retornar também o NextResponse para
 * que os cookies atualizados sejam enviados ao cliente.
 * 
 * @example
 * ```ts
 * export async function middleware(request: NextRequest) {
 *   let response = NextResponse.next({ request })
 *   const supabase = createMiddlewareClient(request, response)
 *   const { data: { user } } = await supabase.auth.getUser()
 *   return response
 * }
 * ```
 * 
 * @param request - Objeto NextRequest do middleware
 * @param response - Objeto NextResponse para sincronizar cookies
 * @returns Cliente Supabase configurado para middleware
 * @throws {Error} Se variáveis de ambiente não estiverem configuradas
 */
export function createMiddlewareClient(
  request: NextRequest,
  response: NextResponse
) {
  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // Lê cookies da requisição do cliente
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Atualiza cookies em ambas as partes: request e response
          cookiesToSet.forEach(({ name, value, options }) => {
            // Atualiza request (para Server Components rodarem com dados atualizados)
            request.cookies.set(name, value)
            // Atualiza response (para enviar novos tokens ao cliente)
            response.cookies.set(name, value, options as CookieOptions)
          })
        },
      },
    }
  )
}
