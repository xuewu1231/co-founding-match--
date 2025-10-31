-- Co-founder Matching MVP - Database Schema
-- Target: PostgreSQL (Supabase)
-- Version: 1.0
-- Date: 2025-10-31

-- =====================================================
-- 1. USERS TABLE (由Supabase Auth自动创建)
-- =====================================================
-- Supabase会自动创建 auth.users 表
-- 我们只需要在 public schema 创建扩展表

-- =====================================================
-- 2. PROFILES TABLE (用户资料表)
-- =====================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- 基本信息
  name VARCHAR(100) NOT NULL,
  title VARCHAR(200) NOT NULL, -- 一句话介绍，如"连续创业者 | AI产品经理"
  bio TEXT, -- 个人简介，最多500字

  -- 愿景与方向
  vision TEXT, -- 我想做什么，最多300字

  -- 社交链接
  linkedin_url VARCHAR(255),
  github_url VARCHAR(255),
  personal_website VARCHAR(255),

  -- 系统字段
  profile_completion INTEGER DEFAULT 0, -- Profile完整度百分比 (0-100)
  is_active BOOLEAN DEFAULT true, -- 是否激活

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 添加索引
CREATE INDEX idx_profiles_active ON public.profiles(is_active) WHERE is_active = true;

-- 添加更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 3. TAGS TABLE (标签表)
-- =====================================================
CREATE TABLE public.tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,

  -- 标签分类：ability(能力)、direction(方向)、role(角色)
  category VARCHAR(20) NOT NULL CHECK (category IN ('ability', 'direction', 'role')),

  -- 标签来源：系统预设 vs 用户创建
  is_system BOOLEAN DEFAULT false,

  -- 使用统计
  usage_count INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 添加索引
CREATE INDEX idx_tags_category ON public.tags(category);
CREATE INDEX idx_tags_usage ON public.tags(usage_count DESC);

-- =====================================================
-- 4. USER_TAGS TABLE (用户-标签关联表)
-- =====================================================
CREATE TABLE public.user_tags (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,

  -- 标签用途：my_ability(我的能力)、seeking_ability(期待对方的能力)、direction(想做的方向)
  tag_type VARCHAR(20) NOT NULL CHECK (tag_type IN ('my_ability', 'seeking_ability', 'direction')),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- 确保同一用户不会重复添加相同标签的相同用途
  UNIQUE(user_id, tag_id, tag_type)
);

-- 添加索引（用于快速查询"拥有某标签的用户"）
CREATE INDEX idx_user_tags_tag ON public.user_tags(tag_id, tag_type);
CREATE INDEX idx_user_tags_user ON public.user_tags(user_id);

-- =====================================================
-- 5. INTERESTS TABLE (兴趣信号表)
-- =====================================================
CREATE TABLE public.interests (
  id SERIAL PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- 状态：pending(待响应)、accepted(已接受，建立连接)、rejected(已拒绝)
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  responded_at TIMESTAMP WITH TIME ZONE, -- 对方响应时间

  -- 约束：不能对自己发起兴趣
  CHECK (sender_id != receiver_id),

  -- 约束：同一对用户只能有一条pending状态的兴趣信号
  UNIQUE(sender_id, receiver_id, status)
    WHERE status = 'pending'
);

-- 添加索引（用于快速查询"收到的兴趣"和"发出的兴趣"）
CREATE INDEX idx_interests_receiver ON public.interests(receiver_id, status, created_at DESC);
CREATE INDEX idx_interests_sender ON public.interests(sender_id, status, created_at DESC);
CREATE INDEX idx_interests_pair ON public.interests(sender_id, receiver_id);

