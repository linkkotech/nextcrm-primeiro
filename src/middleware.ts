import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Centralises Supabase session refresh and access control across every incoming request.
 *
 * @example
 * ```ts
 * const response = await middleware(request)
 * ```
 *
 * @returns {Promise<NextResponse>} A response with updated cookies or a redirect when access control fails.
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Cria cliente Supabase para servidor
  // Gerencia cookies automaticamente
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Atualiza cookies na request (para Server Components)
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          // IMPORTANTE: também propaga cookies na response para manter tokens alinhados no browser
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

  // Refresh da sessão - re-autentica se refresh token expirou
  // Critical: isto mantém a sessão viva em Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Rotas que não requerem autenticação (acessíveis publicamente)
  const publicRoutes = ['/sign-in', '/sign-up', '/forgot-password', '/']
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname)

  // Se não está autenticado e está tentando acessar rota protegida
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/sign-in'
    url.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // ✅ REMOVIDO: Não redirecionar aqui após login/signup.
  // A lógica de redirecionamento agora é controlada EXCLUSIVAMENTE pela loginAction/signupAction
  // que retornam { redirectTo } com base na AdminRole do usuário.
  // O middleware NÃO deve sobrescrever essa lógica.

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
