'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StepIndicator } from '@/components/onboarding/StepIndicator'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { saveCompleteProfile } from '@/lib/profile-storage'

// 角色选择
const ROLE_OPTIONS = [
  { id: 16, name: '技术合伙人', icon: '💻', desc: '负责产品技术研发' },
  { id: 17, name: '产品合伙人', icon: '🎨', desc: '负责产品设计和体验' },
  { id: 18, name: '商业合伙人', icon: '💼', desc: '负责商务拓展和融资' },
  { id: 19, name: '运营合伙人', icon: '📊', desc: '负责市场运营和增长' },
]

// 方向标签
const DIRECTION_TAGS = [
  { id: 11, name: 'AIGC' },
  { id: 12, name: '企业服务SaaS' },
  { id: 13, name: '教育' },
  { id: 14, name: '开发者工具' },
  { id: 15, name: '消费级产品' },
]

export default function OnboardingStep3() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<number>(16) // 默认技术合伙人
  const [selectedDirections, setSelectedDirections] = useState<number[]>([11, 12]) // 默认选中2个
  const [errors, setErrors] = useState<{ role?: string; directions?: string }>({})

  const toggleDirection = (directionId: number) => {
    if (selectedDirections.includes(directionId)) {
      setSelectedDirections(selectedDirections.filter(id => id !== directionId))
    } else {
      if (selectedDirections.length >= 3) {
        setErrors({ ...errors, directions: '最多选择3个方向' })
        return
      }
      setSelectedDirections([...selectedDirections, directionId])
      setErrors({ ...errors, directions: undefined })
    }
  }

  const onSubmit = async () => {
    // 验证
    const newErrors: { role?: string; directions?: string } = {}

    if (!selectedRole) {
      newErrors.role = '请选择你寻找的合伙人角色'
    }

    if (selectedDirections.length === 0) {
      newErrors.directions = '请至少选择1个感兴趣的方向'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    // 保存数据
    const step3Data = {
      roleTag: selectedRole,
      directionTags: selectedDirections
    }
    console.log('Step 3 数据:', step3Data)
    localStorage.setItem('onboarding_step3', JSON.stringify(step3Data))

    // 延迟模拟保存
    await new Promise(resolve => setTimeout(resolve, 500))

    // 🎯 新增：合并所有步骤数据并保存完整资料
    const completeProfile = saveCompleteProfile()
    if (completeProfile) {
      console.log('完整资料已保存:', completeProfile)
    }

    // 完成引导，跳转到名片池
    router.push('/matching/pool')

    setIsLoading(false)
  }

  const handleBack = () => {
    router.push('/onboarding/2')
  }

  return (
    <div className="min-h-screen bg-brand-light/30">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* 步骤指示器 */}
        <StepIndicator currentStep={3} totalSteps={3} />

        {/* 主卡片 */}
        <Card className="border-brand-light shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-brand-dark">
              你在寻找什么样的合伙人
            </CardTitle>
            <CardDescription className="text-base mt-2">
              最后一步！告诉我们你想找什么角色的合伙人
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* 角色选择 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  寻找的合伙人角色 <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-gray-500">
                  💡 选择你最需要的合伙人类型
                </p>
              </div>

              {/* 角色卡片网格 */}
              <div className="grid grid-cols-2 gap-4">
                {ROLE_OPTIONS.map((role) => {
                  const isSelected = selectedRole === role.id
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => {
                        setSelectedRole(role.id)
                        setErrors({ ...errors, role: undefined })
                      }}
                      className={`
                        p-4 rounded-lg border-2 text-left transition-all
                        ${isSelected
                          ? 'border-brand-primary bg-brand-light shadow-md'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{role.icon}</span>
                        <div className="flex-1">
                          <div className={`font-semibold mb-1 ${isSelected ? 'text-brand-primary' : 'text-gray-900'}`}>
                            {role.name}
                            {isSelected && ' ✓'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {role.desc}
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              {errors.role && (
                <p className="text-sm text-red-600">{errors.role}</p>
              )}
            </div>

            {/* 方向标签 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  感兴趣的创业方向 <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-gray-500">
                  💡 最多选择3个方向
                </p>
              </div>

              {/* 方向标签 */}
              <div className="flex flex-wrap gap-3">
                {DIRECTION_TAGS.map((tag) => {
                  const isSelected = selectedDirections.includes(tag.id)
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleDirection(tag.id)}
                      className={`
                        px-4 py-2 rounded-lg font-medium transition-all
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

              {/* 已选显示 */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">已选择：</span>
                <span className="font-semibold text-brand-primary">
                  {selectedDirections.length}/3
                </span>
              </div>

              {errors.directions && (
                <p className="text-sm text-red-600">{errors.directions}</p>
              )}
            </div>

            {/* 按钮 */}
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isLoading}
                className="border-gray-300"
              >
                ← 上一步
              </Button>
              <Button
                type="button"
                onClick={onSubmit}
                disabled={isLoading}
                className="bg-brand-primary hover:bg-brand-dark text-white px-8"
              >
                {isLoading ? '完成中...' : '完成 ✓'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 提示信息 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">
            步骤 3/3 · 完成后即可开始浏览其他创业者
          </p>
          <p className="text-xs text-gray-400">
            🎉 你的资料会以匿名形式展示，匹配成功后才会显示真实姓名
          </p>
        </div>
      </div>
    </div>
  )
}
