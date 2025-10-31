# Day 1: 项目初始化与数据库设置 - 完整开发指令

> 🎯 今天目标：搭建Next.js项目，配置Supabase，创建数据库表，测试连接成功
> ⏰ 预计时间：6-8小时
> 📍 当前进度：Day 1 of 7
---
## ✅ 任务检查清单

在开始之前，确保你有：
- [ ] 安装了Node.js 18+ (`node -v` 检查)
- [ ] 安装了Git (`git --version` 检查)
- [ ] 有稳定的网络连接（访问Supabase）
- [ ] 注册了Supabase账号（https://supabase.com）
- [ ] 安装了VSCode或其他代码编辑器

---

## 🚀 Step 1: 创建Next.js项目 (30分钟)

### 1.1 创建项目

打开终端，进入你的工作目录：

```bash
# 进入工作目录
cd "/mnt/d/Study/研究生/奇绩创坛/co-founding match产品"

# 创建Next.js项目
npx create-next-app@latest co-founder-mvp
```

安装时选择以下选项：
```
✔ Would you like to use TypeScript? › Yes
✔ Would you like to use ESLint? › Yes
✔ Would you like to use Tailwind CSS? › Yes
✔ Would you like to use `src/` directory? › No
✔ Would you like to use App Router? › Yes
✔ Would you like to customize the default import alias? › No
```

### 1.2 进入项目并启动

```bash
cd co-founder-mvp

# 启动开发服务器
npm run dev
```
访问 http://localhost:3000，应该看到Next.js的欢迎页面。

**✅ 验收**: 看到"Get started by editing app/page.tsx"

### 1.3 安装项目依赖

在新终端窗口（保持 `npm run dev` 运行），执行：

```bash
# Supabase相关
npm install @supabase/supabase-js @supabase/ssr

# 表单处理
npm install react-hook-form zod @hookform/resolvers

# 状态管理
npm install zustand

# 数据请求
npm install @tanstack/react-query

# 工具库
npm install date-fns
```

---

## 🎨 Step 2: 配置shadcn/ui (30分钟)

### 2.1 初始化shadcn/ui

```bash
npx shadcn-ui@latest init
```

选择以下选项：
```
✔ Which style would you like to use? › Default
✔ Which color would you like to use as base color? › Slate
✔ Would you like to use CSS variables for colors? › Yes
```

### 2.2 安装常用组件

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add select
npx shadcn-ui@latest add form
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add progress
```

**✅ 验收**: 查看 `components/ui/` 目录，应该有9个组件文件

---

## 🗄️ Step 3: 创建Supabase项目 (20分钟)

### 3.1 创建项目

1. 访问 https://supabase.com
2. 点击右上角 "Start your project"
3. 登录或注册账号
4. 点击 "New Project"
5. 填写信息：
   - **Name**: `co-founder-mvp`
   - **Database Password**: 设置一个强密码（**务必记录下来**）
   - **Region**: 选择 `Northeast Asia (Tokyo)` (延迟最低)
   - **Pricing Plan**: Free
6. 点击 "Create new project"
7. 等待约2-3分钟，项目创建完成

### 3.2 获取API密钥

项目创建完成后：
1. 点击左侧菜单 "Project Settings" (齿轮图标)
2. 点击 "API"
3. 找到 "Project API keys" 部分
4. 复制以下内容到记事本：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public** key: 一长串字符

**✅ 验收**: 成功复制了URL和API Key

---

## 🔧 Step 4: 配置环境变量 (10分钟)

### 4.1 创建 `.env.local`

在项目根目录创建文件：

```bash
touch .env.local
```

### 4.2 填写环境变量

打开 `.env.local`，粘贴：

```env
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=你的项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon_key

# 示例（替换成你自己的）:
# NEXT_PUBLIC_SUPABASE_URL=https://abcdefg.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ 重要**:
- 确保变量名以 `NEXT_PUBLIC_` 开头
- 不要有多余的空格
- 不要用引号包裹值

### 4.3 重启开发服务器

```bash
# 停止当前服务器 (Ctrl+C)
# 重新启动
npm run dev
```

**✅ 验收**: 重启后无报错

---

## 📁 Step 5: 创建Supabase客户端配置 (30分钟)

### 5.1 创建目录结构

```bash
mkdir -p lib/supabase
mkdir -p types
```

### 5.2 创建浏览器端客户端

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

