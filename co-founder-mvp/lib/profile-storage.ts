// 用户资料存储工具

// 完整用户资料类型
export type UserProfile = {
  id: string
  user_id: string
  name: string
  title: string
  bio: string
  vision: string
  tags: number[]
  linkedin?: string | null
  github?: string | null
  website?: string | null
  completion: number
  is_active?: boolean
  created_at: string
}

// Onboarding步骤数据类型
type OnboardingStep1 = {
  name: string
  title: string
  bio: string
}

type OnboardingStep2 = {
  abilityTags: number[]
  vision: string
}

type OnboardingStep3 = {
  roleTag: number
  directionTags: number[]
}

/**
 * 从localStorage获取并合并所有onboarding步骤数据
 */
export function getOnboardingProfile(): UserProfile | null {
  try {
    const step1Raw = localStorage.getItem('onboarding_step1')
    const step2Raw = localStorage.getItem('onboarding_step2')
    const step3Raw = localStorage.getItem('onboarding_step3')

    if (!step1Raw || !step2Raw || !step3Raw) {
      return null
    }

    const step1: OnboardingStep1 = JSON.parse(step1Raw)
    const step2: OnboardingStep2 = JSON.parse(step2Raw)
    const step3: OnboardingStep3 = JSON.parse(step3Raw)

    // 合并所有标签（能力 + 方向 + 角色）
    const allTags = [
      ...step2.abilityTags,
      ...step3.directionTags,
      step3.roleTag
    ]

    // 计算完成度
    const completion = calculateCompletion({
      name: step1.name,
      title: step1.title,
      bio: step1.bio,
      vision: step2.vision,
      tags: allTags,
      linkedin: null,
      github: null,
      website: null,
    })

    // 构建完整资料
    const profile: UserProfile = {
      id: 'profile-me',
      user_id: 'mock-user-001',
      name: step1.name,
      title: step1.title,
      bio: step1.bio,
      vision: step2.vision,
      tags: allTags,
      linkedin: null,
      github: null,
      website: null,
      completion,
      created_at: new Date().toISOString(),
    }

    return profile
  } catch (error) {
    console.error('Error getting onboarding profile:', error)
    return null
  }
}

/**
 * 保存完整的用户资料（在onboarding完成时调用）
 */
export function saveCompleteProfile(): UserProfile | null {
  const profile = getOnboardingProfile()
  if (!profile) {
    return null
  }

  // 保存到my_profile
  localStorage.setItem('my_profile', JSON.stringify(profile))

  return profile
}

/**
 * 获取当前用户的完整资料
 * 优先从my_profile读取，如果不存在则从onboarding数据合并
 */
export function getCurrentUserProfile(): UserProfile | null {
  try {
    // 首先尝试从my_profile读取
    const savedProfileRaw = localStorage.getItem('my_profile')
    if (savedProfileRaw) {
      return JSON.parse(savedProfileRaw) as UserProfile
    }

    // 如果没有保存的资料，尝试从onboarding数据合并
    return getOnboardingProfile()
  } catch (error) {
    console.error('Error getting current user profile:', error)
    return null
  }
}

/**
 * 更新用户资料（在编辑页面保存时调用）
 */
export function updateUserProfile(updates: Partial<UserProfile>): void {
  try {
    const currentProfile = getCurrentUserProfile()
    if (!currentProfile) {
      console.error('No profile found to update')
      return
    }

    // 合并更新
    const updatedProfile: UserProfile = {
      ...currentProfile,
      ...updates,
    }

    // 重新计算完成度
    updatedProfile.completion = calculateCompletion(updatedProfile)

    // 保存
    localStorage.setItem('my_profile', JSON.stringify(updatedProfile))
  } catch (error) {
    console.error('Error updating user profile:', error)
  }
}

/**
 * 计算资料完成度
 */
function calculateCompletion(profile: {
  name: string
  title: string
  bio: string
  vision: string
  tags: number[]
  linkedin?: string | null
  github?: string | null
  website?: string | null
}): number {
  let score = 0

  // 基础信息
  if (profile.name.length >= 2) score += 15
  if (profile.title.length >= 5) score += 15
  if (profile.bio.length >= 20) score += 20
  if (profile.vision.length >= 10) score += 20
  if (profile.tags.length >= 3) score += 15

  // 社交链接（可选）
  if (profile.linkedin) score += 5
  if (profile.github) score += 5
  if (profile.website) score += 5

  return Math.min(score, 100)
}

/**
 * 清除所有用户资料数据（用于测试或注销）
 */
export function clearUserProfile(): void {
  localStorage.removeItem('my_profile')
  localStorage.removeItem('onboarding_step1')
  localStorage.removeItem('onboarding_step2')
  localStorage.removeItem('onboarding_step3')
}