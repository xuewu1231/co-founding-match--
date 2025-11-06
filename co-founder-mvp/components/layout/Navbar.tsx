'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { getCurrentUser, signOut } from '@/lib/auth-service'
import { Button } from '@/components/ui/button'
import { MOCK_MODE } from '@/lib/mock-data'
import type { User } from '@supabase/supabase-js'

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0) // 🎯 未读通知数量

  useEffect(() => {
    // 获取当前用户
    getCurrentUser().then(user => {
      setUser(user)
      setIsLoading(false)
    })

    // 🎯 计算未读通知数量
    const calculateUnreadCount = () => {
      try {
        // 在Mock模式下，从MOCK_NOTIFICATIONS读取pending状态的数量
        const notificationsRaw = localStorage.getItem('mock_notifications')
        if (notificationsRaw) {
          const notifications = JSON.parse(notificationsRaw)
          const count = notifications.filter((n: any) => n.status === 'pending').length
          setUnreadCount(count)
        } else {
          // 如果localStorage没有，使用默认值3（首次访问）
          setUnreadCount(3)
        }
      } catch (error) {
        console.error('Failed to get unread count:', error)
        setUnreadCount(0)
      }
    }

    calculateUnreadCount()

    // 🎯 监听localStorage变化，实时更新未读数
    const handleStorageChange = () => {
      calculateUnreadCount()
    }
    window.addEventListener('storage', handleStorageChange)

    // 自定义事件：当通知页面更新状态时触发
    window.addEventListener('notificationsUpdated', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('notificationsUpdated', handleStorageChange)
    }
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
    {
      href: '/matching/notifications',
      label: '通知中心',
      badge: unreadCount > 0 ? unreadCount : undefined // 🎯 动态显示未读数量
    },
    { href: '/matching/connections', label: '已连接' },
    { href: '/profile/me', label: '我的资料' },
  ]

  return (
    <nav className="border-b border-brand-light/50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* 左侧：Logo和导航链接 */}
          <div className="flex">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <span className="text-xl font-bold text-brand-dark group-hover:text-brand-primary transition-colors">
                奇绩引力场
              </span>
              {MOCK_MODE && (
                <span className="ml-2 px-2 py-1 text-xs bg-brand-secondary/20 text-brand-secondary rounded font-medium">
                  Mock模式
                </span>
              )}
            </Link>

            {/* 导航链接 */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname?.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors relative ${
                      isActive
                        ? 'border-brand-primary text-brand-dark'
                        : 'border-transparent text-gray-600 hover:border-brand-secondary hover:text-brand-primary'
                    }`}
                  >
                    {link.label}
                    {link.badge && link.badge > 0 && (
                      <span className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white font-bold">
                        {link.badge}
                      </span>
                    )}
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
              className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition-colors"
            >
              登出
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
