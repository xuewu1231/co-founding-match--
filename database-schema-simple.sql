-- Co-founder Matching MVP - Database Schema (Simplified Version)
-- Target: PostgreSQL (Supabase) - Maximum Compatibility
-- Version: 1.2 - Removed IF NOT EXISTS for policies
-- Date: 2025-11-03

-- =====================================================
-- 先清理可能存在的对象（可选）
-- =====================================================
DROP TABLE IF EXISTS public.connections CASCADE;
DROP TABLE IF EXISTS public.interests CASCADE;
DROP TABLE IF EXISTS public.user_tags CASCADE;
DROP TABLE IF EXISTS public.tags CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- =====================================================
-- 1. PROFILES TABLE (用户资料表)
-- =====================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- 基本信息
  name VARCHAR(100) NOT NULL,
  title VARCHAR(200) NOT NULL,
  bio TEXT,
  vision TEXT,

  -- 社交链接
  linkedin_url VARCHAR(255),
  github_url VARCHAR(255),
  personal_website VARCHAR(255),

  -- 系统字段
  profile_completion INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. TAGS TABLE (标签表)
-- =====================================================
CREATE TABLE public.tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  category VARCHAR(20) NOT NULL CHECK (category IN ('ability', 'direction', 'role')),
  is_system BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. USER_TAGS TABLE (用户-标签关联表)
-- =====================================================
CREATE TABLE public.user_tags (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  tag_type VARCHAR(20) NOT NULL CHECK (tag_type IN ('my_ability', 'seeking_ability', 'direction')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tag_id, tag_type)
);

-- =====================================================
-- 4. INTERESTS TABLE (兴趣信号表)
-- =====================================================
CREATE TABLE public.interests (
  id SERIAL PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  responded_at TIMESTAMP WITH TIME ZONE,
  CHECK (sender_id != receiver_id)
);

-- =====================================================
-- 5. CONNECTIONS TABLE (连接表)
-- =====================================================
CREATE TABLE public.connections (
  id SERIAL PRIMARY KEY,
  user_a_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_b_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  user_a_status VARCHAR(20) DEFAULT '待联系' CHECK (user_a_status IN ('待联系', '已约见', '持续交流中', '已归档')),
  user_b_status VARCHAR(20) DEFAULT '待联系' CHECK (user_b_status IN ('待联系', '已约见', '持续交流中', '已归档')),
  established_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  feedback_sent_at TIMESTAMP WITH TIME ZONE,
  CHECK (user_a_id < user_b_id)
);

-- =====================================================
-- 6. 创建索引
-- =====================================================
CREATE INDEX idx_profiles_active ON public.profiles(is_active);
CREATE INDEX idx_tags_category ON public.tags(category);
CREATE INDEX idx_user_tags_tag ON public.user_tags(tag_id, tag_type);
CREATE INDEX idx_user_tags_user ON public.user_tags(user_id);
CREATE INDEX idx_interests_receiver ON public.interests(receiver_id, status);
CREATE INDEX idx_interests_sender ON public.interests(sender_id, status);
CREATE INDEX idx_connections_user_a ON public.connections(user_a_id, status);
CREATE INDEX idx_connections_user_b ON public.connections(user_b_id, status);

-- 防重复约束
CREATE UNIQUE INDEX idx_interests_unique_pending ON public.interests(sender_id, receiver_id) WHERE status = 'pending';
CREATE UNIQUE INDEX idx_connections_unique_active ON public.connections(user_a_id, user_b_id) WHERE status = 'active';

-- =====================================================
-- 7. 启用 ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 8. 创建安全策略（简化版）
-- =====================================================

-- Profiles策略
CREATE POLICY profiles_select_policy ON public.profiles FOR SELECT USING (is_active = true);
CREATE POLICY profiles_update_policy ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY profiles_insert_policy ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Tags策略
CREATE POLICY tags_select_policy ON public.tags FOR SELECT USING (true);
CREATE POLICY tags_insert_policy ON public.tags FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- UserTags策略
CREATE POLICY user_tags_select_policy ON public.user_tags FOR SELECT USING (true);
CREATE POLICY user_tags_all_policy ON public.user_tags FOR ALL USING (auth.uid() = user_id);

-- Interests策略
CREATE POLICY interests_select_received_policy ON public.interests FOR SELECT USING (auth.uid() = receiver_id);
CREATE POLICY interests_select_sent_policy ON public.interests FOR SELECT USING (auth.uid() = sender_id);
CREATE POLICY interests_insert_policy ON public.interests FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY interests_update_policy ON public.interests FOR UPDATE USING (auth.uid() = receiver_id);

-- Connections策略
CREATE POLICY connections_select_policy ON public.connections FOR SELECT USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);
CREATE POLICY connections_insert_policy ON public.connections FOR INSERT WITH CHECK (true);
CREATE POLICY connections_update_policy ON public.connections FOR UPDATE USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

-- =====================================================
-- 9. 插入系统标签数据
-- =====================================================

-- 能力标签
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

-- 方向标签
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

-- 角色标签
INSERT INTO public.tags (name, category, is_system) VALUES
  ('技术合伙人', 'role', true),
  ('产品合伙人', 'role', true),
  ('商业合伙人', 'role', true),
  ('运营合伙人', 'role', true),
  ('设计合伙人', 'role', true);

-- =====================================================
-- 10. 创建实用函数
-- =====================================================

-- 计算Profile完整度
CREATE OR REPLACE FUNCTION calculate_profile_completion(profile_id UUID)
RETURNS INTEGER AS $$
DECLARE
  completion INTEGER := 0;
  profile_record RECORD;
  tag_count INTEGER;
BEGIN
  SELECT * INTO profile_record FROM public.profiles WHERE id = profile_id;

  IF profile_record IS NULL THEN
    RETURN 0;
  END IF;

  -- 姓名 (15分)
  IF profile_record.name IS NOT NULL AND profile_record.name != '' THEN
    completion := completion + 15;
  END IF;

  -- Title (15分)
  IF profile_record.title IS NOT NULL AND profile_record.title != '' THEN
    completion := completion + 15;
  END IF;

  -- 愿景 (20分)
  IF profile_record.vision IS NOT NULL AND profile_record.vision != '' THEN
    completion := completion + 20;
  END IF;

  -- 我的能力标签 (20分)
  SELECT COUNT(*) INTO tag_count FROM public.user_tags
  WHERE user_id = profile_id AND tag_type = 'my_ability';
  IF tag_count > 0 THEN
    completion := completion + 20;
  END IF;

  -- 寻找的方向 (20分)
  SELECT COUNT(*) INTO tag_count FROM public.user_tags
  WHERE user_id = profile_id AND tag_type = 'direction';
  IF tag_count > 0 THEN
    completion := completion + 20;
  END IF;

  -- 个人简介 (5分)
  IF profile_record.bio IS NOT NULL AND profile_record.bio != '' THEN
    completion := completion + 5;
  END IF;

  -- 社交链接 (5分)
  IF profile_record.linkedin_url IS NOT NULL OR
     profile_record.github_url IS NOT NULL OR
     profile_record.personal_website IS NOT NULL THEN
    completion := completion + 5;
  END IF;

  RETURN completion;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 11. 验证创建结果
-- =====================================================
SELECT 'Tables created successfully!' as status;
SELECT COUNT(*) as tag_count FROM public.tags WHERE is_system = true;