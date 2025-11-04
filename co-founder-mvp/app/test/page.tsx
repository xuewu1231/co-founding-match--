'use client'

import { useEffect, useState } from 'react'
import { MOCK_MODE, MOCK_USER, MOCK_PROFILES } from '@/lib/mock-data'
import { getAllProfiles } from '@/lib/data-service'

export default function TestPage() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [error, setError] = useState<string>('')

  useEffect(() => {
    console.log('=== 测试开始 ===')
    console.log('1. MOCK_MODE:', MOCK_MODE)
    console.log('2. MOCK_USER:', MOCK_USER)
    console.log('3. MOCK_PROFILES 数量:', MOCK_PROFILES.length)
    console.log('4. MOCK_PROFILES:', MOCK_PROFILES)

    // 测试加载
    loadData()
  }, [])

  const loadData = async () => {
    try {
      console.log('5. 开始调用 getAllProfiles()')
      const data = await getAllProfiles()
      console.log('6. getAllProfiles() 返回:', data)
      console.log('7. 返回数据数量:', data.length)
      setProfiles(data)
    } catch (err: any) {
      console.error('8. 错误:', err)
      setError(err.message)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Mock模式测试页面</h1>

      {/* 环境信息 */}
      <div className="bg-blue-50 p-4 rounded mb-4">
        <h2 className="font-bold mb-2">环境信息</h2>
        <div className="text-sm space-y-1">
          <div>MOCK_MODE: <strong>{String(MOCK_MODE)}</strong></div>
          <div>环境变量: <strong>{process.env.NEXT_PUBLIC_MOCK_MODE}</strong></div>
        </div>
      </div>

      {/* Mock数据 */}
      <div className="bg-green-50 p-4 rounded mb-4">
        <h2 className="font-bold mb-2">Mock数据</h2>
        <div className="text-sm space-y-1">
          <div>MOCK_USER: {MOCK_USER ? '✅ 存在' : '❌ 不存在'}</div>
          <div>MOCK_PROFILES 数量: <strong>{MOCK_PROFILES.length}</strong></div>
        </div>
      </div>

      {/* 加载的数据 */}
      <div className="bg-yellow-50 p-4 rounded mb-4">
        <h2 className="font-bold mb-2">getAllProfiles() 返回的数据</h2>
        {error ? (
          <div className="text-red-600">错误: {error}</div>
        ) : (
          <div className="text-sm space-y-2">
            <div>数据数量: <strong>{profiles.length}</strong></div>
            {profiles.length > 0 ? (
              <div className="space-y-2">
                {profiles.map((p, i) => (
                  <div key={i} className="border p-2 rounded bg-white">
                    <div><strong>{p.title}</strong></div>
                    <div className="text-xs text-gray-600">{p.bio}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">暂无数据</div>
            )}
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="space-x-2">
        <button
          onClick={loadData}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          重新加载数据
        </button>
        <button
          onClick={() => console.log('当前 profiles:', profiles)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          打印到控制台
        </button>
      </div>

      {/* 控制台提示 */}
      <div className="mt-4 text-sm text-gray-600">
        💡 提示：打开浏览器控制台（F12）查看详细日志
      </div>
    </div>
  )
}
