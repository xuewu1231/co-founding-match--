'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { StepIndicator } from '@/components/onboarding/StepIndicator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// 表单验证
const step1Schema = z.object({
  name: z.string().min(2, '姓名至少2个字符').max(20, '姓名最多20个字符'),
  title: z.string().min(5, '职位描述至少5个字符').max(50, '职位描述最多50个字符'),
  bio: z.string().min(20, '个人简介至少20个字符').max(200, '个人简介最多200个字符')
})

type Step1FormData = z.infer<typeof step1Schema>

export default function OnboardingStep1() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      name: '张三',
      title: 'AI技术负责人',
      bio: '5年AI研发经验，曾在大厂带团队，现在想找商业合伙人一起创业。擅长深度学习和自然语言处理。'
    }
  })

  const onSubmit = async (data: Step1FormData) => {
    setIsLoading(true)

    // 模拟保存（实际应该保存到状态管理或localStorage）
    console.log('Step 1 数据:', data)
    localStorage.setItem('onboarding_step1', JSON.stringify(data))

    // 延迟一下，模拟保存过程
    await new Promise(resolve => setTimeout(resolve, 500))

    // 跳转到 Step 2
    router.push('/onboarding/2')

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-brand-light/30">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* 步骤指示器 */}
        <StepIndicator currentStep={1} totalSteps={3} />

        {/* 主卡片 */}
        <Card className="border-brand-light shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-brand-dark">
              告诉我们你是谁
            </CardTitle>
            <CardDescription className="text-base mt-2">
              让其他创业者了解你的背景和经验
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* 姓名 */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-semibold">
                  真实姓名 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="例如：张三"
                  {...register('name')}
                  disabled={isLoading}
                  className="text-base"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  💡 你的姓名只有在匹配成功后才会显示给对方
                </p>
              </div>

              {/* 一句话职位 */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-semibold">
                  一句话介绍你的职位/角色 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="例如：AI技术负责人 / 连续创业者 / 产品总监"
                  {...register('title')}
                  disabled={isLoading}
                  className="text-base"
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  💡 这会显示在你的名片上，让人快速了解你的定位
                </p>
              </div>

              {/* 个人简介 */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-base font-semibold">
                  个人简介 <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="bio"
                  rows={5}
                  placeholder="介绍一下你的经历、优势和特长..."
                  {...register('bio')}
                  disabled={isLoading}
                  className="text-base resize-none"
                />
                {errors.bio && (
                  <p className="text-sm text-red-600">{errors.bio.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  💡 200字以内，让潜在合伙人了解你的背景和能力
                </p>
              </div>

              {/* 按钮 */}
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/login')}
                  disabled={isLoading}
                  className="border-gray-300"
                >
                  返回登录
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-brand-primary hover:bg-brand-dark text-white px-8"
                >
                  {isLoading ? '保存中...' : '下一步 →'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 提示信息 */}
        <div className="mt-6 text-center text-sm text-gray-500">
          步骤 1/3 · 大约需要 2 分钟完成
        </div>
      </div>
    </div>
  )
}
