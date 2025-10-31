# Co-founder Matching MVP - 项目文件结构

## 📁 完整目录树

```
co-founder-mvp/
├── .env.local                      # 环境变量（不提交git）
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── components.json                 # shadcn/ui配置
│
├── app/                            # Next.js App Router
│   ├── layout.tsx                  # 根布局
│   ├── page.tsx                    # 首页（重定向到/login）
│   ├── globals.css                 # 全局样式
│   │
│   ├── (auth)/                     # 认证相关页面组
│   │   ├── layout.tsx              # 认证页面布局
│   │   ├── login/
│   │   │   └── page.tsx            # 登录页
│   │   └── register/
│   │       └── page.tsx            # 注册页
│   │
│   ├── onboarding/                 # Profile引导流程
│   │   ├── layout.tsx              # 引导流程布局（带进度条）
│   │   ├── step-1/
│   │   │   └── page.tsx            # 步骤1：基本信息
│   │   ├── step-2/
│   │   │   └── page.tsx            # 步骤2：能力标签
│   │   └── step-3/
│   │       └── page.tsx            # 步骤3：寻找方向
│   │
│   ├── (protected)/                # 需要登录的页面组
│   │   ├── layout.tsx              # 带导航栏的布局
│   │   └── matching/               # 匹配相关功能
│   │       ├── pool/
│   │       │   └── page.tsx        # 名片池
│   │       ├── connections/
│   │       │   └── page.tsx        # 已连接列表
│   │       └── profile/
│   │           └── [userId]/
│   │               └── page.tsx    # 查看其他用户Profile
│   │
│   └── api/                        # API Routes
│       ├── profile/
│       │   ├── route.ts            # GET/PUT profile
│       │   ├── completion/
│       │   │   └── route.ts        # GET 完整度
│       │   └── tags/
│       │       └── route.ts        # POST 更新标签
│       ├── tags/
│       │   └── route.ts            # GET所有标签, POST创建标签
│       ├── pool/
│       │   └── route.ts            # GET 名片池
│       ├── interests/
│       │   ├── send/
│       │   │   └── route.ts        # POST 发起兴趣
│       │   ├── received/
│       │   │   └── route.ts        # GET 收到的兴趣
│       │   └── [interestId]/
│       │       └── respond/
│       │           └── route.ts    # POST 响应兴趣
│       └── connections/
│           ├── route.ts            # GET 已连接列表
│           └── [connectionId]/
│               └── status/
│                   └── route.ts    # PATCH 更新状态
│
├── components/                     # React组件
│   ├── ui/                         # shadcn/ui基础组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── form.tsx
│   │   ├── toast.tsx
│   │   ├── badge.tsx
│   │   ├── progress.tsx
│   │   └── ...
│   │
│   ├── layout/                     # 布局组件
│   │   ├── Navbar.tsx              # 导航栏
│   │   ├── Footer.tsx              # 页脚（可选）
│   │   └── Container.tsx           # 容器组件
│   │
│   ├── forms/                      # 表单组件
│   │   ├── ProfileStepForm.tsx     # Profile分步表单
│   │   ├── TagSelector.tsx         # 标签选择器
│   │   └── LoginForm.tsx           # 登录表单
│   │
│   ├── cards/                      # 卡片组件
│   │   ├── AnonymousCard.tsx       # 匿名用户卡片
│   │   ├── ConnectionCard.tsx      # 已连接用户卡片
│   │   └── InterestCard.tsx        # 兴趣通知卡片
│   │
│   └── shared/                     # 共享组件
│       ├── LoadingSpinner.tsx      # 加载动画
│       ├── ErrorMessage.tsx        # 错误提示
│       └── EmptyState.tsx          # 空状态提示
│
├── lib/                            # 工具函数和配置
│   ├── supabase/                   # Supabase配置
│   │   ├── client.ts               # 浏览器端客户端
│   │   ├── server.ts               # 服务端客户端
│   │   └── middleware.ts           # 中间件客户端
│   │
│   ├── utils/                      # 工具函数
│   │   ├── cn.ts                   # classNames合并
│   │   ├── date.ts                 # 日期格式化
│   │   └── validation.ts           # 表单验证规则
│   │
│   ├── hooks/                      # 自定义Hooks
│   │   ├── useAuth.ts              # 认证Hook
│   │   ├── useProfile.ts           # Profile Hook
│   │   └── useToast.ts             # Toast Hook
│   │
│   └── constants/                  # 常量
│       ├── tags.ts                 # 标签相关常量
│       └── routes.ts               # 路由常量
│
├── types/                          # TypeScript类型
│   ├── database.types.ts           # Supabase自动生成的类型
│   ├── supabase.ts                 # Supabase辅助类型
│   └── index.ts                    # 自定义类型定义
│
├── store/                          # Zustand状态管理（可选）
│   ├── auth.ts                     # 认证状态
│   └── ui.ts                       # UI状态（如Toast）
│
├── public/                         # 静态资源
│   ├── images/
│   │   ├── logo.svg
│   │   └── default-avatar.png
│   └── favicon.ico
│
└── docs/                           # 项目文档
    ├── MVP-OVERVIEW.md             # 项目概括
    ├── TECH-STACK.md               # 技术选型说明
    ├── DEVELOPMENT-PLAN.md         # 7天开发计划
    ├── api-design.md               # API接口设计
    ├── database-schema.sql         # 数据库设计
    ├── FILE-STRUCTURE.md           # 本文件
    └── prompts/                    # 开发Prompt集合
        ├── day1-setup.md
        ├── day2-auth.md
        ├── day3-profile.md
        ├── day4-pool.md
        ├── day5-matching.md
        ├── day6-connections.md
        └── day7-deployment.md
```

