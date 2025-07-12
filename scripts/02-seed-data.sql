-- Seed data for ReWear application
-- This script adds more comprehensive sample data for testing

-- Insert additional users
INSERT INTO users (email, full_name, points, bio, location, avatar_url) VALUES
('kathan@example.com', 'Kathan Somani', 250, 'Sustainable fashion advocate and vintage lover', 'Surat, India', '/placeholder-user.jpg'),
('priyansh@example.com', 'Priyansh Rokade', 180, 'Minimalist lifestyle enthusiast', 'Mumbai, India', '/placeholder-user.jpg'),
('rohan@example.com', 'Rohan Sharma', 95, 'Streetwear collector and sneakerhead', 'Mumbai, India', '/placeholder-user.jpg'),
('aarav@example.com', 'Aarav Patel', 400, 'Luxury fashion reseller and vintage curator', 'Surat, India', '/placeholder-user.jpg'),
('aarav@example.com', 'Aarav Patel', 150, 'Eco-conscious fashion designer', 'Surat, India', '/placeholder-user.jpg');

-- Insert additional items
INSERT INTO items (user_id, title, description, category_id, type, size, condition, tags, images, points_value, status, featured) VALUES
-- Emma's items
((SELECT id FROM users WHERE email = 'kathan@example.com'),
 'Vintage 90s Denim Skirt',
 'Authentic 90s high-waisted denim skirt with perfect distressing. Great for creating retro looks.',
 (SELECT id FROM categories WHERE slug = 'bottoms'),
 'Skirt',
 'M',
 'Good',
 ARRAY['vintage', '90s', 'denim', 'retro', 'high-waisted'],
 ARRAY['/placeholder.jpg'],
 45,
 'approved',
 false),

((SELECT id FROM users WHERE email = 'kathan@example.com'),
 'Handmade Crochet Cardigan',
 'Beautiful handmade crochet cardigan in soft cream color. Perfect for layering in any season.',
 (SELECT id FROM categories WHERE slug = 'outerwear'),
 'Cardigan',
 'L',
 'Excellent',
 ARRAY['handmade', 'crochet', 'cream', 'layering', 'artisan'],
 ARRAY['/placeholder.jpg'],
 80,
 'approved',
 true),

-- David's items
((SELECT id FROM users WHERE email = 'priyansh@example.com'),
 'Minimalist White Sneakers',
 'Clean white sneakers in excellent condition. Perfect for everyday wear and goes with everything.',
 (SELECT id FROM categories WHERE slug = 'shoes'),
 'Sneakers',
 '9',
 'Excellent',
 ARRAY['minimalist', 'white', 'sneakers', 'clean', 'versatile'],
 ARRAY['/placeholder.jpg'],
 65,
 'approved',
 false),

((SELECT id FROM users WHERE email = 'priyansh@example.com'),
 'Organic Cotton T-Shirt',
 'High-quality organic cotton t-shirt in navy blue. Soft, comfortable, and sustainably made.',
 (SELECT id FROM categories WHERE slug = 'tops'),
 'T-Shirt',
 'M',
 'Like New',
 ARRAY['organic', 'cotton', 'sustainable', 'navy', 'comfortable'],
 ARRAY['/placeholder.jpg'],
 35,
 'approved',
 false),

-- Lisa's items
((SELECT id FROM users WHERE email = 'prabhakar@example.com'),
 'Designer Silk Blouse',
 'Elegant designer silk blouse in emerald green. Perfect for professional settings and special occasions.',
 (SELECT id FROM categories WHERE slug = 'tops'),
 'Blouse',
 'S',
 'Excellent',
 ARRAY['designer', 'silk', 'emerald', 'elegant', 'professional'],
 ARRAY['/placeholder.jpg'],
 95,
 'approved',
 true),

((SELECT id FROM users WHERE email = 'prabhakar@example.com'),
 'Statement Jewelry Set',
 'Beautiful statement jewelry set with matching necklace and earrings. Perfect for dressing up any outfit.',
 (SELECT id FROM categories WHERE slug = 'accessories'),
 'Jewelry',
 'One Size',
 'Excellent',
 ARRAY['statement', 'jewelry', 'necklace', 'earrings', 'elegant'],
 ARRAY['/placeholder.jpg'],
 70,
 'approved',
 false),

