# ReWear - Community Clothing Exchange

A sustainable fashion platform that enables users to swap clothing items and redeem points for new pieces, promoting circular fashion and reducing textile waste.

## Features

- **Clothing Swaps**: Direct item-to-item exchanges between users
- **Points System**: Earn and spend points for clothing items
- **User Profiles**: Personalized profiles with bio, location, and avatar
- **Categories**: Organized clothing categories (tops, bottoms, dresses, etc.)
- **Search & Filter**: Find items by category, condition, size, and tags
- **Messaging**: In-app messaging for swap negotiations
- **Notifications**: Real-time notifications for swap requests and updates
- **Reviews**: User rating and review system
- **Favorites**: Save items to wishlist
- **Admin Panel**: Content moderation and user management

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage (for images)
- **Deployment**: Vercel (recommended)

## Database Schema

### Core Tables

1. **users** - User profiles and authentication
2. **categories** - Clothing categories (tops, bottoms, dresses, etc.)
3. **items** - Clothing items available for swap
4. **swap_requests** - Swap transactions between users
5. **notifications** - User notifications
6. **messages** - In-app messaging
7. **user_favorites** - User wishlists
8. **user_reviews** - User rating system
9. **user_points_history** - Points transaction tracking

### Key Features

- **Row Level Security (RLS)** - Secure data access
- **Full-text Search** - Search items by title and description
- **Automatic Timestamps** - Created/updated tracking
- **Data Validation** - Check constraints and triggers
- **Performance Indexes** - Optimized queries
- **Views** - Common query abstractions

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Supabase account

### 1. Clone the Repository

```bash
git clone <repository-url>
cd nextgen-product-page
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Copy the environment variables:

```bash
cp env.example .env.local
```

4. Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Set Up Database

1. Install Supabase CLI:

```bash
npm install -g @supabase/cli
```

2. Initialize Supabase (optional, for local development):

```bash
supabase init
```

3. Run the database schema:

```bash
# Option 1: Run via Supabase Dashboard SQL Editor
# Copy and paste the contents of scripts/01-create-tables.sql

# Option 2: Use Supabase CLI (if you have it set up)
supabase db push
```

4. Seed the database with sample data:

```bash
# Copy and paste the contents of scripts/02-seed-data.sql
# into the Supabase Dashboard SQL Editor
```

### 5. Generate TypeScript Types

```bash
npm run db:generate
```

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Setup Details

### Tables Overview

#### users
- User profiles with points system
- Role-based access (user, admin, moderator)
- Location and bio information

#### items
- Clothing items with detailed metadata
- Status tracking (pending, approved, rejected, sold)
- Points value and availability flags
- Full-text search capabilities

#### swap_requests
- Swap transactions between users
- Support for direct swaps, points-based swaps, and mixed swaps
- Shipping and tracking information
- Status tracking throughout the swap process

#### notifications
- Real-time user notifications
- Multiple notification types
- Read/unread status tracking

#### messages
- In-app messaging system
- Linked to swap requests
- Read status tracking

### Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Policy-based access control** for data protection
- **Input validation** with check constraints
- **Automatic audit trails** for points transactions

### Performance Optimizations

- **Database indexes** on frequently queried columns
- **Full-text search indexes** for item discovery
- **Views** for common query patterns
- **Efficient joins** with proper foreign key relationships

## API Routes

The application includes several API routes for database operations:

- `/api/items` - Item management (GET, POST)
- `/api/items/[id]` - Individual item operations (GET, PUT, DELETE)
- `/api/swap/request` - Create swap requests
- `/api/swap/[id]/accept` - Accept swap requests
- `/api/swap/[id]/reject` - Reject swap requests
- `/api/swap/[id]/shipping` - Update shipping information
- `/api/user/[id]/listings` - User's listed items

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | No |
| `NEXTAUTH_SECRET` | NextAuth secret | No |
| `NEXTAUTH_URL` | NextAuth URL | No |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

## Roadmap

- [ ] Real-time messaging with WebSockets
- [ ] Image upload and management
- [ ] Advanced search filters
- [ ] Mobile app development
- [ ] Integration with shipping providers
- [ ] Analytics dashboard
- [ ] Social features (following, sharing)
- [ ] Sustainability impact tracking 