---

## 📂 核心目录说明

### 1. `app/` - Next.js App Router

Next.js 14使用App Router，所有路由基于文件系统。

#### 路由组 (Route Groups)
使用 `(groupName)` 创建路由组，不影响URL：
- `(auth)`: 认证相关页面，共享布局
- `(protected)`: 需要登录的页面，共享导航栏布局

#### 动态路由
- `[userId]`: 动态参数，如 `/profile/abc123`
- `[...slug]`: 捕获所有路由（本项目未使用）

#### 特殊文件
- `layout.tsx`: 布局文件，可嵌套
- `page.tsx`: 页面组件
- `loading.tsx`: 加载状态（可选）
- `error.tsx`: 错误边界（可选）
- `route.ts`: API Route处理函数

---

### 2. `components/` - React组件

#### 组件组织原则
- **按功能分类**: `ui/`, `forms/`, `cards/`, `layout/`
- **按复用度**: `ui/` 最通用，`forms/` 功能专用
- **shadcn/ui**: 所有基础UI组件放在 `ui/`

#### 命名规范
- 组件文件: PascalCase (如 `AnonymousCard.tsx`)
- 组件导出: 命名导出优于默认导出
- Props接口: 组件名 + Props (如 `AnonymousCardProps`)

```typescript
// ✅ 好的命名
export interface AnonymousCardProps {
  title: string
  vision: string
}

export function AnonymousCard({ title, vision }: AnonymousCardProps) {
  // ...
}

// ❌ 不推荐
export default function Card() { ... }
```

---

### 3. `lib/` - 工具函数和配置

#### `lib/supabase/`
包含3个客户端配置，适用于不同环境：
```typescript
// client.ts - 浏览器端（客户端组件）
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()

// server.ts - 服务端（服务端组件、API Routes）
import { createClient } from '@/lib/supabase/server'
const supabase = createClient()

// middleware.ts - 中间件（路由保护）
import { createClient } from '@/lib/supabase/middleware'
```