-- Marcus's items
((SELECT id FROM users WHERE email = 'rohan@example.com'),
 'Limited Edition Hoodie',
 'Rare limited edition hoodie from a popular streetwear brand. Only 100 pieces made worldwide.',
 (SELECT id FROM categories WHERE slug = 'tops'),
 'Hoodie',
 'L',
 'Excellent',
 ARRAY['limited', 'streetwear', 'rare', 'collector', 'exclusive'],
 ARRAY['/placeholder.jpg'],
 120,
 'approved',
 true),

((SELECT id FROM users WHERE email = 'rohan@example.com'),
 'Vintage Basketball Jersey',
 'Authentic vintage basketball jersey from the 80s. Great condition with original team colors.',
 (SELECT id FROM categories WHERE slug = 'tops'),
 'Jersey',
 'XL',
 'Good',
 ARRAY['vintage', 'basketball', '80s', 'sports', 'authentic'],
 ARRAY['/placeholder.jpg'],
 55,
 'approved',
 false),

-- Sophia's items
((SELECT id FROM users WHERE email = 'aarav@example.com'),
 'Designer Leather Jacket',
 'Authentic designer leather jacket in black. Timeless piece that never goes out of style.',
 (SELECT id FROM categories WHERE slug = 'outerwear'),
 'Jacket',
 'M',
 'Excellent',
 ARRAY['designer', 'leather', 'black', 'timeless', 'luxury'],
 ARRAY['/placeholder.jpg'],
 180,
 'approved',
 true),

((SELECT id FROM users WHERE email = 'aarav@example.com'),
 'Vintage Evening Gown',
 'Stunning vintage evening gown from the 60s. Perfect for formal events and special occasions.',
 (SELECT id FROM categories WHERE slug = 'dresses'),
 'Gown',
 'S',
 'Good',
 ARRAY['vintage', 'evening', '60s', 'formal', 'elegant'],
 ARRAY['/placeholder.jpg'],
 200,
 'approved',
 true),

-- Alex's items
((SELECT id FROM users WHERE email = 'aarav@example.com'),
 'Handmade Sustainable Dress',
 'Beautiful handmade dress made from sustainable materials. Unique design and eco-friendly.',
 (SELECT id FROM categories WHERE slug = 'dresses'),
 'Dress',
 'M',
 'New',
 ARRAY['handmade', 'sustainable', 'unique', 'eco-friendly', 'artisan'],
 ARRAY['/placeholder.jpg'],
 110,
 'approved',
 true),

((SELECT id FROM users WHERE email = 'aarav@example.com'),
 'Upcycled Denim Bag',
 'Creative upcycled denim bag made from repurposed materials. Functional and environmentally conscious.',
 (SELECT id FROM categories WHERE slug = 'accessories'),
 'Bag',
 'One Size',
 'Excellent',
 ARRAY['upcycled', 'denim', 'repurposed', 'eco-friendly', 'creative'],
 ARRAY['/placeholder.jpg'],
 60,
 'approved',
 false);

-- Insert additional swap requests
INSERT INTO swap_requests (requester_id, owner_id, requested_item_id, offered_item_id, swap_type, status, message) VALUES
-- Emma wants David's sneakers for her cardigan
((SELECT id FROM users WHERE email = 'kathan@example.com'),
 (SELECT id FROM users WHERE email = 'priyansh@example.com'),
 (SELECT id FROM items WHERE title = 'Minimalist White Sneakers'),
 (SELECT id FROM items WHERE title = 'Handmade Crochet Cardigan'),
 'direct',
 'pending',
 'Hi David! I love your minimalist sneakers and would love to swap them for my handmade crochet cardigan. I think it would be a great trade for both of us!'),

