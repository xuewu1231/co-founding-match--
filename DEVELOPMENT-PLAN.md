# Co-founder Matching MVP - 7天开发计划

> 适合独立小白开发者的一周冲刺计划
> 每天6-8小时，完成一个核心功能模块

---

## 📅 开发日历概览

| 日期 | 核心任务 | 预期产出 | 验收标准 |
|------|---------|---------|---------|
| **Day 1** | 项目初始化+数据库设计 | 可运行的Next.js项目+Supabase数据库 | npm run dev能启动 |
| **Day 2** | 认证系统+基础布局 | 用户能注册登录 | 登录后看到导航栏 |
| **Day 3** | Profile引导流程 | 新用户完成3步Profile | 填完后跳转名片池 |
| **Day 4** | 名片池+标签筛选 | 看到匿名卡片+能筛选 | 点击标签刷新列表 |
| **Day 5** | 兴趣表达+双向匹配 | 能点"我想聊聊"+自动匹配 | 双向匹配后收到邮件 |
| **Day 6** | 已连接+Profile查看 | 能看到匹配的人+查看资料 | 已连接显示真实姓名 |
| **Day 7** | 测试+优化+部署 | 部署到Vercel | 朋友能访问URL |

---

## 🚀 Day 1: 项目初始化 + 数据库设计

### 🎯 目标
搭建开发环境，创建Next.js项目，配置Supabase，建立数据库表结构。

### ✅ 任务清单

#### 1. 创建Next.js项目 (30分钟)
```bash
# 创建项目
npx create-next-app@latest co-founder-mvp --typescript --tailwind --app --no-src-dir

cd co-founder-mvp

# 安装依赖
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install @supabase/ssr
npm install react-hook-form zod @hookform/resolvers
npm install zustand
npm install @tanstack/react-query

# 安装shadcn/ui
npx shadcn-ui@latest init
# 选择: Default, Slate, yes to all

# 添加常用组件
npx shadcn-ui@latest add button card input label select form toast
```

#### 2. 创建Supabase项目 (20分钟)
- 访问 https://supabase.com
- 点击 "New Project"
- 填写:
  - Project Name: `co-founder-mvp`
  - Database Password: 设置并**记录下来**
  - Region: 选择 `Northeast Asia (Tokyo)` (离中国最近)
- 等待项目创建完成 (约2分钟)

#### 3. 配置环境变量 (10分钟)
```bash
# 创建 .env.local 文件
touch .env.local
```

在 Supabase Dashboard:
- 点击左侧 "Project Settings" → "API"
- 复制 `Project URL` 和 `anon public` key

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

#### 4. 创建Supabase客户端配置 (30分钟)

创建文件 `lib/supabase/client.ts`:
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

创建文件 `lib/supabase/server.ts`:
```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}
```

#### 5. 执行数据库建表 (40分钟)

- 在Supabase Dashboard，点击左侧 "SQL Editor"
- 点击 "New query"
- 复制 `database-schema.sql` 的所有内容
- 粘贴到编辑器
- 点击 "Run" 执行

**验证表创建成功**:
- 点击左侧 "Table Editor"
- 应该看到: `profiles`, `tags`, `user_tags`, `interests`, `connections` 5张表
- 点击 `tags` 表，应该看到已插入的30个预设标签

#### 6. 创建TypeScript类型 (30分钟)

在Supabase Dashboard:
- Settings → API → "Generate Types"
- 或在终端运行:

```bash
npm install supabase --save-dev
npx supabase login
npx supabase gen types typescript --project-id your_project_id > types/database.types.ts
```

#### 7. 测试连接 (20分钟)

创建测试页面 `app/test/page.tsx`:
```typescript
import { createClient } from '@/lib/supabase/server'

export default async function TestPage() {
  const supabase = createClient()

  const { data: tags, error } = await supabase
    .from('tags')
    .select('*')
    .limit(5)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">数据库连接测试</h1>
      {error ? (
        <p className="text-red-500">错误: {error.message}</p>
      ) : (
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(tags, null, 2)}
        </pre>
      )}
    </div>
  )
}
```

访问 `http://localhost:3000/test`，应该看到5个标签数据。

### 📦 预期产出
- ✅ Next.js项目能运行 (`npm run dev`)
- ✅ Supabase数据库创建成功，5张表都在
- ✅ 30个系统标签已插入
- ✅ 测试页面能显示数据

### 🐛 常见问题

**Q: `npm run dev` 报错找不到模块?**
```bash
# 删除node_modules重新安装
rm -rf node_modules package-lock.json
npm install
```

**Q: Supabase连接超时?**
- 检查 `.env.local` 文件是否在项目根目录
- 确认环境变量名称正确 (NEXT_PUBLIC_ 前缀必须有)
- 重启开发服务器

**Q: SQL执行报错?**
- 确保选择的是 "SQL Editor" 而不是 "Database" → "Functions"
- 确保复制了完整的SQL内容
- 如果已有表，先删除后重新执行

---

## 🔐 Day 2: 认证系统 + 基础布局

