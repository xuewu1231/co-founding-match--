'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { getCurrentUser, signOut } from '@/lib/auth-helpers'
import { Button } from '@/components/ui/button'
import type { User } from '@supabase/supabase-js'

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 获取当前用户
    getCurrentUser().then(user => {
      setUser(user)
      setIsLoading(false)
    })
  }, [])

  const handleSignOut = async () => {
    const result = await signOut()
    if (result.success) {
      setUser(null)
      router.push('/login')
    }
  }

  // 如果在认证页面，不显示导航栏
  if (pathname?.startsWith('/login') || pathname?.startsWith('/register')) {
    return null
  }

  // 如果用户未登录，不显示导航栏
  if (!user) {
    return null
  }

  const navLinks = [
    { href: '/matching/pool', label: '名片池' },
    { href: '/matching/connections', label: '已连接' },
    { href: '/profile/me', label: '我的资料' },
  ]

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* 左侧：Logo和导航链接 */}
          <div className="flex">
            {/* Logo */}
            <Link href="/matching/pool" className="flex items-center">
              <span className="text-xl font-bold text-gray-900">
                奇绩引力场
              </span>
            </Link>

            {/* 导航链接 */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname?.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* 右侧：用户信息和登出按钮 */}
          <div className="flex items-center space-x-4">
            {/* 用户邮箱 */}
            <span className="hidden sm:block text-sm text-gray-700">
              {user.email}
            </span>

            {/* 登出按钮 */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
            >
              登出
            </Button>
          </div>
        </div>

        {/* 移动端导航菜单 */}
        <div className="sm:hidden pb-3 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname?.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
