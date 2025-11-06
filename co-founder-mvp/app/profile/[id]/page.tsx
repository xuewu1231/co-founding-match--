'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getTagNames, MOCK_PROFILES } from '@/lib/mock-data'

export default function ProfileDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)

  // 根据ID查找profile
  const profile = MOCK_PROFILES.find(p => p.id === id)

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-gray-600 text-lg mb-2">找不到该用户</p>
          <Button
            onClick={() => router.push('/matching/pool')}
            className="mt-4 bg-brand-primary hover:bg-brand-dark text-white"
          >
            返回名片池
          </Button>
        </div>
      </div>
    )
  }

  const handleInterest = () => {
    toast.success(`你对 "${profile.title}" 表达了兴趣！`, {
      description: '对方会在通知中心看到你的兴趣，如果对方也对你感兴趣，就会匹配成功',
      duration: 3000,
    })
    setTimeout(() => router.push('/matching/pool'), 1500)
  }

  const handleViewLinkedIn = () => {
    if (profile.linkedin) {
      window.open(profile.linkedin, '_blank')
    } else {
      toast.info('该用户未填写 LinkedIn')
    }
  }

  const handleViewGitHub = () => {
    if (profile.github) {
      window.open(profile.github, '_blank')
    } else {
      toast.info('该用户未填写 GitHub')
    }
  }

  const handleViewWebsite = () => {
    if (profile.website) {
      window.open(profile.website, '_blank')
    } else {
      toast.info('该用户未填写个人网站')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 返回按钮 */}
      <div className="mb-4">
        <Button
          variant="outline"
          onClick={() => router.push('/matching/pool')}
          className="border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          ← 返回名片池
        </Button>
      </div>

      {/* 主卡片 */}
      <Card className="border-brand-light shadow-lg">
        <CardHeader className="bg-brand-light/50 border-b border-brand-light">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* 匿名显示 */}
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-3xl text-brand-dark">
                  {profile.title}
                </CardTitle>
                <Badge variant="secondary" className="bg-brand-secondary/20 text-brand-secondary">
                  匿名资料
                </Badge>
              </div>
              <CardDescription className="text-sm">
                ID: {profile.id.slice(-6).toUpperCase()} · 完成度 {profile.completion}%
              </CardDescription>
            </div>

            {/* 完成度进度条 */}
            <div className="w-32">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-brand-primary h-2 rounded-full transition-all"
                  style={{ width: `${profile.completion}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 text-right mt-1">{profile.completion}%</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* 个人简介 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
              <span>📝</span>
              <span>个人简介</span>
            </h3>
            <p className="text-base text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-lg">
              {profile.bio}
            </p>
          </div>

          {/* 创业愿景 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
              <span>🎯</span>
              <span>寻找方向</span>
            </h3>
            <p className="text-base text-gray-800 leading-relaxed bg-brand-light/30 p-4 rounded-lg">
              {profile.vision}
            </p>
          </div>

          {/* 能力和方向标签 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
              <span>🏷️</span>
              <span>标签</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {getTagNames(profile.tags).map((tagName, index) => (
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

          {/* 分割线 */}
          <div className="border-t border-gray-200 my-6"></div>

          {/* 联系方式预览（匿名状态下隐藏） */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
              <span>🔒</span>
              <span>联系方式（匹配后可见）</span>
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-3">
                表达兴趣并成功匹配后，你将能看到：
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>✓</span>
                  <span>真实姓名</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>✓</span>
                  <span>LinkedIn 主页</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>✓</span>
                  <span>GitHub 主页</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>✓</span>
                  <span>个人网站</span>
                </div>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleInterest}
              className="flex-1 bg-brand-primary hover:bg-brand-dark text-white py-6 text-lg"
            >
              ✨ 我想聊聊
            </Button>
            <Button
              onClick={() => router.push('/matching/pool')}
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 py-6 text-lg"
            >
              返回继续浏览
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 提示信息 */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 提示：</strong>
          这是匿名资料页面。点击"我想聊聊"表达兴趣，如果对方也对你感兴趣，就能看到对方的真实姓名和联系方式！
        </p>
      </div>
    </div>
  )
}
