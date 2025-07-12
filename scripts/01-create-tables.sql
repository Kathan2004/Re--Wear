-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table with authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  points INTEGER DEFAULT 100 CHECK (points >= 0),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  avatar_url TEXT,
  bio TEXT,
  location VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  type VARCHAR(100),
  size VARCHAR(20),
  condition VARCHAR(50) CHECK (condition IN ('New', 'Like New', 'Excellent', 'Good', 'Fair', 'Poor')),
  tags TEXT[],
  images TEXT[],
  points_value INTEGER DEFAULT 50 CHECK (points_value >= 0),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'sold')),
  is_available BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create swap_requests table (renamed from swaps for clarity)
CREATE TABLE IF NOT EXISTS swap_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  requester_id UUID REFERENCES users(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  requested_item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  offered_item_id UUID REFERENCES items(id) ON DELETE SET NULL,
  swap_type VARCHAR(20) NOT NULL CHECK (swap_type IN ('direct', 'points', 'mixed')),
  points_offered INTEGER CHECK (points_offered >= 0),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'shipped', 'cancelled')),
  message TEXT,
  shipping_method VARCHAR(20) CHECK (shipping_method IN ('pickup', 'courier', 'mail')),
  shipping_address TEXT,
  tracking_number VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure either offered_item_id or points_offered is provided
  CONSTRAINT valid_swap_offer CHECK (
    (offered_item_id IS NOT NULL) OR (points_offered IS NOT NULL AND points_offered > 0)
  )
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN (
    'swap_request', 'swap_accepted', 'swap_rejected', 'swap_shipped', 
    'swap_completed', 'item_approved', 'item_rejected', 'points_earned',
    'points_spent', 'new_message', 'system_announcement'
  )),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  related_id UUID, -- Generic foreign key for related items/swaps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_points_history table for tracking point transactions
