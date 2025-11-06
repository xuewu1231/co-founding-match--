'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { getAllProfiles } from '@/lib/data-service'
import { getTagNames, MOCK_TAGS, MOCK_MY_PROFILE } from '@/lib/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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
  completion?: number
  created_at?: string
}

type ProfileWithMatch = Profile & {
  matchScore: number
}

// 筛选标签（能力+方向）
const FILTER_TAGS = [
  { id: 0, name: '全部' },
  { id: 1, name: 'AI技术研发' },
  { id: 2, name: '产品从0到1' },
  { id: 3, name: '增长营销' },
  { id: 11, name: 'AIGC' },
  { id: 12, name: '企业服务SaaS' },
  { id: 13, name: '教育' },
  { id: 14, name: '开发者工具' },
  { id: 15, name: '消费级产品' },
]

export default function MatchingPoolPage() {
  const router = useRouter()
  const [allProfiles, setAllProfiles] = useState<ProfileWithMatch[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<ProfileWithMatch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState(0) // 0表示全部
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'match' | 'completion' | 'recent'>('match')
  const [interestedIds, setInterestedIds] = useState<string[]>([])
  const [showScrollTop, setShowScrollTop] = useState(false)

  // 从localStorage加载已表达兴趣的ID
  useEffect(() => {
    const saved = localStorage.getItem('interested_profiles')
    if (saved) {
      setInterestedIds(JSON.parse(saved))
    }
  }, [])

  // 监听滚动显示返回顶部按钮
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    loadProfiles()
  }, [])

  // 计算匹配度
  const calculateMatchScore = (profile: Profile): number => {
    const myTags = MOCK_MY_PROFILE.tags
    const theirTags = profile.tags
    const commonTags = myTags.filter(tag => theirTags.includes(tag))
    const totalUniqueTags = new Set([...myTags, ...theirTags]).size
    return totalUniqueTags > 0 ? Math.round((commonTags.length / totalUniqueTags) * 100) : 0
  }

  // 根据ID生成头像颜色
  const getAvatarColor = (id: string): string => {
    const colors = [
      'bg-red-500',
      'bg-orange-500',
      'bg-amber-500',
      'bg-yellow-500',
      'bg-lime-500',
      'bg-green-500',
      'bg-emerald-500',
      'bg-teal-500',
      'bg-cyan-500',
      'bg-sky-500',
      'bg-blue-500',
      'bg-indigo-500',
      'bg-violet-500',
      'bg-purple-500',
      'bg-fuchsia-500',
      'bg-pink-500',
      'bg-rose-500',
    ]
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  // 获取姓名首字母
  const getInitial = (title: string): string => {
    return title.charAt(0).toUpperCase()
  }

  // 模拟在线状态（基于ID）
  const getOnlineStatus = (id: string): { isOnline: boolean; lastActive: string } => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const statuses = [
      { isOnline: true, lastActive: '在线' },
      { isOnline: false, lastActive: '5分钟前' },
      { isOnline: false, lastActive: '1小时前' },
      { isOnline: false, lastActive: '今天' },
      { isOnline: false, lastActive: '昨天' },
    ]
    return statuses[hash % statuses.length]
  }

  useEffect(() => {
    // 应用筛选、搜索和排序
    let filtered = allProfiles

    // 标签筛选
    if (selectedFilter !== 0) {
      filtered = filtered.filter(profile =>
        profile.tags.includes(selectedFilter)
      )
    }

    // 搜索筛选
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(profile =>
        profile.title.toLowerCase().includes(query) ||
        profile.bio.toLowerCase().includes(query) ||
        profile.vision.toLowerCase().includes(query)
      )
    }

    // 排序
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'match') {
        return b.matchScore - a.matchScore
      } else if (sortBy === 'completion') {
        return (b.completion || 0) - (a.completion || 0)
      } else if (sortBy === 'recent') {
        return (b.created_at || '').localeCompare(a.created_at || '')
      }
      return 0
    })

    setFilteredProfiles(sorted)
  }, [selectedFilter, allProfiles, searchQuery, sortBy])

  const loadProfiles = async () => {
    setIsLoading(true)
    try {
      const data = await getAllProfiles() as any[]
      // 添加匹配度
      const withMatch: ProfileWithMatch[] = data.map(profile => ({
        ...profile,
        matchScore: calculateMatchScore(profile)
      }))
      setAllProfiles(withMatch)
      setFilteredProfiles(withMatch)
    } catch (error) {
      console.error('加载名片失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCardClick = (profileId: string) => {
    router.push(`/profile/${profileId}`)
  }

  const handleInterest = (e: React.MouseEvent, profileId: string, title: string) => {
    // 阻止事件冒泡，避免触发卡片点击
    e.stopPropagation()

    // 保存到localStorage
    const newInterestedIds = [...interestedIds, profileId]
    setInterestedIds(newInterestedIds)
    localStorage.setItem('interested_profiles', JSON.stringify(newInterestedIds))

    toast.success(`你对 "${title}" 表达了兴趣！`, {
      description: '对方会在通知中心看到你的兴趣，如果对方也对你感兴趣，就会匹配成功',
      duration: 3000,
    })
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-brand-dark mb-6">名片池</h1>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
          <p className="text-gray-600 mt-4">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* 标题 - Apple风格 */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-brand-dark tracking-tight">名片池</h1>
        <p className="text-gray-500 mt-3 text-lg">浏览其他创业者的匿名资料，找到你的合伙人</p>
      </div>

      {/* 搜索和排序 - Apple风格 */}
      <div className="mb-6 flex gap-4">
        {/* 搜索框 */}
        <div className="flex-1">
          <Input
            type="text"
            placeholder="🔍 搜索职位、简介、愿景..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 rounded-xl border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
          />
        </div>

        {/* 排序选择器 */}
        <div className="w-52">
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="h-12 rounded-xl border-gray-200">
              <SelectValue placeholder="排序方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="match">按匹配度排序</SelectItem>
              <SelectItem value="completion">按完成度排序</SelectItem>
              <SelectItem value="recent">按最近加入排序</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 筛选器 - Apple风格 */}
      <div className="mb-8 p-6 bg-white rounded-2xl apple-card-shadow border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-base font-semibold text-brand-dark">筛选标签</span>
          <Badge variant="secondary" className="bg-brand-primary/10 text-brand-primary border-0 font-medium">
            {filteredProfiles.length} 个结果
          </Badge>
        </div>
        <div className="flex flex-wrap gap-3">
          {FILTER_TAGS.map((tag) => {
            const isSelected = selectedFilter === tag.id
            return (
              <button
                key={tag.id}
                onClick={() => setSelectedFilter(tag.id)}
                className={`
                  px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200
                  ${isSelected
                    ? 'bg-brand-primary text-white apple-button-shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
                  }
                `}
              >
                {tag.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* 名片网格 - 电脑端固定一排5个 */}
      <div className="grid grid-cols-5 gap-6">
        {filteredProfiles.map((profile, index) => {
          const isInterested = interestedIds.includes(profile.id)
          const avatarColor = getAvatarColor(profile.id)
          const initial = getInitial(profile.title)
          const status = getOnlineStatus(profile.id)

          return (
            <Card
              key={profile.id}
              onClick={() => handleCardClick(profile.id)}
              style={{
                animationDelay: `${index * 40}ms`,
              }}
              className="animate-fade-in apple-card-shadow hover:apple-card-shadow-hover hover:scale-[1.02] transition-all duration-300 ease-out border-gray-100 rounded-2xl flex flex-col h-full cursor-pointer group active:scale-[0.98] relative bg-white"
            >
              {/* 匹配度角标 - Apple风格 */}
              <div className="absolute top-3 right-3 z-10 transition-transform group-hover:scale-110">
                <Badge
                  className={`${
                    profile.matchScore >= 70
                      ? 'bg-green-500'
                      : profile.matchScore >= 40
                      ? 'bg-brand-primary'
                      : 'bg-gray-400'
                  } text-white text-xs px-3 py-1 rounded-full border-0 font-medium`}
                >
                  {profile.matchScore}% 匹配
                </Badge>
              </div>

              <CardHeader className="pb-4">
                {/* 头像 + 在线状态 - Apple风格 */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative group/avatar">
                    <div
                      className={`w-14 h-14 rounded-full ${avatarColor} flex items-center justify-center text-white font-semibold text-xl shadow-sm transition-all duration-300 group-hover:scale-105`}
                    >
                      {initial}
                    </div>
                    {/* 在线状态点 */}
                    {status.isOnline && (
                      <div className="absolute bottom-0 right-0">
                        <span className="relative flex h-3.5 w-3.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border-2 border-white"></span>
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base font-semibold text-brand-dark line-clamp-1 group-hover:text-brand-primary transition-colors">
                      {profile.title}
                    </CardTitle>
                    <div className="flex items-center gap-1.5 mt-1 text-xs">
                      <CardDescription className="text-xs text-gray-400 font-mono">
                        {profile.id.slice(-6).toUpperCase()}
                      </CardDescription>
                      <span className="text-gray-300">·</span>
                      <span className={`${status.isOnline ? 'text-green-500 font-medium' : 'text-gray-400'}`}>
                        {status.lastActive}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col justify-between space-y-4 pt-0">
                {/* 简介 - Apple风格 */}
                <div>
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {profile.bio}
                  </p>
                </div>

                {/* 寻找方向 - Apple风格 */}
                <div className="bg-gray-50 p-3 rounded-xl transition-all duration-200 group-hover:bg-brand-light/30">
                  <p className="text-xs font-medium text-gray-500 mb-1">寻找</p>
                  <p className="text-sm text-brand-dark line-clamp-2">{profile.vision}</p>
                </div>

                {/* 标签 - Apple风格 */}
                <div>
                  <div className="flex flex-wrap gap-1.5">
                    {getTagNames(profile.tags).slice(0, 3).map((tagName, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-md border-0 font-medium hover:bg-brand-primary/10 hover:text-brand-primary transition-colors"
                      >
                        {tagName}
                      </Badge>
                    ))}
                    {getTagNames(profile.tags).length > 3 && (
                      <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-md border-0">
                        +{getTagNames(profile.tags).length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* 按钮 - Apple风格 */}
                {isInterested ? (
                  <Button
                    disabled
                    className="w-full bg-gray-100 text-gray-500 cursor-not-allowed mt-auto rounded-xl h-11 font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-base">✓</span> 已表达兴趣
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white transition-all duration-200 mt-auto rounded-xl h-11 font-medium apple-button-shadow hover:apple-button-shadow-hover active:scale-95"
                    onClick={(e) => handleInterest(e, profile.id, profile.title)}
                  >
                    <span className="inline-block text-base">💬</span> 我想聊聊
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 空状态 - Apple风格 */}
      {filteredProfiles.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl apple-card-shadow border border-gray-100">
          <div className="text-7xl mb-6">🔍</div>
          <p className="text-brand-dark text-xl font-semibold mb-2">没有找到匹配的创业者</p>
          <p className="text-gray-500 text-base mb-6">试试其他筛选标签吧</p>
          <Button
            onClick={() => setSelectedFilter(0)}
            className="bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl px-8 h-12 font-medium apple-button-shadow"
          >
            查看全部
          </Button>
        </div>
      )}

      {/* 返回顶部按钮 - Apple风格 */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-full apple-button-shadow hover:apple-button-shadow-hover transition-all duration-300 flex items-center justify-center group animate-slide-in hover:scale-110 active:scale-95"
          aria-label="返回顶部"
        >
          <svg
            className="w-6 h-6 transition-transform group-hover:-translate-y-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  )
}