-- =====================================================
-- 6. CONNECTIONS TABLE (连接表)
-- =====================================================
CREATE TABLE public.connections (
  id SERIAL PRIMARY KEY,

  -- 使用 user_a_id < user_b_id 的约定，避免重复记录
  user_a_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_b_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- 连接状态：active(活跃)、archived(已归档)
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),

  -- 各自的管理状态（用户自己管理，不通知对方）
  user_a_status VARCHAR(20) DEFAULT '待联系' CHECK (user_a_status IN ('待联系', '已约见', '持续交流中', '已归档')),
  user_b_status VARCHAR(20) DEFAULT '待联系' CHECK (user_b_status IN ('待联系', '已约见', '持续交流中', '已归档')),

  established_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- 反馈问卷相关（MVP暂不实现）
  feedback_sent_at TIMESTAMP WITH TIME ZONE,

  -- 约束：user_a_id 必须小于 user_b_id
  CHECK (user_a_id < user_b_id),

  -- 约束：同一对用户只能有一条active状态的连接
  UNIQUE(user_a_id, user_b_id, status) WHERE status = 'active'
);

-- 添加索引（用于快速查询某用户的所有连接）
CREATE INDEX idx_connections_user_a ON public.connections(user_a_id, status);
CREATE INDEX idx_connections_user_b ON public.connections(user_b_id, status);
CREATE INDEX idx_connections_established ON public.connections(established_at DESC);

-- =====================================================
-- 7. ROW LEVEL SECURITY (RLS) 策略
-- =====================================================

-- 启用RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

-- PROFILES 策略
-- 任何人都可以查看激活的Profile（权限控制在应用层）
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (is_active = true);

-- 用户只能更新自己的Profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 用户只能插入自己的Profile
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- TAGS 策略
-- 任何人都可以查看标签
CREATE POLICY "Tags are viewable by everyone" ON public.tags
  FOR SELECT USING (true);

-- 任何登录用户都可以创建标签
CREATE POLICY "Authenticated users can create tags" ON public.tags
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- USER_TAGS 策略
-- 任何人都可以查看用户标签（用于匹配筛选）
CREATE POLICY "User tags are viewable by everyone" ON public.user_tags
  FOR SELECT USING (true);

-- 用户只能管理自己的标签
CREATE POLICY "Users can manage own tags" ON public.user_tags
  FOR ALL USING (auth.uid() = user_id);

-- INTERESTS 策略
-- 用户可以查看发给自己的兴趣
CREATE POLICY "Users can view received interests" ON public.interests
  FOR SELECT USING (auth.uid() = receiver_id);

-- 用户可以查看自己发出的兴趣
CREATE POLICY "Users can view sent interests" ON public.interests
  FOR SELECT USING (auth.uid() = sender_id);

-- 用户可以发起兴趣
CREATE POLICY "Users can send interests" ON public.interests
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- 用户可以更新收到的兴趣状态
CREATE POLICY "Users can update received interests" ON public.interests
  FOR UPDATE USING (auth.uid() = receiver_id);

-- CONNECTIONS 策略
-- 用户可以查看自己的连接
CREATE POLICY "Users can view own connections" ON public.connections
  FOR SELECT USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

-- 系统可以创建连接（通过Service Role Key）
CREATE POLICY "Service role can create connections" ON public.connections
  FOR INSERT WITH CHECK (true);

-- 用户可以更新自己的连接状态
CREATE POLICY "Users can update own connection status" ON public.connections
  FOR UPDATE USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

-- =====================================================
-- 8. 初始化系统标签数据
-- =====================================================

-- 能力标签 (ability)
INSERT INTO public.tags (name, category, is_system) VALUES
  ('AI技术研发', 'ability', true),
  ('产品从0到1', 'ability', true),
  ('商业化与融资', 'ability', true),
  ('市场营销', 'ability', true),
  ('数据分析', 'ability', true),
  ('UI/UX设计', 'ability', true),
  ('团队管理', 'ability', true),
  ('供应链管理', 'ability', true),
  ('内容运营', 'ability', true),
  ('技术架构', 'ability', true);

-- 方向标签 (direction)
INSERT INTO public.tags (name, category, is_system) VALUES
  ('AIGC', 'direction', true),
  ('企业服务SaaS', 'direction', true),
  ('消费科技', 'direction', true),
  ('生命科学', 'direction', true),
  ('教育科技', 'direction', true),
  ('金融科技', 'direction', true),
  ('硬件/物联网', 'direction', true),
  ('Web3/区块链', 'direction', true),
  ('社交网络', 'direction', true),
  ('电商零售', 'direction', true);

