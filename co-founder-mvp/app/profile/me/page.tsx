'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { getTagNames, MOCK_MY_PROFILE, getTagsByType } from '@/lib/mock-data'
import { getCurrentUserProfile, updateUserProfile, type UserProfile } from '@/lib/profile-storage'

export default function MyProfilePage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  // 🎯 初始值直接使用MOCK_MY_PROFILE，避免null导致的错误
  const [currentProfile, setCurrentProfile] = useState<UserProfile>(MOCK_MY_PROFILE as UserProfile)

  // 编辑状态的表单数据
  const [formData, setFormData] = useState({
    name: MOCK_MY_PROFILE.name,
    title: MOCK_MY_PROFILE.title,
    bio: MOCK_MY_PROFILE.bio,
    vision: MOCK_MY_PROFILE.vision,
    linkedin: MOCK_MY_PROFILE.linkedin || '',
    github: MOCK_MY_PROFILE.github || '',
    website: MOCK_MY_PROFILE.website || '',
    tags: MOCK_MY_PROFILE.tags,
  })

  // 🎯 从localStorage加载真实用户数据（如果存在）
  const [hasUserData, setHasUserData] = useState(true) // 标记是否有真实用户数据

  useEffect(() => {
    const userProfile = getCurrentUserProfile()
    if (userProfile) {
      // 有真实数据，覆盖Mock数据
      setCurrentProfile(userProfile)
      setFormData({
        name: userProfile.name,
        title: userProfile.title,
        bio: userProfile.bio,
        vision: userProfile.vision,
        linkedin: userProfile.linkedin || '',
        github: userProfile.github || '',
        website: userProfile.website || '',
        tags: userProfile.tags,
      })
      setHasUserData(true)
    } else {
      // 没有任何用户数据（连onboarding都没完成）
      setHasUserData(false)
    }
  }, [])

  const abilityTags = getTagsByType('ability')
  const directionTags = getTagsByType('direction')
  const roleTags = getTagsByType('role')

  const toggleTag = (tagId: number) => {
    if (formData.tags.includes(tagId)) {
      setFormData({ ...formData, tags: formData.tags.filter(id => id !== tagId) })
    } else {
      if (formData.tags.length >= 8) {
        toast.warning('最多选择8个标签')
        return
      }
      setFormData({ ...formData, tags: [...formData.tags, tagId] })
    }
  }

  const handleSave = async () => {
    setIsSaving(true)

    // 模拟保存
    await new Promise(resolve => setTimeout(resolve, 800))

    // 🎯 修改：使用新的更新函数
    updateUserProfile({
      name: formData.name,
      title: formData.title,
      bio: formData.bio,
      vision: formData.vision,
      linkedin: formData.linkedin || null,
      github: formData.github || null,
      website: formData.website || null,
      tags: formData.tags,
    })

    // 重新加载当前资料
    const updatedProfile = getCurrentUserProfile()
    if (updatedProfile) {
      setCurrentProfile(updatedProfile)
    }

    toast.success('资料保存成功！', {
      description: '你的个人资料已更新',
      duration: 3000,
    })
    setIsEditing(false)
    setIsSaving(false)
  }

  const handleCancel = () => {
    // 🎯 修改：恢复当前用户数据
    if (currentProfile) {
      setFormData({
        name: currentProfile.name,
        title: currentProfile.title,
        bio: currentProfile.bio,
        vision: currentProfile.vision,
        linkedin: currentProfile.linkedin || '',
        github: currentProfile.github || '',
        website: currentProfile.website || '',
        tags: currentProfile.tags,
      })
    }
    setIsEditing(false)
  }

  // 计算完成度 - 使用当前资料
  const calculateCompletion = () => {
    return currentProfile.completion
  }

  const completion = calculateCompletion()

  // 🎯 如果用户没有数据，显示引导页面
  if (!hasUserData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card className="border-brand-light shadow-lg max-w-2xl w-full">
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              {/* 图标 */}
              <div className="text-8xl mb-4">📝</div>

              {/* 标题 */}
              <div>
                <h2 className="text-3xl font-bold text-brand-dark mb-3">
                  欢迎来到Co-founder匹配平台
                </h2>
                <p className="text-gray-600 text-lg">
                  看起来你还没有完成个人资料的填写
                </p>
              </div>

              {/* 说明 */}
              <div className="bg-brand-light/50 p-6 rounded-xl text-left space-y-3">
                <p className="text-gray-700">
                  <strong className="text-brand-primary">为什么需要完善资料？</strong>
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary mt-1">✓</span>
                    <span>帮助其他创业者了解你的背景和能力</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary mt-1">✓</span>
                    <span>提高匹配成功率，找到更合适的合伙人</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary mt-1">✓</span>
                    <span>只需3步，2分钟即可完成</span>
                  </li>
                </ul>
              </div>

              {/* 按钮 */}
              <div className="pt-4">
                <Button
                  onClick={() => router.push('/onboarding/1')}
                  className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-6 text-lg rounded-xl apple-button-shadow hover:apple-button-shadow-hover"
                  size="lg"
                >
                  <span className="text-xl mr-2">🚀</span>
                  开始填写资料
                </Button>
              </div>

              {/* 提示 */}
              <p className="text-sm text-gray-500 mt-4">
                填写资料后，你就可以开始浏览其他创业者的名片了
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 标题 */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark">我的资料</h1>
          <p className="text-gray-600 mt-2">管理你的个人资料和偏好设置</p>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-brand-primary hover:bg-brand-dark text-white"
          >
            ✏️ 编辑资料
          </Button>
        )}
      </div>

      {/* 主卡片 */}
      <Card className="border-brand-light shadow-lg">
        <CardHeader className="bg-brand-light/50 border-b border-brand-light">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-2xl text-brand-dark">
                  {formData.name}
                </CardTitle>
                <Badge className="bg-brand-secondary text-white">我的名片</Badge>
              </div>
              <CardDescription className="text-sm">
                ID: {currentProfile.id.slice(-6).toUpperCase()} · 资料完成度 {completion}%
              </CardDescription>
            </div>

            {/* 完成度进度条 */}
            <div className="w-32">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    completion === 100 ? 'bg-green-500' : 'bg-brand-primary'
                  }`}
                  style={{ width: `${completion}%` }}
                ></div>
              </div>
              <p className={`text-xs text-right mt-1 ${completion === 100 ? 'text-green-600' : 'text-gray-500'}`}>
                {completion}%
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* 查看模式 */}
          {!isEditing && (
            <>
              {/* 职位 */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">职位/角色</h3>
                <p className="text-base text-gray-800">{formData.title}</p>
              </div>

              {/* 个人简介 */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">个人简介</h3>
                <p className="text-base text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {formData.bio}
                </p>
              </div>

              {/* 创业愿景 */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">创业愿景</h3>
                <p className="text-base text-gray-800 leading-relaxed bg-brand-light/30 p-4 rounded-lg">
                  {formData.vision}
                </p>
              </div>

              {/* 标签 */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-3">标签</h3>
                <div className="flex flex-wrap gap-2">
                  {getTagNames(formData.tags).map((tagName, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-sm bg-brand-light text-brand-dark px-3 py-1"
                    >
                      {tagName}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 联系方式 */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-3">联系方式</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600 w-24">LinkedIn:</span>
                    <span className="text-gray-800">{formData.linkedin || '未填写'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600 w-24">GitHub:</span>
                    <span className="text-gray-800">{formData.github || '未填写'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600 w-24">个人网站:</span>
                    <span className="text-gray-800">{formData.website || '未填写'}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 编辑模式 */}
          {isEditing && (
            <div className="space-y-6">
              {/* 姓名 */}
              <div className="space-y-2">
                <Label htmlFor="name">真实姓名 <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例如：张三"
                />
              </div>

              {/* 职位 */}
              <div className="space-y-2">
                <Label htmlFor="title">职位/角色 <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="例如：AI技术负责人"
                />
              </div>

              {/* 个人简介 */}
              <div className="space-y-2">
                <Label htmlFor="bio">个人简介 <span className="text-red-500">*</span></Label>
                <Textarea
                  id="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="简要介绍你的背景和经验..."
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">{formData.bio.length}/200字符</p>
              </div>

              {/* 创业愿景 */}
              <div className="space-y-2">
                <Label htmlFor="vision">创业愿景 <span className="text-red-500">*</span></Label>
                <Textarea
                  id="vision"
                  rows={3}
                  value={formData.vision}
                  onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                  placeholder="你想做什么方向的创业项目..."
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">{formData.vision.length}/100字符</p>
              </div>

              {/* 标签选择 */}
              <div className="space-y-4">
                <div>
                  <Label>能力标签</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {abilityTags.map((tag) => {
                      const isSelected = formData.tags.includes(tag.id)
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => toggleTag(tag.id)}
                          className={`
                            px-3 py-1 rounded-lg text-sm font-medium transition-all
                            ${isSelected
                              ? 'bg-brand-primary text-white ring-2 ring-brand-primary ring-offset-2'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
                          `}
                        >
                          {tag.name}
                          {isSelected && ' ✓'}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <Label>方向标签</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {directionTags.map((tag) => {
                      const isSelected = formData.tags.includes(tag.id)
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => toggleTag(tag.id)}
                          className={`
                            px-3 py-1 rounded-lg text-sm font-medium transition-all
                            ${isSelected
                              ? 'bg-brand-primary text-white ring-2 ring-brand-primary ring-offset-2'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
                          `}
                        >
                          {tag.name}
                          {isSelected && ' ✓'}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <Label>角色标签</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {roleTags.map((tag) => {
                      const isSelected = formData.tags.includes(tag.id)
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => toggleTag(tag.id)}
                          className={`
                            px-3 py-1 rounded-lg text-sm font-medium transition-all
                            ${isSelected
                              ? 'bg-brand-primary text-white ring-2 ring-brand-primary ring-offset-2'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
                          `}
                        >
                          {tag.name}
                          {isSelected && ' ✓'}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <p className="text-xs text-gray-500">已选择 {formData.tags.length}/8 个标签</p>
              </div>

              {/* 联系方式 */}
              <div className="space-y-4">
                <Label>联系方式（选填，可提升完成度）</Label>

                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="text-sm">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/yourname"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github" className="text-sm">GitHub</Label>
                  <Input
                    id="github"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    placeholder="https://github.com/yourname"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="text-sm">个人网站</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 bg-brand-primary hover:bg-brand-dark text-white"
                >
                  {isSaving ? '保存中...' : '✓ 保存修改'}
                </Button>
                <Button
                  onClick={handleCancel}
                  disabled={isSaving}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  取消
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 提示信息 */}
      {!isEditing && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 提示：</strong>
            {completion === 100
              ? '你的资料已经100%完善！这将大大提高匹配成功率。'
              : `你的资料完成度为 ${completion}%，完善资料可以提高匹配成功率！`
            }
          </p>
        </div>
      )}
    </div>
  )
}
