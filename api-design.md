# Co-founder Matching MVP - API接口设计文档

## 📋 概述

本文档定义了MVP阶段所有后端API接口的规范，包括请求/响应格式、认证要求、错误处理等。

### 技术栈
- **框架**: Next.js App Router API Routes
- **认证**: Supabase Auth (JWT Token)
- **数据库**: PostgreSQL (通过Supabase)

### 基础信息
- **Base URL**: `https://your-domain.com/api`
- **认证方式**: Bearer Token (由Supabase自动处理)
- **Content-Type**: `application/json`

---

## 🔐 认证

所有需要认证的API都会自动从Cookie中读取Supabase session。

### 认证流程
```typescript
// 前端自动处理
const supabase = createClient()
const { data: { session } } = await supabase.auth.getSession()
// session会自动包含在后续请求的Cookie中
```

### 错误码
| 状态码 | 说明 |
|-------|------|
| 401 | 未登录或Token过期 |
| 403 | 已登录但无权限访问该资源 |

---

## 📁 API接口列表

### 1. Profile相关

#### 1.1 获取Profile完整度
```
GET /api/profile/completion
```

**认证**: 必需

**响应**:
```json
{
  "completion": 85,
  "missing_fields": ["bio", "linkedin_url"]
}
```

**实现示例**:
```typescript
// app/api/profile/completion/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 调用数据库函数计算完整度
  const { data, error } = await supabase
    .rpc('calculate_profile_completion', { profile_id: user.id })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ completion: data })
}
```

---

#### 1.2 更新Profile
```
PUT /api/profile
```

**认证**: 必需

**请求体**:
```json
{
  "name": "张三",
  "title": "连续创业者 | AI产品经理",
  "bio": "5年互联网产品经验...",
  "vision": "用AI改变教育行业",
  "linkedin_url": "https://linkedin.com/in/zhangsan",
  "github_url": null,
  "personal_website": "https://zhangsan.com"
}
```

**响应**:
```json
{
  "success": true,
  "profile": {
    "id": "uuid",
    "name": "张三",
    "title": "连续创业者 | AI产品经理",
    "profile_completion": 90
  }
}
```

---

#### 1.3 获取可见的Profile（根据关系）
```
GET /api/profile/:userId
```

**认证**: 必需

**响应 (陌生人)**:
```json
{
  "id": "uuid",
  "title": "连续创业者 | AI产品经理",
  "vision": "用AI改变教育行业",
  "tags": [
    { "name": "AI技术研发", "type": "my_ability" },
    { "name": "产品从0到1", "type": "my_ability" }
  ],
  "name": null,  // 隐藏
  "bio": null,
  "linkedin_url": null
}
```

**响应 (已连接)**:
```json
{
  "id": "uuid",
  "name": "张三",  // 解锁
  "title": "连续创业者 | AI产品经理",
  "bio": "5年互联网产品经验...",
  "vision": "用AI改变教育行业",
  "linkedin_url": "https://linkedin.com/in/zhangsan",
  "tags": [...]
}
```

**实现示例**:
```typescript
// app/api/profile/[userId]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 使用数据库函数返回可见Profile
  const { data, error } = await supabase
    .rpc('get_visible_profile', {
      target_user_id: params.userId,
      requester_id: user.id
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
```

---

### 2. 标签相关

#### 2.1 获取所有标签（分类）
```
GET /api/tags
```

**认证**: 可选

**查询参数**:
- `category`: `ability` | `direction` | `role` (可选，筛选分类)

**响应**:
```json
{
  "tags": [
    {
      "id": 1,
      "name": "AI技术研发",
      "category": "ability",
      "usage_count": 45
    },
    {
      "id": 2,
      "name": "产品从0到1",
      "category": "ability",
      "usage_count": 32
    }
  ]
}
```

---

#### 2.2 创建自定义标签
```
POST /api/tags
```

**认证**: 必需

**请求体**:
```json
{
  "name": "区块链开发",
  "category": "ability"
}
```

**响应**:
```json
{
  "success": true,
  "tag": {
    "id": 31,
    "name": "区块链开发",
    "category": "ability",
    "is_system": false
  }
}
```

---

#### 2.3 更新用户标签
```
POST /api/profile/tags
```

**认证**: 必需

**请求体**:
```json
{
  "my_abilities": [1, 2, 5],  // 标签IDs
  "seeking_abilities": [3, 7],
  "directions": [10, 15]
}
```

**响应**:
```json
{
  "success": true,
  "updated": true
}
```

**实现逻辑**:
```typescript
// 1. 删除用户所有旧标签
await supabase
  .from('user_tags')
  .delete()
  .eq('user_id', user.id)

// 2. 批量插入新标签
const tagsToInsert = [
  ...my_abilities.map(tagId => ({
    user_id: user.id,
    tag_id: tagId,
    tag_type: 'my_ability'
  })),
  ...seeking_abilities.map(tagId => ({
    user_id: user.id,
    tag_id: tagId,
    tag_type: 'seeking_ability'
  })),
  ...directions.map(tagId => ({
    user_id: user.id,
    tag_id: tagId,
    tag_type: 'direction'
  }))
]

await supabase
  .from('user_tags')
  .insert(tagsToInsert)
```

