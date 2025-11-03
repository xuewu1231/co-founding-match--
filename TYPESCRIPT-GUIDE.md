# Co-founder Matching MVP - TypeScript 开发规范

> 全栈TypeScript开发指南：从前端React到后端Node.js到数据库交互

---

## 🎯 架构说明

你的项目是**全栈TypeScript**架构：

```
Next.js 16 项目 (全TypeScript)
│
├─ 前端层 (React + TypeScript)
│  ├─ app/                        # 页面组件
│  ├─ components/                 # UI组件
│  └─ lib/hooks/                  # 自定义Hooks
│
├─ 后端层 (Node.js + TypeScript)
│  ├─ app/api/                    # API Routes (Node.js环境)
│  └─ lib/utils/                  # 服务端工具函数
│
└─ 数据层 (TypeScript SDK)
   ├─ lib/supabase/               # Supabase客户端
   └─ types/                      # 数据库类型定义
```

**关键点**：
- ✅ 前后端共享TypeScript代码
- ✅ 统一的类型定义
- ✅ 类型安全的API调用
- ✅ 自动类型推导

---

## 📁 TypeScript文件组织

### 1. 类型定义文件

```
types/
├── database.types.ts        # Supabase自动生成的数据库类型
├── api.types.ts             # API请求/响应类型
├── components.types.ts      # 组件Props类型
└── index.ts                 # 导出所有类型
```

### 2. 文件命名规范

| 文件类型 | 命名规则 | 示例 |
|---------|---------|------|
| 页面组件 | `page.tsx` | `app/login/page.tsx` |
| React组件 | `PascalCase.tsx` | `AnonymousCard.tsx` |
| API Route | `route.ts` | `app/api/profile/route.ts` |
| 工具函数 | `camelCase.ts` | `lib/utils/validation.ts` |
| 类型定义 | `*.types.ts` | `types/api.types.ts` |
| Hooks | `use*.ts` | `lib/hooks/useAuth.ts` |

---

## 🎨 前端TypeScript规范

### 1. React组件类型定义

#### ✅ 推荐写法：

```typescript
// components/cards/AnonymousCard.tsx

// 1. 定义Props接口
interface AnonymousCardProps {
  id: string
  title: string
  vision: string
  tags: Array<{
    id: number
    name: string
    category: 'ability' | 'direction' | 'role'
  }>
  onInterestClick?: () => void  // 可选属性
}

// 2. 使用接口定义组件
export function AnonymousCard({
  id,
  title,
  vision,
  tags,
  onInterestClick
}: AnonymousCardProps) {
  return (
    <div>
      <h3>{title}</h3>
      <p>{vision}</p>
      {/* ... */}
    </div>
  )
}
```

#### ❌ 不推荐写法：

```typescript
// 不要用any
export function AnonymousCard(props: any) { }

// 不要省略类型
export function AnonymousCard({ id, title }) { }

// 不要内联复杂类型
export function AnonymousCard({
  tags
}: {
  tags: Array<{ id: number, name: string, category: string }>
}) { }
```

### 2. Hooks类型定义

```typescript
// lib/hooks/useAuth.ts
import { User } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'

// 定义返回类型
interface UseAuthReturn {
  user: User | null
  loading: boolean
  error: Error | null
  logout: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const logout = async (): Promise<void> => {
    // 实现登出逻辑
  }

  return { user, loading, error, logout }
}
```

### 3. 事件处理类型

```typescript
import { FormEvent, ChangeEvent, MouseEvent } from 'react'

export function LoginForm() {
  // 表单提交
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // ...
  }

  // 输入变化
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
  }

  // 按钮点击
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
  }

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleInputChange} />
      <button onClick={handleClick}>提交</button>
    </form>
  )
}
```

---

## 🔧 后端TypeScript规范 (API Routes)

### 1. API Route基础结构

```typescript
// app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET请求处理器
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    // 获取当前用户
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 业务逻辑
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ profile: data })

  } catch (error) {
    console.error('GET /api/profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST请求处理器
export async function POST(request: NextRequest) {
  try {
    // 解析请求体（自动推导类型）
    const body = await request.json()

    // 业务逻辑

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Bad request' },
      { status: 400 }
    )
  }
}
```

### 2. API请求/响应类型定义

```typescript
// types/api.types.ts

// ============ Profile API ============
export interface GetProfileResponse {
  profile: {
    id: string
    name: string
    title: string
    bio: string | null
    vision: string
    profile_completion: number
  }
}

export interface UpdateProfileRequest {
  name?: string
  title?: string
  bio?: string
  vision?: string
  linkedin_url?: string
}

export interface UpdateProfileResponse {
  success: boolean
  profile: GetProfileResponse['profile']
}

// ============ Interest API ============
export interface SendInterestRequest {
  receiver_id: string
}

export interface SendInterestResponse {
  success: boolean
  matched: boolean
  connection_id?: number
  message: string
}

// ============ Error Response ============
export interface ErrorResponse {
  error: string
  code?: string
  details?: Record<string, any>
}
```

