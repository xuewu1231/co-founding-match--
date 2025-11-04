import { getCurrentUser as supabaseGetCurrentUser, signIn as supabaseSignIn, signOut as supabaseSignOut, signUp as supabaseSignUp } from './auth-helpers'
import { MOCK_MODE, MOCK_USER, mockDelay } from './mock-data'
import type { User } from '@supabase/supabase-js'

/**
 * 统一的认证服务
 * 根据MOCK_MODE自动切换真实认证/Mock认证
 */

/**
 * 获取当前用户
 */
export async function getCurrentUser(): Promise<User | null> {
  if (MOCK_MODE) {
    // Mock模式：直接返回假用户
    console.log('🎭 Mock Mode: 返回假用户')
    await mockDelay(100)
    return MOCK_USER as any
  }

  // 真实模式：调用Supabase
  return supabaseGetCurrentUser()
}

/**
 * 用户登录
 */
export async function signIn(email: string, password: string) {
  if (MOCK_MODE) {
    // Mock模式：假装登录成功
    console.log('🎭 Mock Mode: 假装登录成功')
    await mockDelay(500)
    return { success: true, user: MOCK_USER }
  }

  // 真实模式：调用Supabase
  return supabaseSignIn(email, password)
}

/**
 * 用户注册
 */
export async function signUp(email: string, password: string) {
  if (MOCK_MODE) {
    // Mock模式：假装注册成功
    console.log('🎭 Mock Mode: 假装注册成功')
    await mockDelay(500)
    return { success: true, user: MOCK_USER }
  }

  // 真实模式：调用Supabase
  return supabaseSignUp(email, password)
}

/**
 * 用户登出
 */
export async function signOut() {
  if (MOCK_MODE) {
    // Mock模式：假装登出
    console.log('🎭 Mock Mode: 假装登出成功')
    await mockDelay(200)
    return { success: true }
  }

  // 真实模式：调用Supabase
  return supabaseSignOut()
}

/**
 * 检查是否已登录
 */
export async function isAuthenticated(): Promise<boolean> {
  if (MOCK_MODE) {
    // Mock模式：永远返回已登录
    return true
  }

  const user = await getCurrentUser()
  return user !== null
}

/**
 * SSO单点登录接口（预留）
 * 未来可以接入企业微信、钉钉、飞书等
 */
export async function ssoLogin(provider: 'wechat' | 'dingtalk' | 'feishu', token: string) {
  // TODO: 实现SSO登录逻辑
  console.log('🔐 SSO Login:', provider, token)

  if (MOCK_MODE) {
    console.log('🎭 Mock Mode: SSO登录成功')
    await mockDelay(800)
    return { success: true, user: MOCK_USER }
  }

  // 真实模式：调用对应的SSO服务
  throw new Error('SSO功能暂未实现')
}