---

### 3. 名片池相关

#### 3.1 获取名片池（可筛选）
```
GET /api/pool
```

**认证**: 必需

**查询参数**:
- `tags`: 标签IDs，逗号分隔 (如 `1,2,5`)
- `limit`: 返回数量，默认20
- `offset`: 分页偏移，默认0

**响应**:
```json
{
  "cards": [
    {
      "id": "uuid",
      "title": "连续创业者 | AI产品经理",
      "vision": "用AI改变教育行业",
      "tags": [
        { "name": "AI技术研发", "category": "ability" },
        { "name": "产品从0到1", "category": "ability" }
      ],
      "has_sent_interest": false  // 当前用户是否已发起兴趣
    }
  ],
  "total": 45,
  "has_more": true
}
```

**实现示例**:
```typescript
// app/api/pool/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tagIds = searchParams.get('tags')?.split(',').map(Number) || []
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('profiles')
    .select(`
      id,
      title,
      vision,
      user_tags (
        tags (
          id,
          name,
          category
        )
      )
    `)
    .eq('is_active', true)
    .neq('id', user!.id)  // 排除自己

  // 如果有标签筛选
  if (tagIds.length > 0) {
    // 子查询：找出拥有这些标签的用户IDs
    const { data: userIdsData } = await supabase
      .from('user_tags')
      .select('user_id')
      .in('tag_id', tagIds)

    const userIds = [...new Set(userIdsData?.map(item => item.user_id))]

    query = query.in('id', userIds)
  }

  const { data, error, count } = await query
    .range(offset, offset + limit - 1)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 检查当前用户是否已对这些人发起过兴趣
  const { data: sentInterests } = await supabase
    .from('interests')
    .select('receiver_id')
    .eq('sender_id', user!.id)
    .eq('status', 'pending')

  const sentIds = new Set(sentInterests?.map(i => i.receiver_id))

  const cards = data?.map(profile => ({
    ...profile,
    has_sent_interest: sentIds.has(profile.id)
  }))

  return NextResponse.json({
    cards,
    total: count,
    has_more: offset + limit < (count || 0)
  })
}
```

---

### 4. 兴趣信号相关

#### 4.1 发起兴趣
```
POST /api/interests/send
```

**认证**: 必需

**请求体**:
```json
{
  "receiver_id": "uuid"
}
```

**响应 (单向兴趣)**:
```json
{
  "success": true,
  "matched": false,
  "message": "兴趣已发送，等待对方响应"
}
```

**响应 (双向匹配)**:
```json
{
  "success": true,
  "matched": true,
  "connection_id": 123,
  "message": "恭喜！你们成功匹配了"
}
```

**核心逻辑**:
```typescript
// app/api/interests/send/route.ts
export async function POST(request: Request) {
  const { receiver_id } = await request.json()

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 1. 检查是否已发起过
  const { data: existing } = await supabase
    .from('interests')
    .select()
    .eq('sender_id', user.id)
    .eq('receiver_id', receiver_id)
    .eq('status', 'pending')
    .single()

  if (existing) {
    return NextResponse.json(
      { error: '你已经对TA表达过兴趣了' },
      { status: 400 }
    )
  }

  // 2. 记录兴趣
  const { error: insertError } = await supabase
    .from('interests')
    .insert({
      sender_id: user.id,
      receiver_id: receiver_id,
      status: 'pending'
    })

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // 3. 检查反向兴趣（双向匹配）
  const { data: reverseInterest } = await supabase
    .from('interests')
    .select()
    .eq('sender_id', receiver_id)
    .eq('receiver_id', user.id)
    .eq('status', 'pending')
    .single()

  if (reverseInterest) {
    // 双向匹配！建立连接
    const userAId = user.id < receiver_id ? user.id : receiver_id
    const userBId = user.id < receiver_id ? receiver_id : user.id

    const { data: connection, error: connError } = await supabase
      .from('connections')
      .insert({
        user_a_id: userAId,
        user_b_id: userBId,
        status: 'active'
      })
      .select()
      .single()

    if (connError) {
      return NextResponse.json({ error: connError.message }, { status: 500 })
    }

    // 更新兴趣状态为accepted
    await supabase
      .from('interests')
      .update({ status: 'accepted', responded_at: new Date().toISOString() })
      .in('id', [reverseInterest.id])

    // TODO: 发送邮件通知

    return NextResponse.json({
      success: true,
      matched: true,
      connection_id: connection.id,
      message: '恭喜！你们成功匹配了'
    })
  }

  // 单向兴趣
  return NextResponse.json({
    success: true,
    matched: false,
    message: '兴趣已发送，等待对方响应'
  })
}
```