-- 角色标签 (role)
INSERT INTO public.tags (name, category, is_system) VALUES
  ('技术合伙人', 'role', true),
  ('产品合伙人', 'role', true),
  ('商业合伙人', 'role', true),
  ('运营合伙人', 'role', true),
  ('设计合伙人', 'role', true);

-- =====================================================
-- 9. 实用函数
-- =====================================================

-- 计算Profile完整度
CREATE OR REPLACE FUNCTION calculate_profile_completion(profile_id UUID)
RETURNS INTEGER AS $$
DECLARE
  completion INTEGER := 0;
  profile_record RECORD;
  tag_count INTEGER;
BEGIN
  -- 获取Profile数据
  SELECT * INTO profile_record FROM public.profiles WHERE id = profile_id;

  -- 姓名 (必填, 15分)
  IF profile_record.name IS NOT NULL AND profile_record.name != '' THEN
    completion := completion + 15;
  END IF;

  -- Title (必填, 15分)
  IF profile_record.title IS NOT NULL AND profile_record.title != '' THEN
    completion := completion + 15;
  END IF;

  -- 愿景 (必填, 20分)
  IF profile_record.vision IS NOT NULL AND profile_record.vision != '' THEN
    completion := completion + 20;
  END IF;

  -- 我的能力标签 (必填至少1个, 20分)
  SELECT COUNT(*) INTO tag_count FROM public.user_tags
  WHERE user_id = profile_id AND tag_type = 'my_ability';
  IF tag_count > 0 THEN
    completion := completion + 20;
  END IF;

  -- 寻找的方向 (必填至少1个, 20分)
  SELECT COUNT(*) INTO tag_count FROM public.user_tags
  WHERE user_id = profile_id AND tag_type = 'direction';
  IF tag_count > 0 THEN
    completion := completion + 20;
  END IF;

  -- 个人简介 (选填, 5分)
  IF profile_record.bio IS NOT NULL AND profile_record.bio != '' THEN
    completion := completion + 5;
  END IF;

  -- 社交链接 (选填, 5分)
  IF profile_record.linkedin_url IS NOT NULL OR
     profile_record.github_url IS NOT NULL OR
     profile_record.personal_website IS NOT NULL THEN
    completion := completion + 5;
  END IF;

  RETURN completion;
END;
$$ LANGUAGE plpgsql;

-- 获取某用户可见的Profile（根据是否已连接）
CREATE OR REPLACE FUNCTION get_visible_profile(target_user_id UUID, requester_id UUID)
RETURNS JSON AS $$
DECLARE
  is_connected BOOLEAN;
  profile_data JSON;
BEGIN
  -- 检查是否已连接
  SELECT EXISTS(
    SELECT 1 FROM public.connections
    WHERE status = 'active' AND (
      (user_a_id = target_user_id AND user_b_id = requester_id) OR
      (user_a_id = requester_id AND user_b_id = target_user_id)
    )
  ) INTO is_connected;

  -- 如果查看自己或已连接，返回完整信息
  IF target_user_id = requester_id OR is_connected THEN
    SELECT row_to_json(p) INTO profile_data FROM public.profiles p WHERE id = target_user_id;
  ELSE
    -- 陌生人：返回匿名信息
    SELECT json_build_object(
      'id', p.id,
      'title', p.title,
      'vision', p.vision,
      'name', NULL,  -- 隐藏姓名
      'bio', NULL,
      'linkedin_url', NULL,
      'github_url', NULL,
      'personal_website', NULL
    ) INTO profile_data FROM public.profiles p WHERE id = target_user_id;
  END IF;

  RETURN profile_data;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 10. 触发器：自动更新标签使用次数
-- =====================================================
CREATE OR REPLACE FUNCTION increment_tag_usage()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tag_usage_increment AFTER INSERT ON public.user_tags
FOR EACH ROW EXECUTE FUNCTION increment_tag_usage();

-- =====================================================
-- END OF SCHEMA
-- =====================================================

-- 验证脚本
-- SELECT 'Schema created successfully!' AS status;
