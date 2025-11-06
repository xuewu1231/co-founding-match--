'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getTagNames, MOCK_PROFILES } from '@/lib/mock-data'

// Mock已连接数据
const MOCK_CONNECTIONS = [
  {
    id: 'connection-001',
    connectedProfile: MOCK_PROFILES[2], // 王五 - 连续创业者
    connectedAt: '2025-11-03',
    displayDate: '2天前',
  },
  {
    id: 'connection-002',
    connectedProfile: MOCK_PROFILES[1], // 李四 - 产品总监
    connectedAt: '2025-11-04',
    displayDate: '1天前',
  },
  {
    id: 'connection-003',
    connectedProfile: MOCK_PROFILES[4], // 孙七 - 市场运营专家
    connectedAt: '2025-11-05',
    displayDate: '今天',
  },
]

export default function ConnectionsPage() {
  const [connections] = useState(MOCK_CONNECTIONS)

  const handleViewLinkedIn = (url: string | null) => {
    if (url) {
      window.open(url, '_blank')
    } else {
      toast.info('该用户未填写 LinkedIn')
    }
  }

  const handleViewGitHub = (url: string | null) => {
    if (url) {
      window.open(url, '_blank')
    } else {
      toast.info('该用户未填写 GitHub')
    }
  }

  const handleViewWebsite = (url: string | null) => {
    if (url) {
      window.open(url, '_blank')
    } else {
      toast.info('该用户未填写个人网站')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 标题 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-brand-dark">已连接</h1>
        <p className="text-gray-600 mt-2">
          你和这些创业者已经成功匹配，可以查看真实身份和联系方式
        </p>
        <div className="mt-3">
          <Badge className="bg-brand-secondary text-white px-3 py-1">
            {connections.length} 个连接
          </Badge>
        </div>
      </div>

      {/* 连接列表 */}
      <div className="space-y-4">
        {connections.map((connection) => {
          const profile = connection.connectedProfile

          return (
            <Card
              key={connection.id}
              className="border-green-300 bg-green-50/30 hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {/* 真实姓名 - 大号显示 */}
                      <CardTitle className="text-2xl text-brand-dark">
                        {profile.name}
                      </CardTitle>
                      <Badge className="bg-green-500 text-white">✓ 已匹配</Badge>
                    </div>

                    {/* 职位 */}
                    <div className="text-lg font-semibold text-gray-700 mb-1">
                      {profile.title}
                    </div>

                    <CardDescription className="text-sm">
                      {connection.displayDate}连接
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* 简介 */}
                <div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {profile.bio}
                  </p>
                </div>

                {/* 寻找方向 */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">寻找：</p>
                  <p className="text-sm text-gray-900">{profile.vision}</p>
                </div>

                {/* 标签 */}
                <div className="flex flex-wrap gap-2">
                  {getTagNames(profile.tags).map((tagName, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-brand-light text-brand-dark">
                      {tagName}
                    </Badge>
                  ))}
                </div>

                {/* 分割线 */}
                <div className="border-t border-gray-200 my-4"></div>

                {/* 联系方式 */}
                <div>
                  <p className="text-sm font-semibold text-brand-dark mb-3">
                    📞 联系方式
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {/* LinkedIn */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewLinkedIn(profile.linkedin)}
                      disabled={!profile.linkedin}
                      className={`
                        ${profile.linkedin
                          ? 'border-blue-500 text-blue-600 hover:bg-blue-50'
                          : 'opacity-40 cursor-not-allowed'
                        }
                      `}
                    >
                      {profile.linkedin ? '🔗 LinkedIn' : '🔗 LinkedIn (未填写)'}
                    </Button>

                    {/* GitHub */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewGitHub(profile.github)}
                      disabled={!profile.github}
                      className={`
                        ${profile.github
                          ? 'border-gray-700 text-gray-800 hover:bg-gray-50'
                          : 'opacity-40 cursor-not-allowed'
                        }
                      `}
                    >
                      {profile.github ? '🐱 GitHub' : '🐱 GitHub (未填写)'}
                    </Button>

                    {/* 个人网站 */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewWebsite(profile.website)}
                      disabled={!profile.website}
                      className={`
                        ${profile.website
                          ? 'border-brand-primary text-brand-primary hover:bg-brand-light'
                          : 'opacity-40 cursor-not-allowed'
                        }
                      `}
                    >
                      {profile.website ? '🌐 个人网站' : '🌐 个人网站 (未填写)'}
                    </Button>
                  </div>

                  {/* 提示：如何进一步联系 */}
                  <p className="text-xs text-gray-500 mt-3">
                    💡 点击上方按钮查看对方的社交主页，通过LinkedIn或其他方式联系对方
                  </p>
                </div>

                {/* 操作按钮 */}
                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
                    onClick={() => toast.info('聊天功能即将上线！', {
                      description: '您可以先通过 LinkedIn 等社交平台联系对方',
                      duration: 3000,
                    })}
                  >
                    💬 发送消息 (即将上线)
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 空状态 */}
      {connections.length === 0 && (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <div className="text-6xl mb-4">🤝</div>
          <p className="text-gray-600 text-lg mb-2">还没有连接的创业者</p>
          <p className="text-gray-400 text-sm mb-4">
            去名片池看看，找到感兴趣的创业者表达兴趣吧
          </p>
          <Button
            onClick={() => window.location.href = '/matching/pool'}
            className="mt-2 bg-brand-primary hover:bg-brand-dark text-white"
          >
            去名片池看看
          </Button>
        </div>
      )}

      {/* 提示信息 */}
      {connections.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 提示：</strong>
            成功连接后，你可以查看对方的真实姓名和联系方式。建议主动通过 LinkedIn 或其他方式联系对方，开启你们的合作之旅！
          </p>
        </div>
      )}
    </div>
  )
}
