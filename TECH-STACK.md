# Co-founder Matching MVP - 技术选型说明

## 🎯 选型原则

**针对独立小白开发者的技术栈选择考虑因素**:
1. ✅ 学习曲线平缓，文档丰富
2. ✅ 开发效率高，减少配置时间
3. ✅ 社区活跃，容易找到解决方案
4. ✅ 部署简单，最好一键部署
5. ✅ 成本可控，MVP阶段免费或低成本

---

## 🏗 整体架构

```
┌─────────────────────────────────────────────────┐
│              用户浏览器                           │
│   (Chrome, Safari, Firefox, Mobile Browser)    │
└────────────────┬────────────────────────────────┘
                 │ HTTPS
                 ↓
┌─────────────────────────────────────────────────┐
│         Vercel (Next.js应用托管)                 │
│  ┌─────────────────────────────────────────┐   │
│  │  Next.js 14 (App Router)                │   │
│  │  - 前端页面 (React组件)                   │   │
│  │  - API Routes (后端逻辑)                 │   │
│  │  - Server Actions (服务端操作)           │   │
│  └─────────────┬───────────────────────────┘   │
└────────────────┼───────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│        Supabase (后端服务平台)                   │
│  ┌──────────────┐  ┌──────────────┐           │
│  │ PostgreSQL   │  │   Auth       │           │
│  │   数据库      │  │  认证服务     │           │
│  └──────────────┘  └──────────────┘           │
│  ┌──────────────┐  ┌──────────────┐           │
│  │  Storage     │  │  Realtime    │           │
│  │  文件存储     │  │  实时订阅     │           │
│  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│        Resend (邮件服务)                         │
│   发送匹配成功通知邮件                            │
└─────────────────────────────────────────────────┘
```

---

## 💻 前端技术栈

### 核心框架

#### **Next.js 14 (App Router)**
- **版本**: 14.x (使用App Router，不是Pages Router)
- **为什么选择**:
  - ✅ React框架，学习资源最丰富
  - ✅ 内置API Routes，前后端一体化开发
  - ✅ Server Components提升性能
  - ✅ Vercel一键部署，开发体验极佳
  - ✅ 内置图片优化、字体优化等功能

- **安装命令**:
```bash
npx create-next-app@latest co-founder-mvp --typescript --tailwind --app
```

#### **TypeScript**
- **版本**: 5.x
- **为什么选择**:
  - ✅ 类型安全，减少运行时错误
  - ✅ IDE智能提示，提升开发效率
  - ✅ Supabase原生支持TypeScript类型生成

### UI层

#### **Tailwind CSS 3.x**
- **为什么选择**:
  - ✅ Utility-first，写样式像写class
  - ✅ 无需离开HTML就能完成样式
  - ✅ 内置响应式设计
  - ✅ 配合shadcn/ui开箱即用

- **配置**:
```javascript
// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {...},  // 品牌主色
      }
    }
  }
}
```

#### **shadcn/ui**
- **为什么选择**:
  - ✅ 复制粘贴式组件，不是NPM包
  - ✅ 基于Radix UI，无障碍性好
  - ✅ 完全可定制，代码在你的项目里
  - ✅ 组件质量高，开箱即用

- **安装**:
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label select
```

### 状态管理

#### **Zustand 4.x**
- **为什么选择**:
  - ✅ 比Redux简单10倍
  - ✅ 无需Provider包裹
  - ✅ TypeScript支持好
  - ✅ 适合小型项目

- **使用场景**:
  - 用户认证状态
  - 当前选中的标签筛选
  - Toast通知管理

```typescript
// 示例store
import { create } from 'zustand'

interface AuthStore {
  user: User | null
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
```

#### **React Query (TanStack Query) 5.x**
- **为什么选择**:
  - ✅ 服务端状态管理专家
  - ✅ 自动缓存、重试、轮询
  - ✅ 减少样板代码

- **使用场景**:
  - API数据获取
  - 名片池数据缓存
  - Profile数据管理

### 表单处理

#### **React Hook Form 7.x**
- **为什么选择**:
  - ✅ 性能最好的React表单库
  - ✅ 无需重复渲染
  - ✅ 配合Zod做验证完美

```typescript
// 示例用法
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const schema = z.object({
  name: z.string().min(2, '姓名至少2个字'),
  title: z.string().min(5, 'Title至少5个字'),
})

const { register, handleSubmit } = useForm({
  resolver: zodResolver(schema)
})
```

#### **Zod 3.x**
- **为什么选择**:
  - ✅ TypeScript-first的验证库
  - ✅ 自动推导类型
  - ✅ 前后端共享验证逻辑

---

## 🔧 后端技术栈

### **Supabase (主要后端服务)**

#### 为什么选择Supabase?
- ✅ **零配置后端**: 无需搭建服务器
- ✅ **PostgreSQL**: 强大的关系型数据库
- ✅ **内置认证**: 邮箱、OAuth开箱即用
- ✅ **Row Level Security**: 数据库级别的权限控制
- ✅ **Realtime订阅**: WebSocket实时更新
- ✅ **免费额度**: 500MB存储 + 50MB数据库 + 2GB传输

#### Supabase核心功能使用

**1. 数据库 (PostgreSQL)**
```typescript
// 查询示例
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('is_active', true)
  .order('created_at', { ascending: false })
```

**2. 认证 (Auth)**
```typescript
// 注册
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})

// 登录
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// 获取当前用户
const { data: { user } } = await supabase.auth.getUser()
```

**3. Storage (文件存储 - 后续上传头像用)**
```typescript
// 上传头像
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.png`, file)
```