### 3. 使用类型定义的API Route

```typescript
// app/api/interests/send/route.ts
import { NextRequest, NextResponse } from 'next/server'
import type { SendInterestRequest, SendInterestResponse, ErrorResponse } from '@/types/api.types'

export async function POST(request: NextRequest) {
  try {
    // 类型安全的请求体解析
    const body: SendInterestRequest = await request.json()

    // TypeScript会检查body.receiver_id是否存在
    const { receiver_id } = body

    // ... 业务逻辑

    // 类型安全的响应
    const response: SendInterestResponse = {
      success: true,
      matched: false,
      message: '兴趣已发送'
    }

    return NextResponse.json(response)

  } catch (error) {
    const errorResponse: ErrorResponse = {
      error: 'Failed to send interest'
    }
    return NextResponse.json(errorResponse, { status: 500 })
  }
}
```

---

## 🗄️ 数据库类型定义

### 1. Supabase自动生成类型

```bash
# 生成命令
npx supabase gen types typescript --project-id your_project_id > types/database.types.ts
```

生成的文件示例：
```typescript
// types/database.types.ts (自动生成)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          title: string
          bio: string | null
          vision: string
          created_at: string
        }
        Insert: {
          id: string
          name: string
          title: string
          bio?: string | null
          vision: string
        }
        Update: {
          name?: string
          title?: string
          bio?: string | null
          vision?: string
        }
      }
      // ... 其他表
    }
  }
}
```

### 2. 使用数据库类型

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

```typescript
// 使用时自动获得类型提示
const supabase = createClient()

// TypeScript知道profiles表的字段
const { data, error } = await supabase
  .from('profiles')  // 自动补全表名
  .select('name, title')  // 自动补全字段名
  .eq('id', userId)  // 类型检查
```

### 3. 自定义数据类型

```typescript
// types/index.ts
import type { Database } from './database.types'

// 从数据库类型提取
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Tag = Database['public']['Tables']['tags']['Row']
export type Interest = Database['public']['Tables']['interests']['Row']
export type Connection = Database['public']['Tables']['connections']['Row']

// 自定义前端使用的类型
export interface UserProfile extends Profile {
  tags: Tag[]
  abilities: Tag[]
  directions: Tag[]
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

## 🔗 前后端类型共享

### 场景：前端调用后端API

```typescript
// types/api.types.ts - 共享类型定义
export interface SendInterestRequest {
  receiver_id: string
}

export interface SendInterestResponse {
  success: boolean
  matched: boolean
}
```

```typescript
// app/api/interests/send/route.ts - 后端使用
import type { SendInterestRequest, SendInterestResponse } from '@/types/api.types'

export async function POST(request: NextRequest) {
  const body: SendInterestRequest = await request.json()

  // ... 业务逻辑

  const response: SendInterestResponse = {
    success: true,
    matched: false
  }

  return NextResponse.json(response)
}
```

```typescript
// lib/hooks/useInterestMutation.ts - 前端使用
import type { SendInterestRequest, SendInterestResponse } from '@/types/api.types'

export function useInterestMutation() {
  return useMutation({
    mutationFn: async (receiverId: string) => {
      const requestBody: SendInterestRequest = {
        receiver_id: receiverId
      }

      const response = await fetch('/api/interests/send', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      })

      // 类型安全的响应
      const data: SendInterestResponse = await response.json()
      return data
    }
  })
}
```

---

## 🛡️ 类型安全最佳实践

### 1. 避免使用any

#### ❌ 不推荐：
```typescript
function processData(data: any) {
  return data.map((item: any) => item.value)
}
```

#### ✅ 推荐：
```typescript
interface DataItem {
  value: string
}

function processData(data: DataItem[]) {
  return data.map(item => item.value)
}
```

### 2. 使用联合类型而不是枚举

#### ❌ 不推荐：
```typescript
enum TagCategory {
  Ability = 'ability',
  Direction = 'direction',
  Role = 'role'
}
```

#### ✅ 推荐：
```typescript
type TagCategory = 'ability' | 'direction' | 'role'
```

### 3. 使用类型守卫

```typescript
// 类型守卫函数
function isError(response: SendInterestResponse | ErrorResponse): response is ErrorResponse {
  return 'error' in response
}

// 使用
const result = await sendInterest(userId)

if (isError(result)) {
  console.error(result.error)  // TypeScript知道这是ErrorResponse
} else {
  console.log(result.matched)  // TypeScript知道这是SendInterestResponse
}
```

### 4. 使用Utility Types

```typescript
// Partial - 所有属性变为可选
type PartialProfile = Partial<Profile>

// Pick - 选择部分属性
type ProfileSummary = Pick<Profile, 'id' | 'name' | 'title'>

// Omit - 排除部分属性
type ProfileWithoutDates = Omit<Profile, 'created_at' | 'updated_at'>