-- Lisa wants Sophia's leather jacket for points
((SELECT id FROM users WHERE email = 'prabhakar@example.com'),
 (SELECT id FROM users WHERE email = 'aarav@example.com'),
 (SELECT id FROM items WHERE title = 'Designer Leather Jacket'),
 NULL,
 'points',
 'pending',
 'Hi Sophia! I''m very interested in your leather jacket. I can offer 250 points for it. Let me know if you''d like to proceed!'),

-- Marcus wants Alex's sustainable dress for his hoodie
((SELECT id FROM users WHERE email = 'rohan@example.com'),
 (SELECT id FROM users WHERE email = 'aarav@example.com'),
 (SELECT id FROM items WHERE title = 'Handmade Sustainable Dress'),
 (SELECT id FROM items WHERE title = 'Limited Edition Hoodie'),
 'direct',
 'accepted',
 'Hey Alex! I love your sustainable dress and would love to swap it for my limited edition hoodie. I think it would be a great trade!'),

-- David wants Emma's vintage skirt for his t-shirt + points
((SELECT id FROM users WHERE email = 'priyansh@example.com'),
 (SELECT id FROM users WHERE email = 'kathan@example.com'),
 (SELECT id FROM items WHERE title = 'Vintage 90s Denim Skirt'),
 (SELECT id FROM items WHERE title = 'Organic Cotton T-Shirt'),
 'mixed',
 'pending',
 'Hi Emma! I''d love your vintage skirt and can offer my organic cotton t-shirt plus 30 points to make it fair. What do you think?');

-- Insert additional notifications
INSERT INTO notifications (user_id, type, title, message, related_id) VALUES
-- Swap request notifications
((SELECT id FROM users WHERE email = 'priyansh@example.com'),
 'swap_request',
 'New Swap Request',
 'Emma Rodriguez wants to swap her Handmade Crochet Cardigan for your Minimalist White Sneakers',
 (SELECT id FROM swap_requests WHERE requester_id = (SELECT id FROM users WHERE email = 'kathan@example.com') AND requested_item_id = (SELECT id FROM items WHERE title = 'Minimalist White Sneakers'))),

((SELECT id FROM users WHERE email = 'aarav@example.com'),
 'swap_request',
 'New Swap Request',
 'Lisa Thompson wants to buy your Designer Leather Jacket for 250 points',
 (SELECT id FROM swap_requests WHERE requester_id = (SELECT id FROM users WHERE email = 'prabhakar@example.com') AND requested_item_id = (SELECT id FROM items WHERE title = 'Designer Leather Jacket'))),

((SELECT id FROM users WHERE email = 'aarav@example.com'),
 'swap_accepted',
 'Swap Accepted',
 'Marcus Johnson accepted your swap request for the Handmade Sustainable Dress',
 (SELECT id FROM swap_requests WHERE requester_id = (SELECT id FROM users WHERE email = 'rohan@example.com') AND requested_item_id = (SELECT id FROM items WHERE title = 'Handmade Sustainable Dress'))),

-- Item approval notifications
((SELECT id FROM users WHERE email = 'kathan@example.com'),
 'item_approved',
 'Item Approved',
 'Your Vintage 90s Denim Skirt has been approved and is now live on the platform',
 (SELECT id FROM items WHERE title = 'Vintage 90s Denim Skirt')),

((SELECT id FROM users WHERE email = 'priyansh@example.com'),
 'item_approved',
 'Item Approved',
 'Your Organic Cotton T-Shirt has been approved and is now live on the platform',
 (SELECT id FROM items WHERE title = 'Organic Cotton T-Shirt')),

-- Points earned notifications
((SELECT id FROM users WHERE email = 'aarav@example.com'),
 'points_earned',
 'Points Earned',
 'You earned 180 points for listing your Designer Leather Jacket',
 (SELECT id FROM items WHERE title = 'Designer Leather Jacket')),

((SELECT id FROM users WHERE email = 'aarav@example.com'),
 'points_earned',
 'Points Earned',
 'You earned 110 points for listing your Handmade Sustainable Dress',
 (SELECT id FROM items WHERE title = 'Handmade Sustainable Dress'));

