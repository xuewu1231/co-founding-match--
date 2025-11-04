'use client'

import { useEffect, useState } from 'react'
import { getAllProfiles } from '@/lib/data-service'
import { getTagNames } from '@/lib/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type Profile = {
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
}

export default function MatchingPoolPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProfiles()
  }, [])

  const loadProfiles = async () => {
    setIsLoading(true)
    try {
      const data = await getAllProfiles()
      setProfiles(data as Profile[])
    } catch (error) {
      console.error('加载名片失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInterest = (profileId: string, name: string) => {
    alert(`你对 ${name} 表达了兴趣！（功能开发中）`)
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">名片池</h1>
        <div className="text-center py-12">
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">名片池</h1>
        <p className="text-gray-600 mt-2">浏览其他创业者的匿名资料，找到你的合伙人</p>
      </div>

      {/* 名片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <Card key={profile.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">{profile.title}</CardTitle>
              <CardDescription className="text-sm text-gray-500">
                匿名用户 #{profile.id.slice(0, 8)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 简介 */}
              <div>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {profile.bio}
                </p>
              </div>

              {/* 寻找方向 */}
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">寻找方向：</p>
                <p className="text-sm text-gray-600">{profile.vision}</p>
              </div>

              {/* 标签 */}
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">标签：</p>
                <div className="flex flex-wrap gap-2">
                  {getTagNames(profile.tags).map((tagName, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tagName}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 操作按钮 */}
              <Button
                className="w-full"
                onClick={() => handleInterest(profile.id, profile.title)}
              >
                我想聊聊
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 空状态 */}
      {profiles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">暂时没有其他用户，快邀请你的朋友加入吧！</p>
        </div>
      )}
    </div>
  )
}
