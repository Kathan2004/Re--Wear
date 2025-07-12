-- Database Migrations for ReWear
-- This file contains future migrations that can be applied as the application evolves

-- Migration 1: Add user preferences table
-- Date: 2024-01-20
-- Description: Add user preferences for notifications, privacy, and display settings

CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  profile_visibility VARCHAR(20) DEFAULT 'public' CHECK (profile_visibility IN ('public', 'private', 'friends')),
  show_location BOOLEAN DEFAULT true,
  show_points BOOLEAN DEFAULT true,
  language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Migration 2: Add item reports table for moderation
-- Date: 2024-01-20
-- Description: Allow users to report inappropriate items

CREATE TABLE IF NOT EXISTS item_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reporter_id UUID REFERENCES users(id) ON DELETE CASCADE,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  reason VARCHAR(100) NOT NULL CHECK (reason IN (
    'inappropriate', 'spam', 'fake_item', 'wrong_category', 'inappropriate_images',
    'copyright_violation', 'other'
  )),
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  moderator_id UUID REFERENCES users(id) ON DELETE SET NULL,
  moderator_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migration 3: Add item views tracking
-- Date: 2024-01-20
-- Description: Track individual item views for analytics

CREATE TABLE IF NOT EXISTS item_views (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES users(id) ON DELETE SET NULL, -- NULL for anonymous views
  ip_address INET,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migration 4: Add swap request disputes
-- Date: 2024-01-20
-- Description: Handle disputes between users during swaps

CREATE TABLE IF NOT EXISTS swap_disputes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  swap_request_id UUID REFERENCES swap_requests(id) ON DELETE CASCADE,
  initiator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reason VARCHAR(100) NOT NULL CHECK (reason IN (
    'item_not_as_described', 'item_not_received', 'item_damaged', 'wrong_item',
    'shipping_issues', 'communication_issues', 'other'
  )),
  description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'resolved', 'closed')),
  moderator_id UUID REFERENCES users(id) ON DELETE SET NULL,
  resolution TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migration 5: Add user badges/achievements
-- Date: 2024-01-20
-- Description: Gamification system with badges and achievements

CREATE TABLE IF NOT EXISTS badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(50),
  criteria_type VARCHAR(50) NOT NULL CHECK (criteria_type IN (
    'swaps_completed', 'items_listed', 'points_earned', 'reviews_received',
    'days_active', 'referrals', 'perfect_rating'
  )),
  criteria_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Migration 6: Add item collections/outfits
-- Date: 2024-01-20
-- Description: Allow users to create collections of items

CREATE TABLE IF NOT EXISTS collections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS collection_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(collection_id, item_id)
);

-- Migration 7: Add item condition photos
-- Date: 2024-01-20
-- Description: Separate table for condition photos with metadata

CREATE TABLE IF NOT EXISTS item_photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text VARCHAR(255),
  is_primary BOOLEAN DEFAULT false,
  photo_type VARCHAR(20) DEFAULT 'main' CHECK (photo_type IN ('main', 'detail', 'condition', 'size')),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migration 8: Add user referral system
-- Date: 2024-01-20
-- Description: Track user referrals for rewards

CREATE TABLE IF NOT EXISTS user_referrals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referred_email VARCHAR(255) NOT NULL,
  referred_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  points_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Migration 9: Add item shipping templates
-- Date: 2024-01-20
-- Description: Predefined shipping options and costs

CREATE TABLE IF NOT EXISTS shipping_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  base_cost DECIMAL(10,2) NOT NULL,
  weight_limit DECIMAL(8,2),
  estimated_days INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migration 10: Add item insurance options
-- Date: 2024-01-20
-- Description: Optional insurance for high-value items

