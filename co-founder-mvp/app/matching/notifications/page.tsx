'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getTagNames } from '@/lib/mock-data'

// Mock通知数据
const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-001',
    senderProfile: {
      id: 'profile-002',
      title: '产品总监',
      bio: '10年互联网产品经验，擅长从0到1，做过3个千万用户产品',
      vision: '寻找技术合伙人，想做企业服务SaaS',
      tags: [2, 3, 12, 17],
    },
    createdAt: '2小时前',
    status: 'pending' // pending, accepted, rejected
  },
  {
    id: 'notif-002',
    senderProfile: {
      id: 'profile-008',
      title: '天使投资人',
      bio: '投资过20+早期项目，3个已上市，想亲自下场做创业者',
      vision: '寻找技术+产品团队，一起做硬科技方向',
      tags: [4, 8, 12, 18],
    },
    createdAt: '5小时前',
    status: 'pending'
  },
  {
    id: 'notif-003',
    senderProfile: {
      id: 'profile-014',
      title: '产品经理',
      bio: '5年B端产品经验，做过多个企业级SaaS产品，想找技术合伙人',
      vision: '想做新一代协作工具',
      tags: [2, 3, 12, 17],
    },
    createdAt: '1天前',
    status: 'pending'
  },
]

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

  const handleAccept = (e: React.MouseEvent, notifId: string, title: string) => {
    e.stopPropagation() // 阻止卡片点击事件
    const updatedNotifications = notifications.map(n =>
      n.id === notifId ? { ...n, status: 'accepted' } : n
    )
    setNotifications(updatedNotifications)

    // 🎯 保存到localStorage
    localStorage.setItem('mock_notifications', JSON.stringify(updatedNotifications))

    // 🎯 触发自定义事件，通知Navbar更新红点
    window.dispatchEvent(new Event('notificationsUpdated'))

    toast.success('匹配成功！', {
      description: `你和 "${title}" 已经建立连接，可以在"已连接"页面查看对方的真实姓名和联系方式！`,
      duration: 4000,
    })
  }

  const handleReject = (e: React.MouseEvent, notifId: string) => {
    e.stopPropagation() // 阻止卡片点击事件
    const updatedNotifications = notifications.map(n =>
      n.id === notifId ? { ...n, status: 'rejected' } : n
    )
    setNotifications(updatedNotifications)

    // 🎯 保存到localStorage
    localStorage.setItem('mock_notifications', JSON.stringify(updatedNotifications))

    // 🎯 触发自定义事件，通知Navbar更新红点
    window.dispatchEvent(new Event('notificationsUpdated'))

    toast('已拒绝该请求', {
      description: '对方不会看到你的真实身份',
      duration: 3000,
    })
  }

  const handleViewProfile = (profileId: string) => {
    router.push(`/profile/${profileId}`)
  }

  const pendingCount = notifications.filter(n => n.status === 'pending').length

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 标题 */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-brand-dark">通知中心</h1>
          {pendingCount > 0 && (
            <Badge className="bg-red-500 text-white px-3 py-1">
              {pendingCount} 条新通知
            </Badge>
          )}
        </div>
        <p className="text-gray-600 mt-2">这些创业者对你表达了兴趣，点击同意后即可看到对方的真实身份</p>
      </div>

      {/* 通知列表 */}
      <div className="space-y-4">
        {notifications.map((notification) => {
          const profile = notification.senderProfile
          const isPending = notification.status === 'pending'
          const isAccepted = notification.status === 'accepted'
          const isRejected = notification.status === 'rejected'

          return (
            <Card
              key={notification.id}
              onClick={() => handleViewProfile(profile.id)}
              className={`
                transition-all cursor-pointer
                ${isPending ? 'border-brand-primary bg-brand-light/30 hover:shadow-lg' : 'border-gray-200 bg-gray-50'}
                ${isAccepted ? 'border-green-300 bg-green-50' : ''}
                ${isRejected ? 'opacity-50' : ''}
              `}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-xl text-brand-dark">
                        {profile.title}
                      </CardTitle>
                      {isPending && (
                        <Badge className="bg-brand-secondary text-white">新</Badge>
                      )}
                      {isAccepted && (
                        <Badge className="bg-green-500 text-white">已接受</Badge>
                      )}
                      {isRejected && (
                        <Badge variant="secondary">已拒绝</Badge>
                      )}
                    </div>
                    <CardDescription className="text-sm">
                      ID: {profile.id.slice(-6).toUpperCase()} · {notification.createdAt}
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

                {/* 操作按钮 */}
                {isPending && (
                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={(e) => handleAccept(e, notification.id, profile.title)}
                      className="flex-1 bg-brand-primary hover:bg-brand-dark text-white"
                    >
                      ✓ 我也想聊聊
                    </Button>
                    <Button
                      onClick={(e) => handleReject(e, notification.id)}
                      variant="outline"
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      暂不考虑
                    </Button>
                  </div>
                )}

                {isAccepted && (
                  <div className="pt-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        window.location.href = '/matching/connections'
                      }}
                      className="w-full bg-green-500 hover:bg-green-600 text-white"
                    >
                      → 查看已连接
                    </Button>
                  </div>
                )}

                {/* 点击查看详情提示 */}
                {isPending && (
                  <div className="text-xs text-gray-400 text-center pt-2 border-t border-gray-200">
                    💡 点击卡片查看完整资料
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 空状态 */}
      {notifications.length === 0 && (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <div className="text-6xl mb-4">🔔</div>
          <p className="text-gray-600 text-lg mb-2">暂无新通知</p>
          <p className="text-gray-400 text-sm">当有人对你表达兴趣时，会在这里显示</p>
          <Button
            onClick={() => window.location.href = '/matching/pool'}
            className="mt-4 bg-brand-primary hover:bg-brand-dark text-white"
          >
            去名片池看看
          </Button>
        </div>
      )}

      {/* 全部已处理状态 */}
      {notifications.length > 0 && pendingCount === 0 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
          <p className="text-green-700">
            ✅ 所有通知已处理完毕！去名片池看看还有没有其他感兴趣的创业者吧
          </p>
          <Button
            onClick={() => window.location.href = '/matching/pool'}
            className="mt-3 bg-brand-primary hover:bg-brand-dark text-white"
          >
            返回名片池
          </Button>
        </div>
      )}
    </div>
  )
}
