'use client'

import { useState } from 'react'
import { signIn, getCurrentUser } from '@/lib/auth-service'
import { getAllProfiles } from '@/lib/data-service'
import { MOCK_MODE, MOCK_USER, MOCK_PROFILES } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DebugPage() {
  const [results, setResults] = useState<any[]>([])

  const addResult = (test: string, result: any) => {
    setResults(prev => [...prev, { test, result, time: new Date().toLocaleTimeString() }])
  }

  const testMockMode = () => {
    addResult('MOCK_MODE 常量', MOCK_MODE)
    addResult('环境变量', process.env.NEXT_PUBLIC_MOCK_MODE)
  }

  const testSignIn = async () => {
    try {
      const result = await signIn('test@test.com', '12345678')
      addResult('signIn 测试', result)
    } catch (error) {
      addResult('signIn 错误', error)
    }
  }

  const testGetCurrentUser = async () => {
    try {
      const user = await getCurrentUser()
      addResult('getCurrentUser 测试', user)
    } catch (error) {
      addResult('getCurrentUser 错误', error)
    }
  }

  const testGetAllProfiles = async () => {
    try {
      const profiles = await getAllProfiles()
      addResult('getAllProfiles 测试', { count: profiles.length, first: profiles[0] })
    } catch (error) {
      addResult('getAllProfiles 错误', error)
    }
  }

  const testMockData = () => {
    addResult('MOCK_USER', MOCK_USER)
    addResult('MOCK_PROFILES 数量', MOCK_PROFILES.length)
    addResult('MOCK_PROFILES[0]', MOCK_PROFILES[0])
  }

  const clearResults = () => setResults([])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>🔍 Mock模式调试页面</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 测试按钮 */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={testMockMode}>测试Mock模式</Button>
            <Button onClick={testSignIn}>测试登录</Button>
            <Button onClick={testGetCurrentUser}>测试获取用户</Button>
            <Button onClick={testGetAllProfiles}>测试获取名片</Button>
            <Button onClick={testMockData}>测试Mock数据</Button>
            <Button variant="outline" onClick={clearResults}>清空结果</Button>
          </div>

          {/* 环境信息 */}
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-bold mb-2">环境信息</h3>
            <pre className="text-sm">
              MOCK_MODE: {String(MOCK_MODE)}
              {'\n'}NEXT_PUBLIC_MOCK_MODE: {process.env.NEXT_PUBLIC_MOCK_MODE}
              {'\n'}当前时间: {new Date().toLocaleString()}
            </pre>
          </div>

          {/* 测试结果 */}
          <div className="space-y-2">
            <h3 className="font-bold">测试结果：</h3>
            {results.length === 0 ? (
              <p className="text-gray-500">点击上面的按钮开始测试</p>
            ) : (
              results.map((result, index) => (
                <div key={index} className="bg-white border p-3 rounded">
                  <div className="flex justify-between items-start">
                    <strong>{result.test}</strong>
                    <span className="text-xs text-gray-500">{result.time}</span>
                  </div>
                  <pre className="text-sm mt-2 bg-gray-50 p-2 rounded overflow-auto">
                    {JSON.stringify(result.result, null, 2)}
                  </pre>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}