CREATE TABLE IF NOT EXISTS user_points_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  points_change INTEGER NOT NULL, -- Can be positive or negative
  reason VARCHAR(100) NOT NULL,
  related_item_id UUID REFERENCES items(id) ON DELETE SET NULL,
  related_swap_id UUID REFERENCES swap_requests(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table for user communication
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  swap_request_id UUID REFERENCES swap_requests(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_favorites table for wishlist functionality
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);

-- Create user_reviews table for rating system
CREATE TABLE IF NOT EXISTS user_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reviewed_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  swap_request_id UUID REFERENCES swap_requests(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(reviewer_id, swap_request_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_items_user_id ON items(user_id);
CREATE INDEX IF NOT EXISTS idx_items_category_id ON items(category_id);
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
CREATE INDEX IF NOT EXISTS idx_items_is_available ON items(is_available);
CREATE INDEX IF NOT EXISTS idx_items_featured ON items(featured);
CREATE INDEX IF NOT EXISTS idx_items_created_at ON items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_swap_requests_requester_id ON swap_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_swap_requests_owner_id ON swap_requests(owner_id);
CREATE INDEX IF NOT EXISTS idx_swap_requests_status ON swap_requests(status);
CREATE INDEX IF NOT EXISTS idx_swap_requests_created_at ON swap_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_points_history_user_id ON user_points_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_points_history_created_at ON user_points_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_swap_request_id ON messages(swap_request_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_reviews_reviewed_user_id ON user_reviews(reviewed_user_id);

-- Create full-text search indexes
CREATE INDEX IF NOT EXISTS idx_items_search ON items USING GIN (to_tsvector('english', title || ' ' || description));
CREATE INDEX IF NOT EXISTS idx_items_tags ON items USING GIN (tags);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_swap_requests_updated_at BEFORE UPDATE ON swap_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for points validation
CREATE OR REPLACE FUNCTION validate_points()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.points < 0 THEN
        RAISE EXCEPTION 'Points cannot be negative';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER validate_user_points BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION validate_points();

-- Create trigger for points history tracking
CREATE OR REPLACE FUNCTION track_points_history()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.points IS DISTINCT FROM NEW.points THEN
        INSERT INTO user_points_history (user_id, points_change, reason)
        VALUES (NEW.id, NEW.points - OLD.points, 'Manual adjustment');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER track_user_points_changes AFTER UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION track_points_history();

-- Insert sample categories
INSERT INTO categories (name, slug, description, icon) VALUES
('Tops', 'tops', 'Shirts, t-shirts, blouses, and other upper body clothing', 'shirt'),
('Bottoms', 'bottoms', 'Pants, skirts, shorts, and other lower body clothing', 'pants'),
('Dresses', 'dresses', 'One-piece garments for women', 'dress'),
('Outerwear', 'outerwear', 'Jackets, coats, and other outer layers', 'jacket'),
('Shoes', 'shoes', 'Footwear for all occasions', 'shoe'),
('Accessories', 'accessories', 'Bags, jewelry, scarves, and other accessories', 'bag'),
('Activewear', 'activewear', 'Sports and fitness clothing', 'activity'),
('Formal', 'formal', 'Business and formal occasion wear', 'suit');

-- Insert sample admin user
INSERT INTO users (email, full_name, role, points, bio, location) VALUES
('admin@rewear.com', 'Admin User', 'admin', 1000, 'Platform administrator', 'San Francisco, CA'),
('moderator@rewear.com', 'Moderator User', 'moderator', 500, 'Content moderator', 'New York, NY');

-- Insert sample regular users
INSERT INTO users (email, full_name, points, bio, location) VALUES
('jane@example.com', 'Jane Doe', 150, 'Fashion enthusiast and sustainability advocate', 'Los Angeles, CA'),
('john@example.com', 'John Smith', 200, 'Minimalist wardrobe curator', 'Chicago, IL'),
('sarah@example.com', 'Sarah Johnson', 75, 'Vintage clothing collector', 'Austin, TX'),
('mike@example.com', 'Mike Wilson', 300, 'Streetwear and sneaker enthusiast', 'Miami, FL');

-- Insert sample items
INSERT INTO items (user_id, title, description, category_id, type, size, condition, tags, images, points_value, status, featured) VALUES
((SELECT id FROM users WHERE email = 'admin@rewear.com'), 
 'Vintage Denim Jacket', 
 'Classic blue denim jacket in excellent condition. Perfect for layering and adding a vintage touch to any outfit. Features authentic distressing and comfortable fit.',
 (SELECT id FROM categories WHERE slug = 'outerwear'),
 'Jacket',
 'M',
 'Excellent',
 ARRAY['vintage', 'denim', 'casual', 'layering'],
 ARRAY['/denim-jacket.jpg'],
 75,
 'approved',
 true),
((SELECT id FROM users WHERE email = 'jane@example.com'),
 'Floral Summer Dress',
 'Beautiful floral print dress, perfect for summer occasions. Lightweight and comfortable with adjustable straps and flattering silhouette.',
 (SELECT id FROM categories WHERE slug = 'dresses'),
 'Dress',
 'S',
 'Good',
 ARRAY['floral', 'summer', 'casual', 'occasion'],
 ARRAY['/floral-dress.jpg'],
 60,
 'approved',
 true),
((SELECT id FROM users WHERE email = 'jane@example.com'),
 'Designer Handbag',
 'Authentic designer handbag in mint condition. Rarely used, comes with dust bag and authenticity card. Perfect for special occasions.',
 (SELECT id FROM categories WHERE slug = 'accessories'),
 'Bag',
 'One Size',
 'Excellent',
 ARRAY['designer', 'luxury', 'handbag', 'authentic'],
 ARRAY['/designer-handbag.jpg'],
 120,
 'approved',
 false),
((SELECT id FROM users WHERE email = 'john@example.com'),
 'Casual T-Shirt',
 'Comfortable cotton t-shirt in great condition. Perfect for everyday wear, soft fabric and relaxed fit.',
 (SELECT id FROM categories WHERE slug = 'tops'),
 'T-Shirt',
 'L',
 'Good',
 ARRAY['casual', 'cotton', 'comfortable', 'everyday'],
 ARRAY['/casual-tshirt.jpg'],
 30,
 'approved',
 false),
((SELECT id FROM users WHERE email = 'sarah@example.com'),
 'Vintage Silk Blouse',
 'Elegant vintage silk blouse with intricate embroidery. Perfect for professional settings or special occasions.',
 (SELECT id FROM categories WHERE slug = 'tops'),
 'Blouse',
 'M',
 'Good',
 ARRAY['vintage', 'silk', 'elegant', 'professional'],
 ARRAY['/placeholder.jpg'],
 85,
 'approved',
 true),
((SELECT id FROM users WHERE email = 'mike@example.com'),
 'Limited Edition Sneakers',
 'Rare limited edition sneakers in excellent condition. Only worn a few times, comes with original box and laces.',
 (SELECT id FROM categories WHERE slug = 'shoes'),
 'Sneakers',
 '10',
 'Excellent',
 ARRAY['limited', 'sneakers', 'rare', 'collector'],
 ARRAY['/placeholder.jpg'],
 150,
 'approved',
 true);

-- Insert sample swap requests
INSERT INTO swap_requests (requester_id, owner_id, requested_item_id, offered_item_id, swap_type, status, message) VALUES
((SELECT id FROM users WHERE email = 'jane@example.com'),
 (SELECT id FROM users WHERE email = 'admin@rewear.com'),
 (SELECT id FROM items WHERE title = 'Vintage Denim Jacket'),
 (SELECT id FROM items WHERE title = 'Floral Summer Dress'),
 'direct',
 'pending',
 'Hi! I''d love to swap my floral dress for your vintage denim jacket. It would be perfect for my style and I think we''d both benefit from this trade!'),
((SELECT id FROM users WHERE email = 'john@example.com'),
 (SELECT id FROM users WHERE email = 'jane@example.com'),
 (SELECT id FROM items WHERE title = 'Designer Handbag'),
 (SELECT id FROM items WHERE title = 'Casual T-Shirt'),
 'direct',
 'accepted',
 'Would you be interested in swapping your designer handbag for my t-shirt? I can add some points to make it more fair if needed.'),
((SELECT id FROM users WHERE email = 'sarah@example.com'),
 (SELECT id FROM users WHERE email = 'mike@example.com'),
 (SELECT id FROM items WHERE title = 'Limited Edition Sneakers'),
 NULL,
 'points',
 'pending',
 'I''m very interested in your sneakers! I can offer 200 points for them. Let me know if you''d like to proceed with this points-based swap.');

-- Insert sample notifications
INSERT INTO notifications (user_id, type, title, message, related_id) VALUES
((SELECT id FROM users WHERE email = 'admin@rewear.com'),
 'swap_request',
 'New Swap Request',
 'Jane Doe wants to swap her Floral Summer Dress for your Vintage Denim Jacket',
 (SELECT id FROM swap_requests WHERE requester_id = (SELECT id FROM users WHERE email = 'jane@example.com') LIMIT 1)),
((SELECT id FROM users WHERE email = 'jane@example.com'),
 'swap_accepted',
 'Swap Accepted',
 'John Smith accepted your swap request for the Designer Handbag',
 (SELECT id FROM swap_requests WHERE requester_id = (SELECT id FROM users WHERE email = 'john@example.com') LIMIT 1)),
((SELECT id FROM users WHERE email = 'mike@example.com'),
 'swap_request',
 'New Swap Request',
 'Sarah Johnson wants to buy your Limited Edition Sneakers for 200 points',
 (SELECT id FROM swap_requests WHERE requester_id = (SELECT id FROM users WHERE email = 'sarah@example.com') LIMIT 1));

-- Insert sample points history
INSERT INTO user_points_history (user_id, points_change, reason, related_item_id) VALUES
((SELECT id FROM users WHERE email = 'jane@example.com'), 60, 'Item listed: Floral Summer Dress', (SELECT id FROM items WHERE title = 'Floral Summer Dress')),
((SELECT id FROM users WHERE email = 'john@example.com'), 30, 'Item listed: Casual T-Shirt', (SELECT id FROM items WHERE title = 'Casual T-Shirt')),
((SELECT id FROM users WHERE email = 'sarah@example.com'), 85, 'Item listed: Vintage Silk Blouse', (SELECT id FROM items WHERE title = 'Vintage Silk Blouse')),
((SELECT id FROM users WHERE email = 'mike@example.com'), 150, 'Item listed: Limited Edition Sneakers', (SELECT id FROM items WHERE title = 'Limited Edition Sneakers'));

-- Create views for common queries
CREATE VIEW available_items AS
SELECT 
  i.*,
  u.full_name as user_name,
  u.avatar_url as user_avatar,
  c.name as category_name,
  c.slug as category_slug
FROM items i
JOIN users u ON i.user_id = u.id
LEFT JOIN categories c ON i.category_id = c.id
WHERE i.status = 'approved' AND i.is_available = true;

CREATE VIEW swap_requests_with_details AS
SELECT 
  sr.*,
  requester.full_name as requester_name,
  requester.avatar_url as requester_avatar,
  owner.full_name as owner_name,
  owner.avatar_url as owner_avatar,
  requested_item.title as requested_item_title,
  requested_item.images as requested_item_images,
  offered_item.title as offered_item_title,
  offered_item.images as offered_item_images
FROM swap_requests sr
JOIN users requester ON sr.requester_id = requester.id
JOIN users owner ON sr.owner_id = owner.id
JOIN items requested_item ON sr.requested_item_id = requested_item.id
LEFT JOIN items offered_item ON sr.offered_item_id = offered_item.id;

-- Create RLS (Row Level Security) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE swap_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reviews ENABLE ROW LEVEL SECURITY;

-- Users can read their own data and public user profiles
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can view public profiles" ON users FOR SELECT USING (true);

-- Items policies
CREATE POLICY "Users can view all approved items" ON items FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can create items" ON items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own items" ON items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own items" ON items FOR DELETE USING (auth.uid() = user_id);

-- Swap requests policies
CREATE POLICY "Users can view related swap requests" ON swap_requests FOR SELECT 
USING (auth.uid() = requester_id OR auth.uid() = owner_id);
CREATE POLICY "Users can create swap requests" ON swap_requests FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Users can update related swap requests" ON swap_requests FOR UPDATE 
USING (auth.uid() = requester_id OR auth.uid() = owner_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view related messages" ON messages FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update own messages" ON messages FOR UPDATE USING (auth.uid() = sender_id);

-- User favorites policies
CREATE POLICY "Users can view own favorites" ON user_favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own favorites" ON user_favorites FOR ALL USING (auth.uid() = user_id);

-- User reviews policies
CREATE POLICY "Users can view all reviews" ON user_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON user_reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Users can update own reviews" ON user_reviews FOR UPDATE USING (auth.uid() = reviewer_id);