---

#### 4.2 获取收到的兴趣
```
GET /api/interests/received
```

**认证**: 必需

**响应**:
```json
{
  "interests": [
    {
      "id": 123,
      "sender": {
        "id": "uuid",
        "title": "连续创业者 | AI产品经理",
        "vision": "用AI改变教育行业",
        "tags": [...]
      },
      "created_at": "2025-10-30T10:00:00Z"
    }
  ]
}
```

---

#### 4.3 响应兴趣（接受/拒绝）
```
POST /api/interests/:interestId/respond
```

**认证**: 必需

**请求体**:
```json
{
  "action": "accept" // 或 "reject"
}
```

**响应 (接受)**:
```json
{
  "success": true,
  "matched": true,
  "connection_id": 456
}
```

**响应 (拒绝)**:
```json
{
  "success": true,
  "matched": false
}
```

---

### 5. 连接相关

#### 5.1 获取已连接列表
```
GET /api/connections
```

**认证**: 必需

**响应**:
```json
{
  "connections": [
    {
      "id": 123,
      "user": {
        "id": "uuid",
        "name": "张三",  // 真实姓名
        "title": "连续创业者 | AI产品经理",
        "linkedin_url": "https://linkedin.com/in/zhangsan"
      },
      "established_at": "2025-10-28T15:30:00Z",
      "my_status": "待联系",  // 用户自己标记的状态
      "days_since_connection": 3
    }
  ]
}
```

**实现示例**:
```typescript
// app/api/connections/route.ts
export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('connections')
    .select(`
      id,
      user_a_id,
      user_b_id,
      user_a_status,
      user_b_status,
      established_at,
      profiles!connections_user_a_id_fkey (
        id,
        name,
        title,
        linkedin_url
      ),
      profiles!connections_user_b_id_fkey (
        id,
        name,
        title,
        linkedin_url
      )
    `)
    .eq('status', 'active')
    .or(`user_a_id.eq.${user!.id},user_b_id.eq.${user!.id}`)

  // 格式化数据：找出对方是谁
  const connections = data?.map(conn => {
    const isUserA = conn.user_a_id === user!.id
    const otherUser = isUserA
      ? conn.profiles!connections_user_b_id_fkey
      : conn.profiles!connections_user_a_id_fkey

    return {
      id: conn.id,
      user: otherUser,
      established_at: conn.established_at,
      my_status: isUserA ? conn.user_a_status : conn.user_b_status,
      days_since_connection: Math.floor(
        (Date.now() - new Date(conn.established_at).getTime()) / (1000 * 60 * 60 * 24)
      )
    }
  })

  return NextResponse.json({ connections })
}
```

---

#### 5.2 更新连接状态
```
PATCH /api/connections/:connectionId/status
```

**认证**: 必需

**请求体**:
```json
{
  "status": "已约见"  // 待联系 | 已约见 | 持续交流中 | 已归档
}
```

**响应**:
```json
{
  "success": true
}
```

---

## 🚨 错误响应格式

所有错误响应统一格式:

```json
{
  "error": "错误描述信息",
  "code": "ERROR_CODE",  // 可选
  "details": {}  // 可选，详细错误信息
}
```

### 常见错误码

| HTTP状态码 | 错误码 | 说明 |
|-----------|-------|------|
| 400 | BAD_REQUEST | 请求参数错误 |
| 401 | UNAUTHORIZED | 未登录 |
| 403 | FORBIDDEN | 无权限 |
| 404 | NOT_FOUND | 资源不存在 |
| 409 | CONFLICT | 资源冲突（如重复发起兴趣） |
| 500 | INTERNAL_ERROR | 服务器错误 |

---

## 🧪 测试建议

### Postman/Insomnia Collection

```json
{
  "name": "Co-founder MVP",
  "baseUrl": "http://localhost:3000/api",
  "auth": {
    "type": "bearer",
    "token": "从Supabase获取的access_token"
  },
  "requests": [
    {
      "name": "Get Profile Completion",
      "method": "GET",
      "url": "{{baseUrl}}/profile/completion"
    },
    {
      "name": "Get Pool",
      "method": "GET",
      "url": "{{baseUrl}}/pool?tags=1,2&limit=10"
    },
    {
      "name": "Send Interest",
      "method": "POST",
      "url": "{{baseUrl}}/interests/send",
      "body": {
        "receiver_id": "uuid-here"
      }
    }
  ]
}
```

---

## 📝 开发建议

1. **API Route文件命名**: 使用 `route.ts` 而非 `index.ts`
2. **错误处理**: 统一使用 try-catch 包裹
3. **日志记录**: 开发时多打console.log，生产时移除
4. **类型安全**: 使用Zod验证请求体
5. **CORS**: Next.js API Routes默认同源，无需配置

---

**文档版本**: v1.0
**最后更新**: 2025-10-31