### 🎯 目标
用户能注册、登录，登录后看到带导航栏的主页。

### ✅ 任务清单

#### 1. 创建认证相关组件 (2小时)

**注册页面** `app/register/page.tsx`:
```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // 注册成功，跳转到Profile引导
    router.push('/onboarding/step-1')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">注册账号</h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '注册中...' : '注册'}
          </Button>
        </form>

        <p className="text-center text-sm mt-4">
          已有账号?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            立即登录
          </a>
        </p>
      </Card>
    </div>
  )
}
```

**登录页面** `app/login/page.tsx` (类似结构，改用 `signInWithPassword`)

#### 2. 创建导航栏组件 (1小时)

`components/layout/Navbar.tsx`:
```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import type { User } from '@supabase/supabase-js'

export function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // 获取当前用户
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">奇绩引力场</h1>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600">{user.email}</span>
                <Button variant="outline" onClick={handleLogout}>
                  退出登录
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => router.push('/login')}>
                  登录
                </Button>
                <Button onClick={() => router.push('/register')}>
                  注册
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
```

#### 3. 创建受保护的主页 (1小时)

`app/(protected)/layout.tsx`:
```typescript
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/Navbar'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  )
}
```

`app/(protected)/matching/pool/page.tsx`:
```typescript
export default function PoolPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">名片池</h1>
      <p className="text-gray-600 mt-2">这里将显示匿名卡片（Day 4实现）</p>
    </div>
  )
}
```

### 📦 预期产出
- ✅ 用户能访问 `/register` 注册
- ✅ 用户能访问 `/login` 登录
- ✅ 登录后自动跳转到 `/matching/pool`
- ✅ 导航栏显示用户邮箱和退出按钮

---

## 📝 Day 3-7 简版说明

由于篇幅限制，Day 3-7的详细开发指令我会单独创建文件。

### Day 3: Profile引导流程
- 创建3步表单页面
- 实现标签选择器
- 保存Profile到数据库
- 计算完整度

### Day 4: 名片池+标签筛选
- 查询其他用户Profile
- 显示匿名卡片
- 标签筛选功能
- "我想聊聊"按钮

### Day 5: 兴趣表达+双向匹配
- 发起兴趣API
- 双向匹配检测逻辑
- 自动建立连接
- 发送邮件通知

### Day 6: 已连接+Profile查看
- 查询已连接用户
- Profile详情页
- 基于关系的权限控制
- 连接状态管理

### Day 7: 测试+部署
- 完整流程测试
- Bug修复
- 响应式优化
- Vercel部署

---

## 📚 每日开发资源

### Day 1 参考
- [Next.js Installation](https://nextjs.org/docs/getting-started/installation)
- [Supabase Quick Start](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

### Day 2 参考
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [shadcn/ui Form](https://ui.shadcn.com/docs/components/form)

### 其余日期参考见单独的Day X文档

---

## ✅ 每日验收标准

### Day 1
- [ ] `npm run dev` 能启动
- [ ] `/test` 页面能显示5个标签

### Day 2
- [ ] 能注册新用户
- [ ] 能登录
- [ ] 登录后看到导航栏

### Day 3
- [ ] 新用户注册后自动进入引导流程
- [ ] 能完成3步Profile填写
- [ ] 数据保存到 `profiles` 和 `user_tags` 表

### Day 4
- [ ] 能看到其他用户的匿名卡片
- [ ] 点击标签能刷新列表
- [ ] "我想聊聊"按钮能点击

### Day 5
- [ ] 点击"我想聊聊"后，兴趣记录到数据库
- [ ] 双方互相感兴趣后，自动创建连接
- [ ] 双方收到邮件通知

### Day 6
- [ ] `/matching/connections` 显示已连接用户
- [ ] 点击能查看对方完整Profile
- [ ] 陌生人查看Profile只看到匿名信息

### Day 7
- [ ] 朋友能通过Vercel URL访问
- [ ] 移动端基本可用
- [ ] 无阻塞性bug

---

## 🚨 风险和应对

| 风险 | 可能性 | 影响 | 应对措施 |
|------|-------|------|---------|
| Supabase连接问题 | 中 | 高 | 提前测试，准备VPN |
| TypeScript类型错误 | 高 | 中 | 先用 `any`，后续优化 |
| UI样式调整耗时 | 高 | 低 | 优先功能，Day 7统一调样式 |
| 双向匹配逻辑bug | 中 | 高 | 多写测试用例，打日志调试 |
| 时间不够 | 中 | 高 | 砍掉非核心功能（如头像上传） |

---

## 🎯 开发原则

1. **先跑通流程，再优化UI**: 丑但能用 > 漂亮但不能用
2. **一天一个功能**: 不要跳跃开发，按顺序来
3. **提交代码**: 每完成一个任务就 `git commit`
4. **遇到问题立即问AI**: 不要卡太久
5. **严格控制时间**: 超过预定时间就简化方案

---

**下一步**: 查看 [Day 1详细开发指令](./prompts/day1-setup.md)

**文档版本**: v1.0
**最后更新**: 2025-10-31
