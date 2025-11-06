'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StepIndicator } from '@/components/onboarding/StepIndicator'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// 能力标签（从 mock-data.ts 的标签）
const ABILITY_TAGS = [
  { id: 1, name: 'AI技术研发' },
  { id: 2, name: '产品从0到1' },
  { id: 3, name: '增长营销' },
  { id: 4, name: '融资能力' },
  { id: 5, name: '团队管理' },
  { id: 6, name: '数据分析' },
  { id: 7, name: '设计能力' },
  { id: 8, name: '商业拓展' },
  { id: 9, name: '技术架构' },
  { id: 10, name: '内容运营' },
]

export default function OnboardingStep2() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTags, setSelectedTags] = useState<number[]>([1, 2, 6]) // 默认选中3个
  const [vision, setVision] = useState('想做AIGC方向的创业项目，希望找到商业合伙人一起打造面向C端用户的AI产品')
  const [errors, setErrors] = useState<{ tags?: string; vision?: string }>({})

  const toggleTag = (tagId: number) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId))
    } else {
      if (selectedTags.length >= 5) {
        setErrors({ ...errors, tags: '最多选择5个能力标签' })
        return
      }
      setSelectedTags([...selectedTags, tagId])
      setErrors({ ...errors, tags: undefined })
    }
  }

  const onSubmit = async () => {
    // 验证
    const newErrors: { tags?: string; vision?: string } = {}

    if (selectedTags.length === 0) {
      newErrors.tags = '请至少选择1个能力标签'
    }

    if (vision.trim().length < 10) {
      newErrors.vision = '创业愿景至少10个字符'
    }

    if (vision.trim().length > 100) {
      newErrors.vision = '创业愿景最多100个字符'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    // 保存数据
    const step2Data = {
      abilityTags: selectedTags,
      vision: vision.trim()
    }
    console.log('Step 2 数据:', step2Data)
    localStorage.setItem('onboarding_step2', JSON.stringify(step2Data))

    // 延迟模拟保存
    await new Promise(resolve => setTimeout(resolve, 500))

    // 跳转到 Step 3
    router.push('/onboarding/3')

    setIsLoading(false)
  }

  const handleBack = () => {
    router.push('/onboarding/1')
  }

  return (
    <div className="min-h-screen bg-brand-light/30">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* 步骤指示器 */}
        <StepIndicator currentStep={2} totalSteps={3} />

        {/* 主卡片 */}
        <Card className="border-brand-light shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-brand-dark">
              你的能力和愿景
            </CardTitle>
            <CardDescription className="text-base mt-2">
              告诉我们你擅长什么，以及你的创业方向
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* 能力标签选择 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  选择你的能力标签 <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-gray-500">
                  💡 最多选择5个，这些标签会显示在你的名片上
                </p>
              </div>

              {/* 标签网格 */}
              <div className="flex flex-wrap gap-3">
                {ABILITY_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag.id)
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
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

              {/* 已选标签显示 */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">已选择：</span>
                <span className="font-semibold text-brand-primary">
                  {selectedTags.length}/5
                </span>
              </div>

              {errors.tags && (
                <p className="text-sm text-red-600">{errors.tags}</p>
              )}
            </div>

            {/* 创业愿景 */}
            <div className="space-y-2">
              <Label htmlFor="vision" className="text-base font-semibold">
                你的创业愿景 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="vision"
                rows={4}
                placeholder="例如：想做AIGC方向的创业项目，希望找到商业合伙人..."
                value={vision}
                onChange={(e) => {
                  setVision(e.target.value)
                  setErrors({ ...errors, vision: undefined })
                }}
                disabled={isLoading}
                className="text-base resize-none"
              />
              <div className="flex justify-between text-xs">
                <p className="text-gray-500">
                  💡 100字以内，描述你想做什么方向的创业项目
                </p>
                <p className={vision.length > 100 ? 'text-red-500' : 'text-gray-400'}>
                  {vision.length}/100
                </p>
              </div>
              {errors.vision && (
                <p className="text-sm text-red-600">{errors.vision}</p>
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
                {isLoading ? '保存中...' : '下一步 →'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 提示信息 */}
        <div className="mt-6 text-center text-sm text-gray-500">
          步骤 2/3 · 还有最后一步就完成了！
        </div>
      </div>
    </div>
  )
}