### 5.3 创建服务端客户端

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
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // 处理服务端组件中set cookie的问题
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // 处理服务端组件中remove cookie的问题
          }
        },
      },
    }
  )
}
```

**✅ 验收**: `lib/supabase/` 目录下有2个文件

---

## 🗃️ Step 6: 执行数据库建表 (40分钟)

### 6.1 打开SQL Editor

1. 回到Supabase Dashboard
2. 点击左侧菜单 "SQL Editor"
3. 点击右上角 "New query"

### 6.2 执行建表脚本

1. 打开项目根目录的 `database-schema.sql` 文件
2. **全选所有内容** (Ctrl+A / Cmd+A)
3. 复制
4. 粘贴到Supabase SQL Editor
5. 点击右下角绿色按钮 "Run"
6. 等待执行完成（约10-20秒）

**如果看到 "Success. No rows returned"**，说明执行成功！

### 6.3 验证表创建

1. 点击左侧菜单 "Table Editor"
2. 应该看到以下5张表：
   - `profiles`
   - `tags`
   - `user_tags`
   - `interests`
   - `connections`
3. 点击 `tags` 表
4. 应该看到30行数据（预设的标签）

**✅ 验收**: 5张表都在，`tags` 表有30条数据

### 6.4 可能遇到的问题

**问题1: "relation already exists"错误**
```sql
-- 如果表已存在，先删除
DROP TABLE IF EXISTS public.connections CASCADE;
DROP TABLE IF EXISTS public.interests CASCADE;
DROP TABLE IF EXISTS public.user_tags CASCADE;
DROP TABLE IF EXISTS public.tags CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 然后重新执行完整SQL
```

**问题2: "permission denied"错误**
- 确保你在Supabase Dashboard中执行，而不是本地终端
- 确保使用的是 "SQL Editor"，而不是其他工具

---

## 🔤 Step 7: 生成TypeScript类型 (30分钟)

### 7.1 安装Supabase CLI

```bash
npm install supabase --save-dev
```

### 7.2 登录Supabase CLI

```bash
npx supabase login
```

浏览器会打开，点击 "Authorize"。

### 7.3 获取Project ID

在Supabase Dashboard:
1. Project Settings → General
2. 复制 "Reference ID"（类似 `abcdefghijklm`）

### 7.4 生成类型文件

```bash
npx supabase gen types typescript --project-id 你的project_id > types/database.types.ts
```

例如：
```bash
npx supabase gen types typescript --project-id abcdefghijklm > types/database.types.ts
```

**✅ 验收**: `types/database.types.ts` 文件创建成功，内容约300-500行

---

## 🧪 Step 8: 测试数据库连接 (20分钟)

### 8.1 创建测试页面

创建目录和文件：

```bash
mkdir -p app/test
```

创建文件 `app/test/page.tsx`:

```typescript
import { createClient } from '@/lib/supabase/server'