// Required - 所有属性变为必需
type RequiredProfile = Required<PartialProfile>
```

---

## 🧪 TypeScript + Zod验证

### 为什么需要Zod？

TypeScript只在**编译时**检查类型，运行时无法保证。Zod提供**运行时**验证。

### 安装Zod

```bash
npm install zod
```

### 使用示例

```typescript
// lib/schemas/profile.schema.ts
import { z } from 'zod'

// 定义Zod schema
export const profileSchema = z.object({
  name: z.string().min(2, '姓名至少2个字').max(50),
  title: z.string().min(5, 'Title至少5个字').max(200),
  bio: z.string().max(500).optional(),
  vision: z.string().min(10, '愿景至少10个字').max(300),
  linkedin_url: z.string().url().optional().or(z.literal('')),
  github_url: z.string().url().optional().or(z.literal('')),
})

// 从Zod schema推导TypeScript类型
export type ProfileFormData = z.infer<typeof profileSchema>
```

### 在API Route中使用

```typescript
// app/api/profile/route.ts
import { profileSchema } from '@/lib/schemas/profile.schema'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 验证请求体
    const validatedData = profileSchema.parse(body)
    // 如果验证失败，会抛出ZodError

    // 使用验证后的数据
    const { data, error } = await supabase
      .from('profiles')
      .update(validatedData)
      .eq('id', userId)

    // ...
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '数据验证失败', details: error.errors },
        { status: 400 }
      )
    }
    // 其他错误处理
  }
}
```

### 在表单中使用 (React Hook Form + Zod)

```typescript
// components/forms/ProfileForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, type ProfileFormData } from '@/lib/schemas/profile.schema'

export function ProfileForm() {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      title: '',
      vision: '',
    }
  })

  const onSubmit = (data: ProfileFormData) => {
    // data已经通过验证，类型安全
    console.log(data)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('name')} />
      {form.formState.errors.name && (
        <span>{form.formState.errors.name.message}</span>
      )}
      {/* ... */}
    </form>
  )
}
```

---

## 📝 开发工作流

### 1. 开发新功能的TypeScript流程

```
1. 定义数据库表结构 (SQL)
   ↓
2. 生成TypeScript类型 (npx supabase gen types)
   ↓
3. 定义API类型 (types/api.types.ts)
   ↓
4. 定义Zod Schema (lib/schemas/)
   ↓
5. 实现API Route (app/api/)
   ↓
6. 实现前端Hook (lib/hooks/)
   ↓
7. 实现UI组件 (components/)
```

### 2. 类型检查命令

```bash
# 类型检查（不编译）
npx tsc --noEmit

# ESLint检查
npm run lint

# 同时运行类型检查和linting
npx tsc --noEmit && npm run lint
```

---

## 🚨 常见TypeScript错误和解决方案

### 错误1: "Property does not exist on type"

```typescript
// ❌ 错误
const user = await supabase.auth.getUser()
console.log(user.email)  // 错误：Property 'email' does not exist

// ✅ 正确
const { data: { user } } = await supabase.auth.getUser()
if (user) {
  console.log(user.email)  // 正确
}
```

### 错误2: "Argument of type 'X' is not assignable to parameter of type 'Y'"

```typescript
// ❌ 错误
const tags: string[] = [1, 2, 3]  // 类型不匹配

// ✅ 正确
const tags: number[] = [1, 2, 3]
// 或
const tags = [1, 2, 3]  // 让TypeScript自动推导
```

### 错误3: "Object is possibly 'null'"

```typescript
// ❌ 错误
const profile = await getProfile()
console.log(profile.name)  // 错误：profile可能为null

// ✅ 正确 - 方式1：可选链
console.log(profile?.name)

// ✅ 正确 - 方式2：类型守卫
if (profile) {
  console.log(profile.name)
}

// ✅ 正确 - 方式3：非空断言（确定不为null时）
console.log(profile!.name)
```

---

## 🎓 VSCode配置优化

### 推荐扩展

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "usernamehw.errorlens",  // 实时显示错误
    "yoavbls.pretty-ts-errors"  // 美化TS错误信息
  ]
}
```

### 配置文件 `.vscode/settings.json`

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

---

## 📚 学习资源

- **TypeScript官方文档**: https://www.typescriptlang.org/docs/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/handbook/intro.html
- **Next.js TypeScript**: https://nextjs.org/docs/app/building-your-application/configuring/typescript
- **Supabase TypeScript**: https://supabase.com/docs/guides/api/typescript-support
- **Zod文档**: https://zod.dev

---

## ✅ 检查清单

在开发过程中，确保：

- [ ] 所有函数都有明确的参数类型和返回类型
- [ ] 避免使用`any`，用`unknown`代替
- [ ] API请求/响应都有类型定义
- [ ] 复杂对象提取为interface
- [ ] 使用Zod验证外部输入
- [ ] 定期运行`npx tsc --noEmit`检查类型错误
- [ ] 数据库表更新后重新生成类型

---

**记住**：TypeScript的目标是在编译时发现错误，而不是运行时！多花点时间写类型定义，可以节省大量调试时间。🚀
