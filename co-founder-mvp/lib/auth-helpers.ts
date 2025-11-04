import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

/**
 * 用户注册
 * @param email 邮箱
 * @param password 密码
 * @returns 注册结果
 */
export async function signUp(email: string, password: string) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, user: data.user }
}

/**
 * 用户登录
 * @param email 邮箱
 * @param password 密码
 * @returns 登录结果
 */
export async function signIn(email: string, password: string) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, user: data.user }
}

/**
 * 用户登出
 * @returns 登出结果
 */
export async function signOut() {
  const supabase = createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * 获取当前登录用户
 * @returns 当前用户或null
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  return user
}

/**
 * 检查用户是否已登录
 * @returns 是否已登录
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return user !== null
}
