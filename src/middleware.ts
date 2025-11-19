import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

/**
 * Middleware integrado que combina:
 * 1. next-intl: Detecta e valida locale da URL
 * 2. Supabase: Mantém sessão autenticada atualizada
 * 3. Autenticação: Protege rotas privadas
 *
 * ORDEM CRÍTICA:
 * 1. Validar locale da URL (next-intl)
 * 2. Fazer refresh da sessão Supabase (auth)
 * 3. Verificar autorização (public vs private routes)
 */

// Inicializa o middleware i18n do next-intl com configuração de roteamento
const handleI18nRouting = createMiddleware(routing)

/**
 * Middleware principal que combina i18n e autenticação
 * 
 * EDGE CASE: Rotas sem locale prefix (/_not-found, /api/*, etc) são ignoradas
 * pelo next-intl, então não são bloqueadas por falta de locale.
 */
export async function middleware(request: NextRequest) {
  // 1️⃣ Processar i18n (next-intl valida locale e adiciona headers)
  const intlResponse = handleI18nRouting(request)
  
  // Se handleI18nRouting retorna response com redirecionamento, usar
  if (intlResponse.status !== 200) {
    return intlResponse
  }

  let supabaseResponse = intlResponse

  // 2️⃣ Criar cliente Supabase para refresh de sessão
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3️⃣ Refresh da sessão (mantém token válido)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 4️⃣ Verificar autorização para rotas protegidas
  const pathname = request.nextUrl.pathname
  
  // Remover locale prefix para análise de rota
  // Exemplo: /pt/app/workspace → /app/workspace
  const localePrefix = `/${pathname.split('/')[1]}`
  const pathWithoutLocale = pathname.startsWith(localePrefix) 
    ? pathname.slice(localePrefix.length) || '/'
    : pathname

  // Rotas públicas que não requerem autenticação
  const publicRoutes = ['/sign-in', '/sign-up', '/forgot-password', '/']
  const isPublicRoute = publicRoutes.includes(pathWithoutLocale)

  // Se não está autenticado e está tentando acessar rota protegida
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    const locale = pathname.split('/')[1]
    url.pathname = `/${locale}/sign-in`
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - /api/* (API routes, não precisam de locale prefix)
     * - public files (extensões: svg, png, jpg, jpeg, gif, webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
