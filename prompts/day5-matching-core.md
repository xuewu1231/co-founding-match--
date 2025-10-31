# Day 5核心功能: 双向匹配逻辑开发 - 详细Prompt

> 这是Day 5最核心的功能实现，当你在开发时可以把这个Prompt直接发给Claude/ChatGPT协助开发
---
## 🎯 开发需求

**功能名称**: "我想聊聊"兴趣表达 + 双向匹配检测

**业务逻辑**:
1. 用户A在名片池看到用户B的匿名卡片，点击"我想聊聊"
2. 系统记录这个兴趣信号到 `interests` 表
3. 系统检查用户B是否也曾对用户A发起过兴趣
4. 如果是（双向匹配）：自动创建连接记录，发送邮件通知双方
5. 如果否（单向兴趣）：只记录，不通知对方

---

## 📋 需要创建的文件

### 1. API Route: `/app/api/interests/send/route.ts`
### 2. 前端Hook: `/lib/hooks/useInterestMutation.ts`
### 3. 邮件工具: `/lib/email.ts` (可选，MVP阶段可跳过)

---

## 💻 代码实现要求

### 文件1: `app/api/interests/send/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    // TODO: 实现以下逻辑

    // 1. 从request body获取 receiver_id
    // 2. 通过supabase获取当前登录用户
    // 3. 如果未登录，返回401错误
    // 4. 检查是否已对该用户发起过pending状态的兴趣
    //    - 如果已发起，返回400错误: "你已经对TA表达过兴趣了"
    // 5. 在interests表插入新记录:
    //    - sender_id: 当前用户ID
    //    - receiver_id: 目标用户ID
    //    - status: 'pending'
    // 6. 查询反向兴趣: receiver是否曾对sender发起过pending兴趣
    // 7. 如果查到反向兴趣（双向匹配）:
    //    a. 计算 userAId = min(senderId, receiverId)
    //    b. 计算 userBId = max(senderId, receiverId)
    //    c. 在connections表插入记录:
    //       - user_a_id: userAId
    //       - user_b_id: userBId
    //       - status: 'active'
    //    d. 更新反向兴趣的status为'accepted'，设置responded_at为当前时间
    //    e. 返回成功响应: { success: true, matched: true, connection_id }
    // 8. 如果没有反向兴趣（单向）:
    //    - 返回: { success: true, matched: false, message: '兴趣已发送' }

    // 错误处理:
    // - 数据库错误返回500
    // - 所有数据库操作都要检查error

  } catch (error) {
    console.error('Send interest error:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
```

**关键点**:
- 使用 `createClient` from '@/lib/supabase/server'
- 使用 `supabase.auth.getUser()` 获取当前用户
- 所有数据库操作都要解构 `{ data, error }` 并检查error
- userA_id必须小于userB_id（数据库约束）

---

### 文件2: `lib/hooks/useInterestMutation.ts`

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'

export function useInterestMutation() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (receiverId: string) => {
      // TODO: 实现以下逻辑

      // 1. 调用 /api/interests/send 接口
      // 2. 传递 { receiver_id: receiverId }
      // 3. 返回响应数据
    },

    onSuccess: (data) => {
      // TODO: 成功后的处理

      // 1. 如果 data.matched === true:
      //    - 显示成功Toast: "🎉 恭喜！你们成功匹配了"
      //    - 可选: 播放庆祝动画
      // 2. 如果 data.matched === false:
      //    - 显示Toast: "兴趣已发送，等待对方响应"
      // 3. 刷新名片池数据: queryClient.invalidateQueries(['pool'])
    },

    onError: (error: any) => {
      // TODO: 错误处理

      // 显示错误Toast
      toast({
        title: '发送失败',
        description: error.message || '请稍后重试',
        variant: 'destructive',
      })
    },
  })
}
```

**关键点**:
- 使用React Query的useMutation
- 成功后要刷新名片池数据（因为按钮状态会变）
- 双向匹配时给用户明显的成功反馈

---

### 文件3: 前端使用示例

在 `components/cards/AnonymousCard.tsx` 中：

```typescript
'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useInterestMutation } from '@/lib/hooks/useInterestMutation'

interface AnonymousCardProps {
  id: string
  title: string
  vision: string
  tags: Array<{ name: string; category: string }>
  has_sent_interest: boolean
}

export function AnonymousCard({
  id,
  title,
  vision,
  tags,
  has_sent_interest
}: AnonymousCardProps) {
  const interestMutation = useInterestMutation()

  const handleInterest = () => {
    // TODO: 调用mutation
    interestMutation.mutate(id)
  }

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      {/* 头像占位 */}
      <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4" />

      {/* Title */}
      <h3 className="text-lg font-semibold text-center mb-2">{title}</h3>

      {/* 标签 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, idx) => (
          <Badge key={idx} variant="secondary">
            {tag.name}
          </Badge>
        ))}
      </div>

      {/* 愿景 */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{vision}</p>

      {/* 行动按钮 */}
      <Button
        className="w-full"
        onClick={handleInterest}
        disabled={has_sent_interest || interestMutation.isPending}
      >
        {has_sent_interest ? '已发送兴趣' : '我想聊聊'}
      </Button>
    </Card>
  )
}
```

---

## 🧪 测试场景

### 场景1: 单向兴趣（第一次发起）

**步骤**:
1. 用户A登录，进入名片池
2. 看到用户B的卡片，点击"我想聊聊"
3. 按钮变为"已发送兴趣"
4. 显示Toast: "兴趣已发送，等待对方响应"

**数据库验证**:
```sql
-- 应该有一条pending的interest记录
SELECT * FROM interests
WHERE sender_id = '用户A的ID'
AND receiver_id = '用户B的ID'
AND status = 'pending';
```

---

### 场景2: 双向匹配（第二次发起触发）

**前置条件**: 用户B已对用户A发起过兴趣

**步骤**:
1. 用户A登录，进入名片池
2. 看到用户B的卡片，点击"我想聊聊"
3. 🎉 显示成功Toast: "恭喜！你们成功匹配了"
4. 按钮变为"已连接"或卡片消失

**数据库验证**:
```sql
-- 1. 应该有一条active的connection记录
SELECT * FROM connections
WHERE (user_a_id = '较小的ID' AND user_b_id = '较大的ID')
AND status = 'active';

-- 2. 原来的pending interest应该变为accepted
SELECT * FROM interests
WHERE ((sender_id = '用户A' AND receiver_id = '用户B')
   OR (sender_id = '用户B' AND receiver_id = '用户A'))
AND status = 'accepted';
```

---

### 场景3: 重复发起（应该被拒绝）

**前置条件**: 用户A已对用户B发起过兴趣

**步骤**:
1. 用户A再次点击"我想聊聊"
2. 显示错误Toast: "你已经对TA表达过兴趣了"

---

## 🚨 常见Bug和解决方案

### Bug 1: 双向匹配时创建了2条connection记录

**原因**: userA_id和userB_id顺序不一致

**解决**:
```typescript
// 总是确保 user_a_id < user_b_id
const userAId = senderId < receiverId ? senderId : receiverId
const userBId = senderId < receiverId ? receiverId : senderId
```

---

### Bug 2: 并发问题（两人同时点击）

**现象**: 创建了2条连接记录

**解决方案**:
在数据库层面已有UNIQUE约束防止重复：
```sql
UNIQUE(user_a_id, user_b_id, status) WHERE status = 'active'
```

API代码中捕获这个错误：
```typescript
const { data: connection, error: connError } = await supabase
  .from('connections')
  .insert({ user_a_id: userAId, user_b_id: userBId })
  .select()
  .single()

if (connError) {
  // 如果是唯一约束错误，查询已存在的连接
  if (connError.code === '23505') {
    const { data: existing } = await supabase
      .from('connections')
      .select()
      .eq('user_a_id', userAId)
      .eq('user_b_id', userBId)
      .single()

    return NextResponse.json({
      success: true,
      matched: true,
      connection_id: existing?.id
    })
  }

  // 其他错误
  return NextResponse.json({ error: connError.message }, { status: 500 })
}
```

---

### Bug 3: 匹配成功后卡片还显示"我想聊聊"

**原因**: 前端缓存未更新

**解决**:
确保mutation成功后刷新数据：
```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['pool'] })
  queryClient.invalidateQueries({ queryKey: ['connections'] })
}
```

---

## 📊 性能优化建议（后续迭代）

### 1. 减少数据库查询
当前实现需要3-4次数据库查询，可以合并为一个事务：

```typescript
// 使用Supabase RPC调用存储过程
const { data, error } = await supabase.rpc('handle_interest_signal', {
  p_sender_id: senderId,
  p_receiver_id: receiverId
})
```

在数据库中创建函数：
```sql
CREATE OR REPLACE FUNCTION handle_interest_signal(
  p_sender_id UUID,
  p_receiver_id UUID
)
RETURNS JSON AS $$
  -- 在一个事务中完成所有操作
$$ LANGUAGE plpgsql;
```

### 2. 添加Redis缓存
缓存"用户A已对哪些人发起兴趣"：
```typescript
// 检查缓存
const hasSent = await redis.sismember(`user:${senderId}:sent_interests`, receiverId)
if (hasSent) {
  return { error: '已发送' }
}

// 发送后更新缓存
await redis.sadd(`user:${senderId}:sent_interests`, receiverId)
```

---

## ✅ 完成检查清单

开发完成后，确保：
- [ ] API能正确处理单向兴趣
- [ ] API能正确处理双向匹配
- [ ] API能拒绝重复发起
- [ ] 前端按钮状态正确更新
- [ ] Toast提示用户友好
- [ ] 双向匹配有明显的成功反馈
- [ ] 数据库约束正常工作（防止重复记录）
- [ ] 错误处理完善（网络错误、数据库错误）

---

## 🎓 如何使用这个Prompt

### 方法1: 直接让AI帮你写代码

把这个Prompt发给Claude/ChatGPT：

```
我正在开发一个联合创始人配对平台，需要实现双向匹配功能。

请根据以下需求，帮我完成 app/api/interests/send/route.ts 的代码实现：

[粘贴上面的"代码实现要求"部分]

技术栈：
- Next.js 14 App Router
- Supabase (PostgreSQL)
- TypeScript

请给我完整的代码，包含详细注释。
```

### 方法2: 分步骤开发

1. **Day 5上午**: 先实现API（单向兴趣）
2. **Day 5中午**: 添加双向匹配逻辑
3. **Day 5下午**: 实现前端Hook和UI
4. **Day 5晚上**: 测试和调试

每个步骤都可以向AI求助。

---

## 📞 遇到问题时的求助模板

```
我在开发双向匹配功能时遇到了问题：

【问题描述】
当两个用户互相感兴趣时，connection没有被创建。

【代码】
[粘贴你的代码]

【错误信息】
[粘贴Console或Network面板的错误]

【数据库状态】
[粘贴SELECT查询结果]

【期望行为】
应该在connections表创建一条记录。

请帮我分析问题可能在哪里，如何修复？
```

---

**这是整个项目最核心的功能，慢慢来，确保理解每一步！** 🚀
