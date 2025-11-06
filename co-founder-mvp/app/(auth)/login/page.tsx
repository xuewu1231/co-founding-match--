'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { signIn } from '@/lib/auth-service'
import { MOCK_MODE } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

// 表单验证Schema
const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(1, '请输入密码')
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [debugInfo, setDebugInfo] = useState('')

  useEffect(() => {
    // 输出调试信息
    console.log('🔍 登录页面 - MOCK_MODE:', MOCK_MODE)
    console.log('🔍 登录页面 - ENV:', process.env.NEXT_PUBLIC_MOCK_MODE)
  }, [])

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setErrorMessage('')
    setDebugInfo('')

    console.log('🔍 开始登录:', data.email)
    console.log('🔍 当前MOCK_MODE:', MOCK_MODE)

    try {
      const result = await signIn(data.email, data.password)

      console.log('🔍 登录结果:', result)
      setDebugInfo(`登录结果: ${JSON.stringify(result)}`)

      if (result.success) {
        console.log('✅ 登录成功，跳转到名片池')
        router.push('/matching/pool')
      } else {
        console.log('❌ 登录失败:', result.error)
        setErrorMessage(result.error || '登录失败，请检查邮箱和密码')
      }
    } catch (error) {
      console.error('❌ 登录异常:', error)
      setErrorMessage('登录过程中发生错误')
      setDebugInfo(`异常: ${error}`)
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light/30 px-4">
      <Card className="w-full max-w-md border-brand-light shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-brand-dark">登录</CardTitle>
          <CardDescription>
            {MOCK_MODE ? (
              <span className="text-brand-secondary font-medium">
                🎭 Mock模式：输入任意邮箱密码即可登录
              </span>
            ) : (
              '输入您的邮箱和密码来登录账号'
            )}
          </CardDescription>
          {/* 调试信息 */}
          <div className="text-xs text-gray-500 mt-2">
            当前模式: {MOCK_MODE ? '🎭 Mock' : '🔒 真实'} |
            ENV: {process.env.NEXT_PUBLIC_MOCK_MODE || 'undefined'}
          </div>
        </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* 邮箱 */}
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              defaultValue={MOCK_MODE ? "test@test.com" : ""}
              {...register('email')}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* 密码 */}
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              placeholder="输入密码"
              defaultValue={MOCK_MODE ? "12345678" : ""}
              {...register('password')}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* 错误提示 */}
          {errorMessage && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {errorMessage}
            </div>
          )}

          {/* 调试信息 */}
          {debugInfo && (
            <div className="p-3 text-xs text-gray-600 bg-gray-50 rounded-md font-mono">
              {debugInfo}
            </div>
          )}

          {/* 提交按钮 */}
          <Button
            type="submit"
            className="w-full bg-brand-primary hover:bg-brand-dark text-white transition-colors"
            disabled={isLoading}
          >
            {isLoading ? '登录中...' : '登录'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex-col space-y-2">
        <p className="text-sm text-gray-600 text-center w-full">
          还没有账号？{' '}
          <Link href="/register" className="text-brand-primary hover:text-brand-dark hover:underline font-medium">
            立即注册
          </Link>
        </p>
        <Link href="/debug" className="text-xs text-brand-secondary hover:underline">
          → 访问调试页面排查问题
        </Link>
      </CardFooter>
      </Card>
    </div>
  )
}