**4. Realtime (实时订阅 - 后续通知系统用)**
```typescript
// 订阅新兴趣信号
supabase
  .channel('interests')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'interests',
    filter: `receiver_id=eq.${userId}`
  }, (payload) => {
    console.log('New interest received!', payload)
  })
  .subscribe()
```

### **Next.js API Routes**

#### 为什么使用API Routes?
- ✅ 与前端代码在同一项目
- ✅ 无需CORS配置
- ✅ 可以使用Service Role Key安全操作

#### 目录结构
```
app/
├── api/
│   ├── auth/
│   │   └── callback/route.ts       # OAuth回调
│   ├── profile/
│   │   ├── route.ts                # GET/POST profile
│   │   └── completion/route.ts     # 计算完整度
│   ├── pool/
│   │   └── route.ts                # 获取名片池
│   ├── interests/
│   │   ├── send/route.ts           # 发起兴趣
│   │   └── received/route.ts       # 获取收到的兴趣
│   └── connections/
│       └── route.ts                # 获取已连接列表
```

#### 示例API Route
```typescript
// app/api/interests/send/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })

  // 验证用户登录
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 业务逻辑
  const { receiverId } = await request.json()

  // ... 双向匹配逻辑

  return NextResponse.json({ success: true })
}
```

---

## 📧 第三方服务

### **Resend (邮件服务)**

#### 为什么选择Resend?
- ✅ 现代化的邮件API
- ✅ 免费额度: 3000封/月
- ✅ React Email集成，邮件模板用React写

#### 使用场景
- 匹配成功通知
- 欢迎邮件
- 密码重置（Supabase内置）

#### 集成方式
```typescript
// lib/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendMatchNotification(userA: User, userB: User) {
  await resend.emails.send({
    from: 'Co-founder Match <noreply@yourdomain.com>',
    to: [userA.email, userB.email],
    subject: '🎉 恭喜！你们成功匹配了',
    html: `<p>你和 ${userB.name} 双向匹配成功...</p>`
  })
}
```

---

## 🚀 部署和托管

### **Vercel (前端托管)**

#### 为什么选择Vercel?
- ✅ Next.js官方团队开发
- ✅ Git push自动部署
- ✅ 免费HTTPS证书
- ✅ 全球CDN加速
- ✅ 预览环境（每个PR独立URL）

#### 免费额度
- 100GB带宽/月
- 无限部署次数
- 自定义域名

#### 部署步骤
```bash
# 1. 安装Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel

# 4. 生产部署
vercel --prod
```

### **Supabase Cloud (数据库托管)**

#### 免费额度
- 500MB数据库存储
- 50MB文件存储
- 2GB带宽/月
- 50,000行Row Level Security检查
- 无限API请求

---

## 🛠 开发工具

### **必装工具**

#### **VSCode 扩展**
```
1. ES7+ React/Redux/React-Native snippets
2. Tailwind CSS IntelliSense
3. Prettier - Code formatter
4. ESLint
5. Prisma (如果后续使用)
```

#### **Chrome扩展**
```
1. React Developer Tools
2. Supabase Extension (查看数据库)
```

### **代码质量工具**

#### **ESLint + Prettier**
```bash
# 已包含在Next.js中
npm run lint
```

#### **Husky + lint-staged (可选)**
```bash
# 提交前自动格式化
npx husky-init && npm install
```

---

## 📊 技术栈对比表

| 方面 | 选型 | 替代方案 | 为什么选当前方案 |
|-----|------|---------|----------------|
| **前端框架** | Next.js 14 | Remix, Astro | Vercel部署最丝滑，生态最成熟 |
| **后端** | Supabase | Firebase, PocketBase | 开源、PostgreSQL、RLS强大 |
| **样式** | Tailwind CSS | CSS Modules, Emotion | 写得快，不用起名 |
| **组件库** | shadcn/ui | Ant Design, MUI | 不是NPM包，完全可控 |
| **状态管理** | Zustand | Redux, MobX | 简单，适合小项目 |
| **表单** | React Hook Form | Formik | 性能最好 |
| **验证** | Zod | Yup, Joi | TypeScript原生支持 |
| **邮件** | Resend | SendGrid, Mailgun | 现代、免费额度够用 |
| **部署** | Vercel | Netlify, Railway | Next.js官方，体验最好 |

---

## 💰 成本估算 (MVP阶段)

| 服务 | 月费用 | 说明 |
|-----|-------|------|
| Vercel | $0 | 免费计划足够 |
| Supabase | $0 | 免费计划足够前100用户 |
| Resend | $0 | 3000封/月免费 |
| 域名 | ¥50-100 | 可选，用vercel.app也行 |
| **总计** | **¥0-100/月** | 几乎零成本 |

---

## 📚 学习资源

### **官方文档**
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com

### **推荐教程**
- Next.js App Router: YouTube "Next.js 14 Tutorial"
- Supabase全栈: "Build a fullstack app with Supabase"

### **社区**
- Next.js Discord
- Supabase Discord
- Reddit: r/nextjs, r/supabase

---

## 🔄 技术演进计划

### **MVP阶段 (当前)**
- ✅ 使用上述所有技术
- ✅ 直接在Supabase查询，无缓存层
- ✅ API Routes处理业务逻辑

### **V1.1 (MVP+1个月)**
- 🔲 添加Redis缓存（Upstash）
- 🔲 使用tRPC替代REST API
- 🔲 添加测试（Vitest + Testing Library）

### **V2.0 (产品成熟期)**
- 🔲 拆分微服务（BFF架构）
- 🔲 添加Elasticsearch全文搜索
- 🔲 添加RabbitMQ消息队列

---

**文档版本**: v1.0
**最后更新**: 2025-10-31
**下一步**: 查看 [7天开发计划](./DEVELOPMENT-PLAN.md)
