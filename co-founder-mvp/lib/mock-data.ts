// Mock数据配置
export const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === 'true'

// Mock用户数据
export const MOCK_USER = {
  id: 'mock-user-001',
  email: 'test@example.com',
  created_at: '2025-11-04T00:00:00Z',
}

// Mock Profile数据
export const MOCK_PROFILES = [
  {
    id: 'profile-001',
    user_id: 'user-001',
    name: '张三',
    title: 'AI技术负责人',
    bio: '5年AI研发经验，曾在大厂带团队，现在想找商业合伙人一起创业',
    vision: '想做AIGC方向的创业项目',
    completion: 100,
    is_active: true,
    linkedin: 'https://linkedin.com/in/zhangsan',
    github: 'https://github.com/zhangsan',
    website: null,
    created_at: '2025-11-01T00:00:00Z',
    tags: [1, 2, 11, 16], // AI技术研发、产品从0到1、AIGC、技术合伙人
  },
  {
    id: 'profile-002',
    user_id: 'user-002',
    name: '李四',
    title: '产品总监',
    bio: '10年互联网产品经验，擅长从0到1，做过3个千万用户产品',
    vision: '寻找技术合伙人，想做企业服务SaaS',
    completion: 100,
    is_active: true,
    linkedin: 'https://linkedin.com/in/lisi',
    github: null,
    website: 'https://lisi.com',
    created_at: '2025-11-02T00:00:00Z',
    tags: [2, 3, 12, 17], // 产品从0到1、增长营销、企业服务SaaS、产品合伙人
  },
  {
    id: 'profile-003',
    user_id: 'user-003',
    name: '王五',
    title: '连续创业者',
    bio: '创过2次业，失败过也成功过，有丰富的创业经验和资源',
    vision: '寻找技术+产品合伙人，做AI+教育方向',
    completion: 90,
    is_active: true,
    linkedin: 'https://linkedin.com/in/wangwu',
    github: null,
    website: null,
    created_at: '2025-11-03T00:00:00Z',
    tags: [4, 5, 13, 18], // 融资能力、团队管理、教育、商业合伙人
  },
  {
    id: 'profile-004',
    user_id: 'user-004',
    name: '赵六',
    title: '全栈工程师',
    bio: '精通前后端开发，有创业热情，想找商业搭档',
    vision: '想做开发者工具或To B产品',
    completion: 85,
    is_active: true,
    linkedin: null,
    github: 'https://github.com/zhaoliu',
    website: null,
    created_at: '2025-11-03T00:00:00Z',
    tags: [1, 6, 14, 16], // AI技术研发、数据分析、开发者工具、技术合伙人
  },
  {
    id: 'profile-005',
    user_id: 'user-005',
    name: '孙七',
    title: '市场运营专家',
    bio: '擅长品牌营销和用户增长，想找技术合伙人一起做事',
    vision: '对消费级产品感兴趣，想做年轻人的产品',
    completion: 95,
    is_active: true,
    linkedin: 'https://linkedin.com/in/sunqi',
    github: null,
    website: 'https://sunqi.com',
    created_at: '2025-11-04T00:00:00Z',
    tags: [3, 5, 15, 18], // 增长营销、团队管理、消费级产品、商业合伙人
  },
]

// Mock当前用户的Profile
export const MOCK_MY_PROFILE = {
  id: 'profile-me',
  user_id: 'mock-user-001',
  name: '测试用户',
  title: 'MVP开发者',
  bio: '正在开发Co-founder匹配平台',
  vision: '想找技术和商业合伙人一起做产品',
  completion: 80,
  is_active: true,
  linkedin: null,
  github: 'https://github.com/testuser',
  website: null,
  created_at: '2025-11-04T00:00:00Z',
  tags: [1, 2, 11, 16],
}

// Mock标签数据
export const MOCK_TAGS = [
  // 能力标签
  { id: 1, name: 'AI技术研发', type: 'ability', is_system: true, usage_count: 10 },
  { id: 2, name: '产品从0到1', type: 'ability', is_system: true, usage_count: 15 },
  { id: 3, name: '增长营销', type: 'ability', is_system: true, usage_count: 8 },
  { id: 4, name: '融资能力', type: 'ability', is_system: true, usage_count: 6 },
  { id: 5, name: '团队管理', type: 'ability', is_system: true, usage_count: 12 },
  { id: 6, name: '数据分析', type: 'ability', is_system: true, usage_count: 7 },
  { id: 7, name: '设计能力', type: 'ability', is_system: true, usage_count: 5 },
  { id: 8, name: '商业拓展', type: 'ability', is_system: true, usage_count: 9 },
  { id: 9, name: '技术架构', type: 'ability', is_system: true, usage_count: 11 },
  { id: 10, name: '内容运营', type: 'ability', is_system: true, usage_count: 4 },

  // 方向标签（简化后移除，但保留数据结构）
  { id: 11, name: 'AIGC', type: 'direction', is_system: true, usage_count: 20 },
  { id: 12, name: '企业服务SaaS', type: 'direction', is_system: true, usage_count: 18 },
  { id: 13, name: '教育', type: 'direction', is_system: true, usage_count: 10 },
  { id: 14, name: '开发者工具', type: 'direction', is_system: true, usage_count: 15 },
  { id: 15, name: '消费级产品', type: 'direction', is_system: true, usage_count: 12 },

  // 角色标签
  { id: 16, name: '技术合伙人', type: 'role', is_system: true, usage_count: 25 },
  { id: 17, name: '产品合伙人', type: 'role', is_system: true, usage_count: 22 },
  { id: 18, name: '商业合伙人', type: 'role', is_system: true, usage_count: 20 },
  { id: 19, name: '运营合伙人', type: 'role', is_system: true, usage_count: 8 },
  { id: 20, name: '全能合伙人', type: 'role', is_system: true, usage_count: 15 },
]

// Mock兴趣表达数据
export const MOCK_INTERESTS = [
  {
    id: 'interest-001',
    sender_id: 'mock-user-001',
    receiver_id: 'user-002',
    status: 'pending',
    created_at: '2025-11-04T10:00:00Z',
  },
]

// Mock连接数据
export const MOCK_CONNECTIONS = [
  {
    id: 'connection-001',
    user_a_id: 'mock-user-001',
    user_b_id: 'user-003',
    status: 'active',
    created_at: '2025-11-03T15:00:00Z',
    connected_profile: MOCK_PROFILES[2], // 王五
  },
]

// 辅助函数：根据标签ID获取标签名称
export function getTagNames(tagIds: number[]): string[] {
  return tagIds
    .map(id => MOCK_TAGS.find(tag => tag.id === id)?.name)
    .filter(Boolean) as string[]
}

// 辅助函数：根据类型获取标签
export function getTagsByType(type: 'ability' | 'direction' | 'role') {
  return MOCK_TAGS.filter(tag => tag.type === type)
}

// 辅助函数：模拟延迟（让mock数据看起来像真实请求）
export function mockDelay(ms: number = 500) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
