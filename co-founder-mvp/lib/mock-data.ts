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
  {
    id: 'profile-006',
    user_id: 'user-006',
    name: '周八',
    title: '资深设计师',
    bio: '8年UX/UI设计经验，参与过多个知名产品设计，想找技术合伙人创业',
    vision: '想做用户体验极致的To C产品',
    completion: 90,
    is_active: true,
    linkedin: 'https://linkedin.com/in/zhouba',
    github: null,
    website: 'https://zhouba.design',
    created_at: '2025-11-04T00:00:00Z',
    tags: [7, 2, 15, 17], // 设计能力、产品从0到1、消费级产品、产品合伙人
  },
  {
    id: 'profile-007',
    user_id: 'user-007',
    name: '吴九',
    title: '数据科学家',
    bio: '专注机器学习和数据挖掘，有多篇顶会论文，想将技术商业化',
    vision: '寻找商业合伙人，做AI数据分析平台',
    completion: 88,
    is_active: true,
    linkedin: 'https://linkedin.com/in/wujiu',
    github: 'https://github.com/wujiu',
    website: null,
    created_at: '2025-11-04T00:00:00Z',
    tags: [1, 6, 11, 16], // AI技术研发、数据分析、AIGC、技术合伙人
  },
  {
    id: 'profile-008',
    user_id: 'user-008',
    name: '郑十',
    title: '天使投资人',
    bio: '投资过20+早期项目，3个已上市，想亲自下场做创业者',
    vision: '寻找技术+产品团队，一起做硬科技方向',
    completion: 100,
    is_active: true,
    linkedin: 'https://linkedin.com/in/zhengshi',
    github: null,
    website: null,
    created_at: '2025-11-04T00:00:00Z',
    tags: [4, 8, 12, 18], // 融资能力、商业拓展、企业服务SaaS、商业合伙人
  },
  {
    id: 'profile-009',
    user_id: 'user-009',
    name: '冯十一',
    title: 'iOS开发专家',
    bio: '10年移动端开发经验，做过日活千万级App，想做自己的产品',
    vision: '想做移动互联网创新产品',
    completion: 85,
    is_active: true,
    linkedin: null,
    github: 'https://github.com/fengshiyi',
    website: null,
    created_at: '2025-11-04T00:00:00Z',
    tags: [1, 9, 15, 16], // AI技术研发、技术架构、消费级产品、技术合伙人
  },
  {
    id: 'profile-010',
    user_id: 'user-010',
    name: '陈十二',
    title: '内容运营负责人',
    bio: '擅长内容营销和社区运营，做过多个百万粉丝账号，想找技术搭档',
    vision: '想做内容+AI方向的产品',
    completion: 92,
    is_active: true,
    linkedin: 'https://linkedin.com/in/chenshier',
    github: null,
    website: 'https://chenshier.com',
    created_at: '2025-11-04T00:00:00Z',
    tags: [10, 3, 11, 19], // 内容运营、增长营销、AIGC、运营合伙人
  },
  {
    id: 'profile-011',
    user_id: 'user-011',
    name: '褚十三',
    title: '后端架构师',
    bio: '负责过亿级用户系统架构设计，精通分布式和高并发，想创业',
    vision: '寻找产品合伙人，做企业级技术服务',
    completion: 87,
    is_active: true,
    linkedin: 'https://linkedin.com/in/chushisan',
    github: 'https://github.com/chushisan',
    website: null,
    created_at: '2025-11-04T00:00:00Z',
    tags: [9, 6, 12, 16], // 技术架构、数据分析、企业服务SaaS、技术合伙人
  },
  {
    id: 'profile-012',
    user_id: 'user-012',
    name: '卫十四',
    title: 'BD总监',
    bio: '10年商务拓展经验，帮助多家创业公司拿到首批客户，想自己创业',
    vision: '想做To B销售工具或CRM产品',
    completion: 93,
    is_active: true,
    linkedin: 'https://linkedin.com/in/weishisi',
    github: null,
    website: null,
    created_at: '2025-11-04T00:00:00Z',
    tags: [8, 5, 12, 18], // 商业拓展、团队管理、企业服务SaaS、商业合伙人
  },
  {
    id: 'profile-013',
    user_id: 'user-013',
    name: '蒋十五',
    title: 'AI算法工程师',
    bio: '深度学习方向，有多个开源项目，想将AI技术落地到实际场景',
    vision: '对AI+垂直行业感兴趣',
    completion: 89,
    is_active: true,
    linkedin: 'https://linkedin.com/in/jiangshiwu',
    github: 'https://github.com/jiangshiwu',
    website: 'https://jiangshiwu.ai',
    created_at: '2025-11-04T00:00:00Z',
    tags: [1, 2, 11, 16], // AI技术研发、产品从0到1、AIGC、技术合伙人
  },
  {
    id: 'profile-014',
    user_id: 'user-014',
    name: '沈十六',
    title: '产品经理',
    bio: '5年B端产品经验，做过多个企业级SaaS产品，想找技术合伙人',
    vision: '想做新一代协作工具',
    completion: 91,
    is_active: true,
    linkedin: 'https://linkedin.com/in/shenshiliu',
    github: null,
    website: null,
    created_at: '2025-11-04T00:00:00Z',
    tags: [2, 3, 12, 17], // 产品从0到1、增长营销、企业服务SaaS、产品合伙人
  },
  {
    id: 'profile-015',
    user_id: 'user-015',
    name: '韩十七',
    title: '前端技术专家',
    bio: '精通React/Vue生态，做过多个高性能Web应用，想做开发者产品',
    vision: '想做前端开发工具或低代码平台',
    completion: 86,
    is_active: true,
    linkedin: null,
    github: 'https://github.com/hanshiqi',
    website: 'https://hanshiqi.dev',
    created_at: '2025-11-04T00:00:00Z',
    tags: [1, 9, 14, 16], // AI技术研发、技术架构、开发者工具、技术合伙人
  },
  {
    id: 'profile-016',
    user_id: 'user-016',
    name: '杨十八',
    title: '教育行业专家',
    bio: '10年教育行业经验，做过在线教育平台，想用AI改变教育',
    vision: '寻找AI技术合伙人，做智能教育产品',
    completion: 94,
    is_active: true,
    linkedin: 'https://linkedin.com/in/yangshiba',
    github: null,
    website: null,
    created_at: '2025-11-04T00:00:00Z',
    tags: [2, 5, 13, 18], // 产品从0到1、团队管理、教育、商业合伙人
  },
  {
    id: 'profile-017',
    user_id: 'user-017',
    name: '朱十九',
    title: '安全专家',
    bio: '网络安全和数据安全专家，想做企业安全产品',
    vision: '寻找产品+商业合伙人，做安全SaaS',
    completion: 88,
    is_active: true,
    linkedin: 'https://linkedin.com/in/zhushijiu',
    github: 'https://github.com/zhushijiu',
    website: null,
    created_at: '2025-11-04T00:00:00Z',
    tags: [9, 6, 12, 16], // 技术架构、数据分析、企业服务SaaS、技术合伙人
  },
  {
    id: 'profile-018',
    user_id: 'user-018',
    name: '秦二十',
    title: '增长黑客',
    bio: '帮助多家公司实现用户增长10倍+，精通增长策略和数据分析',
    vision: '想找技术合伙人做增长工具产品',
    completion: 96,
    is_active: true,
    linkedin: 'https://linkedin.com/in/qinershi',
    github: null,
    website: 'https://qinershi.growth',
    created_at: '2025-11-04T00:00:00Z',
    tags: [3, 6, 15, 19], // 增长营销、数据分析、消费级产品、运营合伙人
  },
  {
    id: 'profile-019',
    user_id: 'user-019',
    name: '尤二一',
    title: '区块链开发者',
    bio: '5年Web3开发经验，参与过多个DeFi项目，想做更有价值的产品',
    vision: '对区块链+实体经济感兴趣',
    completion: 84,
    is_active: true,
    linkedin: null,
    github: 'https://github.com/youeryi',
    website: 'https://youeryi.web3',
    created_at: '2025-11-04T00:00:00Z',
    tags: [1, 9, 14, 16], // AI技术研发、技术架构、开发者工具、技术合伙人
  },
  {
    id: 'profile-020',
    user_id: 'user-020',
    name: '许二二',
    title: '连续创业者',
    bio: '创过3次业，2次被收购，想找靠谱的合伙人再次出发',
    vision: '对AI+企业服务方向感兴趣',
    completion: 100,
    is_active: true,
    linkedin: 'https://linkedin.com/in/xuerer',
    github: null,
    website: null,
    created_at: '2025-11-04T00:00:00Z',
    tags: [4, 5, 12, 20], // 融资能力、团队管理、企业服务SaaS、全能合伙人
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
