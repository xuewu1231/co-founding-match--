'use client'

import { useEffect, useState } from 'react'
import { MOCK_MODE, MOCK_USER, MOCK_PROFILES } from '@/lib/mock-data'
import { getAllProfiles } from '@/lib/data-service'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function MockTestPage() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log('========== Mock模式测试 ==========')
    console.log('1. MOCK_MODE:', MOCK_MODE)
    console.log('2. 环境变量:', process.env.NEXT_PUBLIC_MOCK_MODE)
    console.log('3. MOCK_USER:', MOCK_USER)
    console.log('4. MOCK_PROFILES 数量:', MOCK_PROFILES.length)
    console.log('5. MOCK_PROFILES 内容:', MOCK_PROFILES)
    console.log('===================================')

    // 自动加载数据
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      console.log('🔍 开始调用 getAllProfiles()')
      const data = await getAllProfiles()
      console.log('✅ getAllProfiles() 返回:', data)
      console.log('📊 返回数据数量:', data.length)
      setProfiles(data)
    } catch (err: any) {
      console.error('❌ 错误:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">🎭 Mock模式诊断页面</h1>
          <p className="text-gray-600">用于检查Mock模式是否正常工作</p>
        </div>

        {/* 环境信息 */}
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle>📋 环境配置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">MOCK_MODE (代码中):</span>
              <span className={`px-3 py-1 rounded font-bold ${MOCK_MODE ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {String(MOCK_MODE)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">环境变量:</span>
              <span className="px-3 py-1 rounded bg-blue-100 text-blue-800 font-mono text-sm">
                {process.env.NEXT_PUBLIC_MOCK_MODE || 'undefined'}
              </span>
            </div>
            {MOCK_MODE !== (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') && (
              <div className="p-3 bg-red-50 text-red-700 rounded">
                ⚠️ 警告：MOCK_MODE 和环境变量不一致！
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mock数据状态 */}
        <Card className="border-2 border-green-500">
          <CardHeader>
            <CardTitle>📦 Mock数据状态</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">MOCK_USER:</span>
              <span className={`px-3 py-1 rounded ${MOCK_USER ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {MOCK_USER ? '✅ 存在' : '❌ 不存在'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">MOCK_PROFILES 数量:</span>
              <span className="px-3 py-1 rounded bg-green-100 text-green-800 font-bold text-lg">
                {MOCK_PROFILES.length}
              </span>
            </div>
            {MOCK_USER && (
              <div className="p-3 bg-blue-50 rounded">
                <div className="font-medium mb-2">Mock用户信息:</div>
                <pre className="text-xs bg-white p-2 rounded overflow-auto">
                  {JSON.stringify(MOCK_USER, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* API测试结果 */}
        <Card className="border-2 border-purple-500">
          <CardHeader>
            <CardTitle>🔬 getAllProfiles() 测试</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading && (
              <div className="text-center p-4 bg-blue-50 rounded">
                <div className="text-blue-600 font-medium">正在加载...</div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded">
                <div className="font-bold mb-2">❌ 错误:</div>
                <div>{error}</div>
              </div>
            )}

            {!loading && !error && (
              <>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">返回的数据数量:</span>
                  <span className={`px-3 py-1 rounded font-bold text-lg ${
                    profiles.length > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {profiles.length}
                  </span>
                </div>

                {profiles.length > 0 ? (
                  <div className="space-y-2">
                    <div className="font-medium">名片预览:</div>
                    {profiles.map((p, i) => (
                      <div key={i} className="p-3 border-2 border-gray-200 rounded bg-white">
                        <div className="font-bold text-lg">{p.title || '无职位'}</div>
                        <div className="text-sm text-gray-600 mt-1">{p.bio || '无简介'}</div>
                        <div className="text-xs text-gray-500 mt-2">
                          标签数量: {Array.isArray(p.tags) ? p.tags.length : 0}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-yellow-50 text-yellow-800 rounded">
                    ⚠️ getAllProfiles() 返回了空数组！
                  </div>
                )}
              </>
            )}

            <Button onClick={loadData} className="w-full" disabled={loading}>
              🔄 重新测试
            </Button>
          </CardContent>
        </Card>

        {/* 诊断建议 */}
        <Card className="border-2 border-orange-500">
          <CardHeader>
            <CardTitle>💡 诊断结果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              {MOCK_MODE === true ? (
                <div className="p-3 bg-green-50 text-green-800 rounded">
                  ✅ <strong>Mock模式已启用</strong>
                </div>
              ) : (
                <div className="p-3 bg-red-50 text-red-800 rounded">
                  ❌ <strong>Mock模式未启用</strong> - 请检查 .env.local 文件
                </div>
              )}

              {MOCK_PROFILES.length === 5 ? (
                <div className="p-3 bg-green-50 text-green-800 rounded">
                  ✅ <strong>Mock数据正常</strong> - 有5个测试用户
                </div>
              ) : (
                <div className="p-3 bg-red-50 text-red-800 rounded">
                  ❌ <strong>Mock数据异常</strong> - 应该有5个用户，实际有 {MOCK_PROFILES.length} 个
                </div>
              )}

              {profiles.length > 0 ? (
                <div className="p-3 bg-green-50 text-green-800 rounded">
                  ✅ <strong>API工作正常</strong> - getAllProfiles() 返回了 {profiles.length} 个用户
                </div>
              ) : (
                <div className="p-3 bg-red-50 text-red-800 rounded">
                  ❌ <strong>API返回空数据</strong> - getAllProfiles() 没有返回数据
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 快捷链接 */}
        <Card>
          <CardHeader>
            <CardTitle>🔗 快捷测试链接</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a href="/login" className="p-3 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 text-center font-medium">
                → 登录页面
              </a>
              <a href="/matching/pool" className="p-3 bg-green-50 text-green-700 rounded hover:bg-green-100 text-center font-medium">
                → 名片池
              </a>
              <a href="/register" className="p-3 bg-purple-50 text-purple-700 rounded hover:bg-purple-100 text-center font-medium">
                → 注册页面
              </a>
              <a href="/debug" className="p-3 bg-orange-50 text-orange-700 rounded hover:bg-orange-100 text-center font-medium">
                → 调试页面
              </a>
            </div>
          </CardContent>
        </Card>

        {/* 控制台提示 */}
        <div className="text-center text-sm text-gray-500 p-4 bg-gray-100 rounded">
          💡 提示：按 <kbd className="px-2 py-1 bg-white border rounded">F12</kbd> 打开浏览器控制台查看详细日志
        </div>
      </div>
    </div>
  )
}