export default async function TestPage() {
  const supabase = createClient()

  // 测试查询：获取5个标签
  const { data: tags, error } = await supabase
    .from('tags')
    .select('*')
    .limit(5)

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">数据库连接测试</h1>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-red-800 font-semibold">❌ 连接失败</h2>
            <p className="text-red-600 mt-2">{error.message}</p>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h2 className="text-green-800 font-semibold mb-3">✅ 连接成功！</h2>
            <p className="text-gray-700 mb-3">成功从数据库读取到 {tags?.length} 个标签：</p>
            <pre className="bg-white p-4 rounded border overflow-auto text-sm">
              {JSON.stringify(tags, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
```

### 8.2 访问测试页面

访问: http://localhost:3000/test

**期望看到**:
- ✅ 绿色背景的"连接成功"提示
- ✅ 显示5个标签的JSON数据

**如果看到红色错误**:
1. 检查 `.env.local` 文件是否正确
2. 确认已重启开发服务器
3. 确认Supabase项目没有暂停（Free Plan会自动暂停）
4. 检查浏览器Console是否有其他错误

---

## 📦 Step 9: 项目结构整理 (20分钟)

### 9.1 创建缺失的目录

```bash
mkdir -p components/ui
mkdir -p components/layout
mkdir -p components/forms
mkdir -p components/cards
mkdir -p lib/utils
mkdir -p lib/hooks
mkdir -p store
```

### 9.2 创建工具函数

创建文件 `lib/utils/cn.ts`:

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

安装依赖：
```bash
npm install clsx tailwind-merge
```

### 9.3 创建README

创建 `README.md`:

```markdown
# Co-founder Matching MVP

联合创始人配对平台 MVP 版本

## 技术栈

- Next.js 14 + TypeScript
- Supabase (PostgreSQL + Auth)
- Tailwind CSS + shadcn/ui
- React Hook Form + Zod

## 开发

\`\`\`bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问
http://localhost:3000
\`\`\`

## 环境变量

复制 `.env.example` 为 `.env.local`，填入你的Supabase配置。

## 文档

查看 `docs/` 目录获取详细文档。
```

**✅ 验收**: 目录结构完整

---

## ✅ Day 1 最终验收

在结束今天之前，确保以下所有检查项都通过：

### 核心功能
- [ ] `npm run dev` 能成功启动，无报错
- [ ] 访问 http://localhost:3000/test 显示绿色成功提示
- [ ] 能看到5个标签数据

### 文件结构
- [ ] `lib/supabase/client.ts` 存在
- [ ] `lib/supabase/server.ts` 存在
- [ ] `types/database.types.ts` 存在且有内容
- [ ] `.env.local` 存在且配置正确

### Supabase
- [ ] Supabase项目创建成功
- [ ] 5张表都存在
- [ ] `tags` 表有30条数据
- [ ] 能通过测试页面读取数据

### 依赖安装
- [ ] shadcn/ui组件安装完成（9个组件）
- [ ] 所有npm包安装无错误

---

## 🐛 常见问题排查

### 问题1: npm install失败

**现象**: 安装依赖时报错

**解决**:
```bash
# 清除缓存
npm cache clean --force

# 删除node_modules重新安装
rm -rf node_modules package-lock.json
npm install
```

---

### 问题2: 无法连接Supabase

**现象**: 测试页面显示红色错误

**排查步骤**:
1. 检查 `.env.local` 文件
   ```bash
   cat .env.local
   ```
   - 确认URL和Key无误
   - 确认没有多余空格或引号

2. 检查Supabase项目状态
   - 登录Supabase Dashboard
   - 确认项目显示绿色"Active"状态
   - Free Plan项目7天无活动会暂停，点击"Resume"恢复

3. 重启开发服务器
   ```bash
   # Ctrl+C 停止
   npm run dev  # 重新启动
   ```

4. 检查网络
   ```bash
   curl https://你的项目.supabase.co
   ```
   如果超时，可能需要VPN

---

### 问题3: TypeScript类型生成失败

**现象**: `npx supabase gen types` 报错

**解决**:
1. 确认已登录CLI
   ```bash
   npx supabase login
   ```

2. 确认Project ID正确
   - 在Supabase Dashboard: Settings → General → Reference ID
   - 不是Project URL，是一个短ID

3. 如果仍然失败，手动创建空文件
   ```bash
   echo "export type Database = any" > types/database.types.ts
   ```
   后续Day 2可以重新生成

---

### 问题4: shadcn/ui组件安装失败

**现象**: `npx shadcn-ui add` 报错

**解决**:
```bash
# 重新初始化
npx shadcn-ui@latest init --force

# 逐个安装组件
npx shadcn-ui@latest add button
# ... 其他组件
```

---

## 🎉 Day 1 完成！

如果所有验收项都通过，恭喜你完成了Day 1！

### 今天你完成了：
- ✅ 创建了Next.js项目
- ✅ 配置了Supabase数据库
- ✅ 建立了5张核心表
- ✅ 插入了30个预设标签
- ✅ 配置了TypeScript类型
- ✅ 测试了数据库连接

### 明天Day 2任务预告：
- 🔐 用户注册和登录功能
- 🎨 创建导航栏组件
- 🔒 路由保护（未登录自动跳转）
- 📄 基础页面布局

### 今天的代码记得提交：

```bash
git init
git add .
git commit -m "Day 1: 项目初始化完成 - 数据库设置成功"
```

---

## 📚 延伸学习（可选）

如果今天时间充裕，可以了解：
- [Next.js App Router文档](https://nextjs.org/docs/app)
- [Supabase认证文档](https://supabase.com/docs/guides/auth)
- [shadcn/ui组件库](https://ui.shadcn.com)

---

**休息一下，明天继续！** 🚀

有任何问题，可以：
1. 查看项目根目录的其他文档
2. 在Supabase Discord提问
3. 在Next.js Discord提问
4. 向Claude/ChatGPT求助（把错误信息完整发给它）
