import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware executado em TODA requisição
 * Responsabilidades:
 * 1. Manter sessão Supabase sincronizada (refresh se expirada)
 * 2. Redirecionar usuários não-autenticados para /sign-in
 * 3. Redirecionar autenticados de /sign-in para /admin/dashboard
 * 4. Preparar contexto para Server Components via cookies
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
          // Atualiza cookies na response (para navegador)
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

  // Se está autenticado e está tentando acessar página de login/signup
  if (user && (request.nextUrl.pathname === '/sign-in' || request.nextUrl.pathname === '/sign-up')) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/dashboard'
    return NextResponse.redirect(url)
  }

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
