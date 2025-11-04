import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

// 受保护的路由（需要登录才能访问）
const protectedRoutes = ['/matching', '/profile', '/onboarding']

// 认证路由（已登录用户不应访问）
const authRoutes = ['/login', '/register']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 检查是否为Mock模式
  const isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE === 'true'

  // Mock模式：跳过所有认证检查
  if (isMockMode) {
    console.log('🎭 Mock Mode: 中间件跳过认证检查')
    return NextResponse.next()
  }

  // 真实模式：正常的认证检查
  // 创建响应对象
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 创建Supabase客户端
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // 获取当前用户
  const { data: { user } } = await supabase.auth.getUser()

  // 检查是否为受保护路由
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // 检查是否为认证路由
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // 如果是受保护路由且用户未登录，重定向到登录页
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 如果是认证路由且用户已登录，重定向到名片池
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/matching/pool'
    return NextResponse.redirect(url)
  }

  return response
}

// 配置中间件匹配的路径
export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - _next/static (静态文件)
     * - _next/image (图片优化)
     * - favicon.ico (网站图标)
     * - public文件夹
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
