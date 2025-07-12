-- Create users table with authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  points INTEGER DEFAULT 100,
  role VARCHAR(20) DEFAULT 'user',
  avatar_url TEXT,
  bio TEXT,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  type VARCHAR(100),
  size VARCHAR(20),
  condition VARCHAR(50),
  tags TEXT[],
  images TEXT[],
  points_value INTEGER DEFAULT 50,
  status VARCHAR(20) DEFAULT 'pending',
  is_available BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create swaps table
CREATE TABLE IF NOT EXISTS swaps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES users(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  offered_item_id UUID REFERENCES items(id) ON DELETE SET NULL,
  swap_type VARCHAR(20) NOT NULL, -- 'direct' or 'points'
  points_offered INTEGER,
  status VARCHAR(20) DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample categories
INSERT INTO categories (name, slug) VALUES
('Tops', 'tops'),
('Bottoms', 'bottoms'),
('Dresses', 'dresses'),
('Outerwear', 'outerwear'),
('Shoes', 'shoes'),
('Accessories', 'accessories');

-- Insert sample admin user
INSERT INTO users (email, password_hash, full_name, role, points) VALUES
('admin@rewear.com', '$2a$10$example_hash', 'Admin User', 'admin', 1000);

-- Insert sample items
INSERT INTO items (user_id, title, description, category_id, type, size, condition, tags, images, points_value, status, featured) VALUES
((SELECT id FROM users WHERE email = 'admin@rewear.com'), 
 'Vintage Denim Jacket', 
 'Classic blue denim jacket in excellent condition. Perfect for layering.',
 (SELECT id FROM categories WHERE slug = 'outerwear'),
 'Jacket',
 'M',
 'Excellent',
 ARRAY['vintage', 'denim', 'casual'],
 ARRAY['/placeholder.svg?height=400&width=400'],
 75,
 'approved',
 true),
((SELECT id FROM users WHERE email = 'admin@rewear.com'),
 'Floral Summer Dress',
 'Beautiful floral print dress, perfect for summer occasions.',
 (SELECT id FROM categories WHERE slug = 'dresses'),
 'Dress',
 'S',
 'Good',
 ARRAY['floral', 'summer', 'casual'],
 ARRAY['/placeholder.svg?height=400&width=400'],
 60,
 'approved',
 true);