CREATE TABLE IF NOT EXISTS item_insurance (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  insurance_type VARCHAR(50) NOT NULL CHECK (insurance_type IN ('basic', 'premium', 'collector')),
  coverage_amount DECIMAL(10,2) NOT NULL,
  premium_cost DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for new tables
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_item_reports_item_id ON item_reports(item_id);
CREATE INDEX IF NOT EXISTS idx_item_reports_status ON item_reports(status);
CREATE INDEX IF NOT EXISTS idx_item_views_item_id ON item_views(item_id);
CREATE INDEX IF NOT EXISTS idx_item_views_viewed_at ON item_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_swap_disputes_swap_request_id ON swap_disputes(swap_request_id);
CREATE INDEX IF NOT EXISTS idx_swap_disputes_status ON swap_disputes(status);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_collection_id ON collection_items(collection_id);
CREATE INDEX IF NOT EXISTS idx_item_photos_item_id ON item_photos(item_id);
CREATE INDEX IF NOT EXISTS idx_user_referrals_referrer_id ON user_referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_user_referrals_referral_code ON user_referrals(referral_code);

-- Enable RLS on new tables
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE swap_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_referrals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for new tables
CREATE POLICY "Users can view own preferences" ON user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON user_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can report items" ON item_reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Moderators can view all reports" ON item_reports FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

CREATE POLICY "Anyone can view item views" ON item_views FOR SELECT USING (true);
CREATE POLICY "Users can create item views" ON item_views FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own disputes" ON swap_disputes FOR SELECT USING (auth.uid() = initiator_id);
CREATE POLICY "Users can create disputes" ON swap_disputes FOR INSERT WITH CHECK (auth.uid() = initiator_id);
CREATE POLICY "Moderators can view all disputes" ON swap_disputes FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

CREATE POLICY "Users can view own badges" ON user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view public badges" ON user_badges FOR SELECT USING (true);

CREATE POLICY "Users can view own collections" ON collections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view public collections" ON collections FOR SELECT USING (is_public = true);
CREATE POLICY "Users can manage own collections" ON collections FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view collection items" ON collection_items FOR SELECT USING (true);
CREATE POLICY "Users can manage own collection items" ON collection_items FOR ALL USING (
  EXISTS (SELECT 1 FROM collections WHERE id = collection_items.collection_id AND user_id = auth.uid())
);

CREATE POLICY "Users can view item photos" ON item_photos FOR SELECT USING (true);
CREATE POLICY "Users can manage own item photos" ON item_photos FOR ALL USING (
  EXISTS (SELECT 1 FROM items WHERE id = item_photos.item_id AND user_id = auth.uid())
);

CREATE POLICY "Users can view own referrals" ON user_referrals FOR SELECT USING (auth.uid() = referrer_id);
CREATE POLICY "Users can create referrals" ON user_referrals FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- Insert sample badges
INSERT INTO badges (name, description, icon, criteria_type, criteria_value) VALUES
('First Swap', 'Complete your first clothing swap', '🔄', 'swaps_completed', 1),
('Active Trader', 'Complete 10 clothing swaps', '🏆', 'swaps_completed', 10),
('Fashion Enthusiast', 'List 20 items for swap', '👗', 'items_listed', 20),
('Points Collector', 'Earn 1000 points', '💰', 'points_earned', 1000),
('Community Builder', 'Receive 10 positive reviews', '⭐', 'reviews_received', 10),
('Early Adopter', 'Join within the first month', '🚀', 'days_active', 30),
('Referral Master', 'Refer 5 friends to the platform', '👥', 'referrals', 5),
('Perfect Rating', 'Maintain a 5-star rating', '🌟', 'perfect_rating', 5);

-- Insert sample shipping templates
INSERT INTO shipping_templates (name, description, base_cost, weight_limit, estimated_days) VALUES
('Standard Mail', 'USPS First Class Mail', 5.99, 1.0, 5),
('Priority Mail', 'USPS Priority Mail', 12.99, 5.0, 3),
('Express Mail', 'USPS Express Mail', 25.99, 10.0, 1),
('Local Pickup', 'Meet in person for exchange', 0.00, NULL, 0);

-- Create triggers for new tables
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_item_reports_updated_at BEFORE UPDATE ON item_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_swap_disputes_updated_at BEFORE UPDATE ON swap_disputes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create views for new features
CREATE VIEW user_achievements AS
SELECT 
  u.id as user_id,
  u.full_name,
  COUNT(DISTINCT ub.badge_id) as badges_earned,
  COUNT(DISTINCT sr.id) as swaps_completed,
  COUNT(DISTINCT i.id) as items_listed,
  u.points,
  AVG(ur.rating) as average_rating
FROM users u
LEFT JOIN user_badges ub ON u.id = ub.user_id
LEFT JOIN swap_requests sr ON (u.id = sr.requester_id OR u.id = sr.owner_id) AND sr.status = 'completed'
LEFT JOIN items i ON u.id = i.user_id
LEFT JOIN user_reviews ur ON u.id = ur.reviewed_user_id
GROUP BY u.id, u.full_name, u.points;

CREATE VIEW item_analytics AS
SELECT 
  i.id,
  i.title,
  i.points_value,
  COUNT(iv.id) as view_count,
  COUNT(DISTINCT uf.user_id) as favorite_count,
  COUNT(DISTINCT sr.id) as swap_request_count,
  i.created_at
FROM items i
LEFT JOIN item_views iv ON i.id = iv.item_id
LEFT JOIN user_favorites uf ON i.id = uf.item_id
LEFT JOIN swap_requests sr ON i.id = sr.requested_item_id
GROUP BY i.id, i.title, i.points_value, i.created_at; 