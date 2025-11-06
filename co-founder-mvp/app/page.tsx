import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-brand-light/50">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-16">
        <div className="text-center space-y-6">
          {/* Logo/Title */}
          <div className="space-y-2">
            <h1 className="text-5xl font-bold text-brand-dark">
              奇绩引力场
            </h1>
            <p className="text-xl text-gray-600">
              Co-founder Matching Platform
            </p>
          </div>

          {/* Tagline */}
          <p className="text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            为创业者匹配最合适的联合创始人<br/>
            <span className="text-brand-primary font-semibold">匿名浏览 · 双向匹配 · 真实连接</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center pt-6">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-brand-primary hover:bg-brand-dark text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
              >
                立即开始匹配 →
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-brand-primary text-brand-primary hover:bg-brand-light px-8 py-6 text-lg"
              >
                已有账号登录
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-brand-dark mb-12">
          为什么选择奇绩引力场？
        </h2>

        <div className="grid grid-cols-3 gap-8">
          {/* Feature 1 */}
          <Card className="border-brand-light shadow-md hover:shadow-xl transition-shadow">
            <CardContent className="pt-6 space-y-4">
              <div className="text-5xl text-center">🎭</div>
              <h3 className="text-xl font-bold text-brand-dark text-center">
                匿名浏览保护隐私
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                所有创业者的资料以匿名形式展示，只有双方都感兴趣后才会显示真实身份，保护你的隐私安全
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="border-brand-light shadow-md hover:shadow-xl transition-shadow">
            <CardContent className="pt-6 space-y-4">
              <div className="text-5xl text-center">🤝</div>
              <h3 className="text-xl font-bold text-brand-dark text-center">
                双向匹配机制
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                只有双方都对彼此表达兴趣时才会建立连接，避免单方面骚扰，确保每次连接都是有价值的
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="border-brand-light shadow-md hover:shadow-xl transition-shadow">
            <CardContent className="pt-6 space-y-4">
              <div className="text-5xl text-center">🎯</div>
              <h3 className="text-xl font-bold text-brand-dark text-center">
                精准标签筛选
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                通过能力、方向、角色等多维度标签快速筛选，找到能力互补、方向一致的理想合伙人
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-brand-dark mb-12">
          如何开始？
        </h2>

        <div className="grid grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-brand-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
              1
            </div>
            <h3 className="text-lg font-semibold text-brand-dark">注册账号</h3>
            <p className="text-sm text-gray-600">
              使用邮箱快速注册，开始你的合伙人寻找之旅
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-brand-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
              2
            </div>
            <h3 className="text-lg font-semibold text-brand-dark">完善资料</h3>
            <p className="text-sm text-gray-600">
              填写你的背景、能力和创业方向，让其他人了解你
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-brand-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
              3
            </div>
            <h3 className="text-lg font-semibold text-brand-dark">浏览匹配</h3>
            <p className="text-sm text-gray-600">
              在名片池中浏览其他创业者，找到心仪的合伙人
            </p>
          </div>

          {/* Step 4 */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-brand-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
              4
            </div>
            <h3 className="text-lg font-semibold text-brand-dark">建立连接</h3>
            <p className="text-sm text-gray-600">
              双方确认后即可查看真实身份，开始深入交流
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-brand-light/50 py-16 mt-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-brand-primary">20+</div>
              <div className="text-gray-600">活跃创业者</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-brand-primary">100%</div>
              <div className="text-gray-600">匿名保护</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-brand-primary">3步</div>
              <div className="text-gray-600">快速开始</div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-brand-dark mb-4">
          准备好找到你的联合创始人了吗？
        </h2>
        <p className="text-gray-600 mb-8 text-lg">
          加入奇绩引力场，开启你的创业之旅
        </p>
        <Link href="/register">
          <Button
            size="lg"
            className="bg-brand-primary hover:bg-brand-dark text-white px-12 py-6 text-xl shadow-lg hover:shadow-xl transition-all"
          >
            免费开始匹配 →
          </Button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 奇绩引力场 Co-founder Matching Platform · Made with ❤️ by Miracle Plus</p>
        </div>
      </footer>
    </div>
  )
}