#### `lib/utils/`
通用工具函数：
```typescript
// cn.ts - classNames合并（shadcn/ui自带）
import { cn } from '@/lib/utils'
<div className={cn('base-class', condition && 'conditional-class')} />

// date.ts - 日期格式化
export function formatRelativeTime(date: Date) {
  // "3天前", "刚刚"
}

// validation.ts - Zod验证模式
export const profileSchema = z.object({
  name: z.string().min(2),
  title: z.string().min(5),
})
```

---

### 4. `types/` - TypeScript类型

#### `database.types.ts` (自动生成)
```bash
# 生成命令
npx supabase gen types typescript --project-id your_project_id > types/database.types.ts
```

包含所有数据库表的类型定义。

#### `index.ts` (自定义类型)
```typescript
// 前端使用的简化类型
export interface UserProfile {
  id: string
  name: string | null
  title: string
  vision: string
  tags: Tag[]
}

export interface Tag {
  id: number
  name: string
  category: 'ability' | 'direction' | 'role'
}

export interface AnonymousCard {
  id: string
  title: string
  vision: string
  tags: Tag[]
  has_sent_interest: boolean
}
```

---

### 5. `store/` - Zustand状态管理（可选）

MVP阶段可以不用，但如果需要全局状态：

```typescript
// store/auth.ts
import { create } from 'zustand'

interface AuthStore {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}))
```

使用：
```typescript
const { user, setUser } = useAuthStore()
```

---

## 🚀 Day 1 创建的文件

在Day 1，你需要创建以下文件：

```
co-founder-mvp/
├── .env.local                      # ✅ 手动创建
├── lib/
│   └── supabase/
│       ├── client.ts               # ✅ 手动创建
│       └── server.ts               # ✅ 手动创建
├── types/
│   └── database.types.ts           # ✅ 命令生成
└── app/
    └── test/
        └── page.tsx                # ✅ 手动创建（测试用）
```

其余文件随后几天逐步创建。

---

## 📦 推荐VSCode扩展

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "Prisma.prisma",
    "formulahendry.auto-rename-tag",
    "dsznajder.es7-react-js-snippets"
  ]
}
```

保存为 `.vscode/extensions.json`

---

## 🔧 项目配置文件

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### `next.config.js`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['supabase.co'], // Supabase图片域名
  },
}

module.exports = nextConfig
```

### `.gitignore`
```
node_modules/
.next/
.env*.local
.DS_Store
*.log
.vercel
```

---

## 📝 文件命名规范

### 组件文件
- React组件: `PascalCase.tsx` (如 `AnonymousCard.tsx`)
- 工具函数: `camelCase.ts` (如 `formatDate.ts`)
- 常量: `UPPER_CASE.ts` (如 `API_ROUTES.ts`)

### 路由文件
- 页面: `page.tsx` (固定名称)
- 布局: `layout.tsx` (固定名称)
- API: `route.ts` (固定名称)
- 动态路由: `[param]/page.tsx`

### 样式文件
- 全局样式: `globals.css`
- 模块样式: `Component.module.css` (如使用CSS Modules)

---

## 🎯 开发流程建议

### Day 1-2: 基础框架
1. 创建 `lib/supabase/` 配置
2. 创建 `components/ui/` 基础组件
3. 创建 `app/(auth)/` 认证页面

### Day 3-4: 核心功能
1. 创建 `app/onboarding/` 引导流程
2. 创建 `components/forms/` 表单组件
3. 创建 `app/api/profile/` API

### Day 5-6: 匹配系统
1. 创建 `app/(protected)/matching/` 页面
2. 创建 `components/cards/` 卡片组件
3. 创建 `app/api/interests/` 和 `connections/` API

### Day 7: 优化和部署
1. 代码整理和注释
2. 响应式优化
3. Vercel部署

---

## 💡 最佳实践

1. **组件拆分**: 单个文件不超过200行
2. **类型优先**: 先定义类型，再写实现
3. **错误处理**: 每个API都要try-catch
4. **加载状态**: 每个异步操作都要loading状态
5. **移动优先**: 用Tailwind的 `sm:` `md:` `lg:` 响应式类

---

**文档版本**: v1.0
**最后更新**: 2025-10-31