-- Insert additional points history
INSERT INTO user_points_history (user_id, points_change, reason, related_item_id) VALUES
-- Points earned from listing items
((SELECT id FROM users WHERE email = 'kathan@example.com'), 45, 'Item listed: Vintage 90s Denim Skirt', (SELECT id FROM items WHERE title = 'Vintage 90s Denim Skirt')),
((SELECT id FROM users WHERE email = 'kathan@example.com'), 80, 'Item listed: Handmade Crochet Cardigan', (SELECT id FROM items WHERE title = 'Handmade Crochet Cardigan')),
((SELECT id FROM users WHERE email = 'priyansh@example.com'), 65, 'Item listed: Minimalist White Sneakers', (SELECT id FROM items WHERE title = 'Minimalist White Sneakers')),
((SELECT id FROM users WHERE email = 'priyansh@example.com'), 35, 'Item listed: Organic Cotton T-Shirt', (SELECT id FROM items WHERE title = 'Organic Cotton T-Shirt')),
((SELECT id FROM users WHERE email = 'prabhakar@example.com'), 95, 'Item listed: Designer Silk Blouse', (SELECT id FROM items WHERE title = 'Designer Silk Blouse')),
((SELECT id FROM users WHERE email = 'prabhakar@example.com'), 70, 'Item listed: Statement Jewelry Set', (SELECT id FROM items WHERE title = 'Statement Jewelry Set')),
((SELECT id FROM users WHERE email = 'rohan@example.com'), 120, 'Item listed: Limited Edition Hoodie', (SELECT id FROM items WHERE title = 'Limited Edition Hoodie')),
((SELECT id FROM users WHERE email = 'rohan@example.com'), 55, 'Item listed: Vintage Basketball Jersey', (SELECT id FROM items WHERE title = 'Vintage Basketball Jersey')),
((SELECT id FROM users WHERE email = 'aarav@example.com'), 180, 'Item listed: Designer Leather Jacket', (SELECT id FROM items WHERE title = 'Designer Leather Jacket')),
((SELECT id FROM users WHERE email = 'aarav@example.com'), 200, 'Item listed: Vintage Evening Gown', (SELECT id FROM items WHERE title = 'Vintage Evening Gown')),
((SELECT id FROM users WHERE email = 'aarav@example.com'), 110, 'Item listed: Handmade Sustainable Dress', (SELECT id FROM items WHERE title = 'Handmade Sustainable Dress')),
((SELECT id FROM users WHERE email = 'aarav@example.com'), 60, 'Item listed: Upcycled Denim Bag', (SELECT id FROM items WHERE title = 'Upcycled Denim Bag'));

