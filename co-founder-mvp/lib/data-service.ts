import { createClient } from '@/lib/supabase/client'
import { MOCK_MODE, MOCK_PROFILES, MOCK_MY_PROFILE, MOCK_TAGS, MOCK_CONNECTIONS, mockDelay, getTagsByType } from './mock-data'
import type { Database } from '@/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']
type Tag = Database['public']['Tables']['tags']['Row']
type Connection = Database['public']['Tables']['connections']['Row']

/**
 * 统一的数据服务
 * 根据MOCK_MODE自动切换真实数据/Mock数据
 */

/**
 * 获取所有标签
 */
export async function getAllTags(): Promise<Tag[]> {
  if (MOCK_MODE) {
    console.log('🎭 Mock Mode: 返回假标签数据')
    await mockDelay(200)
    return MOCK_TAGS as any[]
  }

  const supabase = createClient()
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('usage_count', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * 根据类型获取标签
 */
export async function getTagsByTypeAPI(type: 'ability' | 'direction' | 'role'): Promise<Tag[]> {
  if (MOCK_MODE) {
    console.log(`🎭 Mock Mode: 返回${type}类型标签`)
    await mockDelay(150)
    return getTagsByType(type) as any[]
  }

  const supabase = createClient()
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('type', type)
    .eq('is_system', true)
    .order('usage_count', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * 获取所有Profile（名片池）
 */
export async function getAllProfiles(): Promise<Profile[]> {
  if (MOCK_MODE) {
    console.log('🎭 Mock Mode: 返回假名片数据')
    await mockDelay(300)
    return MOCK_PROFILES as any[]
  }

  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * 获取当前用户的Profile
 */
export async function getMyProfile(userId: string): Promise<Profile | null> {
  if (MOCK_MODE) {
    console.log('🎭 Mock Mode: 返回我的假资料')
    await mockDelay(200)
    return MOCK_MY_PROFILE as any
  }

  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

/**
 * 创建或更新Profile
 */
export async function upsertProfile(profile: Partial<Profile>) {
  if (MOCK_MODE) {
    console.log('🎭 Mock Mode: 假装保存Profile', profile)
    await mockDelay(500)
    return { success: true, data: { ...MOCK_MY_PROFILE, ...profile } }
  }

  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile)
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

/**
 * 获取已连接的用户
 */
export async function getMyConnections(userId: string): Promise<any[]> {
  if (MOCK_MODE) {
    console.log('🎭 Mock Mode: 返回假连接数据')
    await mockDelay(250)
    return MOCK_CONNECTIONS
  }

  const supabase = createClient()
  const { data, error } = await supabase
    .from('connections')
    .select(`
      *,
      profile_a:profiles!connections_user_a_id_fkey(*),
      profile_b:profiles!connections_user_b_id_fkey(*)
    `)
    .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
    .eq('status', 'active')

  if (error) throw error
  return data || []
}

/**
 * 发起兴趣信号（"我想聊聊"）
 */
export async function sendInterest(senderId: string, receiverId: string) {
  if (MOCK_MODE) {
    console.log('🎭 Mock Mode: 假装发送兴趣信号', { senderId, receiverId })
    await mockDelay(400)

    // 模拟匹配逻辑：随机决定是否匹配成功
    const isMatch = Math.random() > 0.7

    if (isMatch) {
      return {
        success: true,
        matched: true,
        message: '匹配成功！你们可以互相看到联系方式了'
      }
    } else {
      return {
        success: true,
        matched: false,
        message: '已发送兴趣，等待对方回应'
      }
    }
  }

  // 真实模式：调用Supabase
  const supabase = createClient()

  // 1. 记录兴趣
  const { error: insertError } = await supabase
    .from('interests')
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      status: 'pending'
    })

  if (insertError) return { success: false, error: insertError.message }

  // 2. 检查反向兴趣
  const { data: reverseInterest } = await supabase
    .from('interests')
    .select('*')
    .eq('sender_id', receiverId)
    .eq('receiver_id', senderId)
    .eq('status', 'pending')
    .single()

  // 3. 如果有反向兴趣，创建连接
  if (reverseInterest) {
    const { error: connectionError } = await supabase
      .from('connections')
      .insert({
        user_a_id: Math.min(senderId, receiverId) < senderId ? senderId : receiverId,
        user_b_id: Math.max(senderId, receiverId) > senderId ? senderId : receiverId,
        status: 'active'
      })

    if (connectionError) return { success: false, error: connectionError.message }

    return {
      success: true,
      matched: true,
      message: '匹配成功！'
    }
  }

  return {
    success: true,
    matched: false,
    message: '已发送兴趣'
  }
}
