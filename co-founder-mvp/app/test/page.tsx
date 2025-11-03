import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Tag } from '@/types/database.types'

export default async function TestPage() {
  const supabase = await createClient()

  // 测试1: 获取所有标签
  const { data: tags, error: tagsError } = await supabase
    .from('tags')
    .select('*')
    .order('category, name')

  // 测试2: 获取标签统计
  const { data: tagStats, error: statsError } = await supabase
    .from('tags')
    .select('category')
    .eq('is_system', true)

  // 计算各类别标签数量
  const categoryCounts = tagStats?.reduce((acc, tag) => {
    acc[tag.category] = (acc[tag.category] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  if (tagsError || statsError) {
    return (
      <div className="min-h-screen p-8 bg-red-50">
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-800">❌ 数据库连接失败</CardTitle>
              <CardDescription className="text-red-600">
                请检查Supabase配置和网络连接
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>标签错误:</strong> {tagsError?.message || '无'}</p>
                <p><strong>统计错误:</strong> {statsError?.message || '无'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // 按类别分组标签
  const tagsByCategory = tags?.reduce((acc, tag) => {
    if (!acc[tag.category]) acc[tag.category] = []
    acc[tag.category].push(tag)
    return acc
  }, {} as Record<string, Tag[]>) || {}

  return (
    <div className="min-h-screen p-8 bg-green-50">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 成功提示 */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              ✅ 数据库连接成功！
            </CardTitle>
            <CardDescription className="text-green-700">
              恭喜！你的Co-founder Matching数据库已经正常工作了
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{tags?.length || 0}</div>
                <div className="text-sm text-gray-600">总标签数</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{categoryCounts.ability || 0}</div>
                <div className="text-sm text-gray-600">能力标签</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{categoryCounts.direction || 0}</div>
                <div className="text-sm text-gray-600">方向标签</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 系统标签展示 */}
        <div className="space-y-6">
          {Object.entries(tagsByCategory).map(([category, categoryTags]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="capitalize">
                  {category === 'ability' && '💪 能力标签'}
                  {category === 'direction' && '🎯 方向标签'}
                  {category === 'role' && '👥 角色标签'}
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({categoryTags.length}个)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {categoryTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={tag.is_system ? 'default' : 'secondary'}
                      className="text-sm"
                    >
                      {tag.name}
                      {tag.usage_count > 0 && (
                        <span className="ml-1 text-xs opacity-60">
                          ({tag.usage_count})
                        </span>
                      )}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 技术信息 */}
        <Card>
          <CardHeader>
            <CardTitle>🔧 技术信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>数据库类型:</strong> PostgreSQL (Supabase)
              </div>
              <div>
                <strong>前端框架:</strong> Next.js 16 + TypeScript
              </div>
              <div>
                <strong>UI组件:</strong> shadcn/ui + Tailwind CSS
              </div>
              <div>
                <strong>数据表:</strong> 5张表 (profiles, tags, user_tags, interests, connections)
              </div>
              <div>
                <strong>认证系统:</strong> Supabase Auth (已配置)
              </div>
              <div>
                <strong>类型安全:</strong> 完整的TypeScript类型定义
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 下一步指导 */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">🚀 恭喜完成Day 1！</CardTitle>
            <CardDescription className="text-blue-700">
              你的Co-founder Matching MVP基础设施已经搭建完成
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm">
                <strong>今天完成的工作:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                  <li>✅ Next.js 16项目创建成功</li>
                  <li>✅ shadcn/ui组件库配置完成</li>
                  <li>✅ Supabase数据库连接成功</li>
                  <li>✅ 5张核心数据表创建完成</li>
                  <li>✅ 25个系统标签数据插入成功</li>
                  <li>✅ TypeScript类型定义生成完成</li>
                  <li>✅ 数据库连接测试通过</li>
                </ul>
              </div>

              <div className="text-sm">
                <strong>明天Day 2计划:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                  <li>🔐 用户注册和登录功能</li>
                  <li>🎨 创建导航栏组件</li>
                  <li>🔒 路由保护（未登录自动跳转）</li>
                  <li>📄 基础页面布局</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}