-- Insert sample messages
INSERT INTO messages (sender_id, receiver_id, swap_request_id, content) VALUES
-- Messages for Emma-David swap
((SELECT id FROM users WHERE email = 'kathan@example.com'),
 (SELECT id FROM users WHERE email = 'priyansh@example.com'),
 (SELECT id FROM swap_requests WHERE requester_id = (SELECT id FROM users WHERE email = 'kathan@example.com') AND requested_item_id = (
 'Hi David! I love your minimalist sneakers and would love to swap them for my handmade crochet cardigan. I think it would be a great trade for both of us!'),

((SELECT id FROM users WHERE email = 'priyansh@example.com'),
 (SELECT id FROM users WHERE email = 'kathan@example.com'),
 (SELECT id FROM swap_requests WHERE requester_id = (SELECT id FROM users WHERE email = 'priyansh@example.com') AND requested_item_id = (SELECT id FROM items WHERE title = 'Minimalist White Sneakers')),
 'Hi Emma! Thanks for the offer. Your cardigan looks beautiful! I''d love to see more photos of it if possible.'),

-- Messages for Lisa-Sophia swap
((SELECT id FROM users WHERE email = 'prabhakar@example.com'),
 (SELECT id FROM users WHERE email = 'aarav@example.com'),
 (SELECT id FROM swap_requests WHERE requester_id = (SELECT id FROM users WHERE email = 'prabhakar@example.com') AND requested_item_id = (SELECT id FROM items WHERE title = 'Designer Leather Jacket')),
 'Hi Sophia! I''m very interested in your leather jacket. I can offer 250 points for it. Let me know if you''d like to proceed!'),

-- Messages for Marcus-Alex swap
((SELECT id FROM users WHERE email = 'rohan@example.com'),
 (SELECT id FROM users WHERE email = 'aarav@example.com'),
 (SELECT id FROM swap_requests WHERE requester_id = (SELECT id FROM users WHERE email = 'rohan@example.com') AND requested_item_id = (SELECT id FROM items WHERE title = 'Handmade Sustainable Dress')),
 'Hey Alex! I love your sustainable dress and would love to swap it for my limited edition hoodie. I think it would be a great trade!'),

((SELECT id FROM users WHERE email = 'aarav@example.com'),
 (SELECT id FROM users WHERE email = 'rohan@example.com'),
 (SELECT id FROM swap_requests WHERE requester_id = (SELECT id FROM users WHERE email = 'rohan@example.com') AND requested_item_id = (SELECT id FROM items WHERE title = 'Handmade Sustainable Dress')),
 'Hi Marcus! That sounds like a great trade! I love your hoodie and would be happy to swap. When would you like to arrange the exchange?');

-- Insert sample user favorites
INSERT INTO user_favorites (user_id, item_id) VALUES
-- Emma's favorites
((SELECT id FROM users WHERE email = 'kathan@example.com'),
 (SELECT id FROM items WHERE title = 'Designer Leather Jacket')),

-- David's favorites
((SELECT id FROM users WHERE email = 'priyansh@example.com'),
 (SELECT id FROM items WHERE title = 'Vintage 90s Denim Skirt')),
((SELECT id FROM users WHERE email = 'priyansh@example.com'),
 (SELECT id FROM items WHERE title = 'Handmade Crochet Cardigan')),

-- Lisa's favorites
((SELECT id FROM users WHERE email = 'prabhakar@example.com'),
 (SELECT id FROM items WHERE title = 'Designer Leather Jacket')),
((SELECT id FROM users WHERE email = 'prabhakar@example.com'),
 (SELECT id FROM items WHERE title = 'Vintage Evening Gown')),

-- Marcus's favorites
((SELECT id FROM users WHERE email = 'rohan@example.com'),
 (SELECT id FROM items WHERE title = 'Handmade Sustainable Dress')),
((SELECT id FROM users WHERE email = 'rohan@example.com'),
 (SELECT id FROM items WHERE title = 'Limited Edition Sneakers'));

-- Insert sample user reviews
INSERT INTO user_reviews (reviewer_id, reviewed_user_id, swap_request_id, rating, comment) VALUES
-- Review from Alex to Marcus (completed swap)
((SELECT id FROM users WHERE email = 'aarav@example.com'),
 (SELECT id FROM users WHERE email = 'rohan@example.com'),
 (SELECT id FROM swap_requests WHERE requester_id = (SELECT id FROM users WHERE email = 'rohan@example.com') AND requested_item_id = (SELECT id FROM items WHERE title = 'Handmade Sustainable Dress')),
 5,
 'Great swap experience! Marcus was very communicative and the hoodie arrived in perfect condition. Highly recommend!'),

-- Review from Marcus to Alex (completed swap)
((SELECT id FROM users WHERE email = 'rohan@example.com'),
 (SELECT id FROM users WHERE email = 'aarav@example.com'),
 (SELECT id FROM swap_requests WHERE requester_id = (SELECT id FROM users WHERE email = 'aarav@example.com') AND requested_item_id = (SELECT id FROM items WHERE title = 'Handmade Sustainable Dress')),
 5,
 'Amazing experience! Alex''s sustainable dress is even more beautiful in person. Fast shipping and great communication.');

-- Update some items to have more realistic view counts
UPDATE items SET views_count = FLOOR(RANDOM() * 100) + 10 WHERE status = 'approved';

-- Update some notifications to be read
UPDATE notifications SET read = true WHERE id IN (
  SELECT id FROM notifications ORDER BY created_at DESC LIMIT 5
); 