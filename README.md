# ReWear - Community Clothing Exchange Platform

A modern, sustainable clothing exchange platform built with Next.js 14, TypeScript, and Tailwind CSS. ReWear enables users to swap clothing items with other community members, promoting sustainable fashion and reducing textile waste.

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure login/signup system with localStorage persistence
- **Item Management**: Add, edit, and manage your clothing items
- **Browse & Search**: Discover items from other users with advanced filtering
- **Swap Requests**: Send and manage clothing swap requests
- **Real-time Notifications**: Stay updated on swap requests and messages
- **User Profiles**: View user profiles and their item collections
- **Favorites System**: Save items you're interested in
- **Review System**: Rate and review completed swaps

### Technical Features
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark/Light Mode**: Toggle between themes
- **Local Storage**: No external database required - data persists in browser
- **TypeScript**: Full type safety throughout the application
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nextgen-product-page
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 👥 Sample Account Details

### Test Users (Ready to Use)

#### User 1: Kathan
- **Email**: kathan@example.com (admin account) route on website : /admin 
- **Note**: That the branch side contains a more immersive admin side 
- **Password**: password123
- **Location**: Mumbai, India
- **Items**: 5 clothing items available for swap

#### User 2: Priyansh
- **Email**: priyansh@example.com
- **Password**: password123
- **Location**: Delhi, India
- **Items**: 3 clothing items available for swap

#### User 3: Prabhakar
- **Email**: prabhakar@example.com
- **Password**: password123
- **Location**: Bangalore, India
- **Items**: 4 clothing items available for swap

#### User 4: Anjali
- **Email**: anjali@example.com
- **Password**: password123
- **Location**: Chennai, India
- **Items**: 6 clothing items available for swap

### Sample Items Available
- Designer handbags
- Casual t-shirts
- Denim jackets
- Floral dresses
- Hoodies
- And more...

## 📱 How to Use

### Getting Started
1. **Sign Up/Login**: Use one of the sample accounts above or create your own
2. **Browse Items**: Visit the Browse page to see available items
3. **Add Your Items**: Click "Add Item" to list your clothing for swap
4. **Send Swap Requests**: Click on items you like to request a swap
5. **Manage Requests**: Check your Requests page to accept/reject incoming swaps

### Key Pages

#### Home Page (`/`)
- Landing page with hero section
- Featured items showcase
- Quick navigation to main features

#### Browse (`/browse`)
- View all available items
- Filter by category, size, condition
- Search functionality
- Add new items

#### Dashboard (`/dashboard`)
- Your profile overview
- Your listed items
- Recent activity
- Quick actions

#### Requests (`/requests`)
- Incoming swap requests
- Outgoing swap requests
- Accept/reject functionality
- Request status tracking

#### Item Details (`/items/[id]`)
- Detailed item information
- User profile
- Swap request button
- Item images and description

## 🛠️ Technical Architecture

### Frontend Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context (Auth)
- **Data Persistence**: localStorage

### Project Structure
```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── browse/            # Browse items page
│   ├── dashboard/         # User dashboard
│   ├── items/             # Item detail pages
│   ├── requests/          # Swap requests page
│   └── ...
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── header.tsx        # Navigation header
│   └── item-card.tsx     # Item display card
├── contexts/             # React contexts
├── lib/                  # Utility functions
│   ├── database.ts       # localStorage database
│   ├── auth.ts          # Authentication utilities
│   └── utils.ts         # General utilities
└── public/              # Static assets
```

### Data Models

#### User
```typescript
{
  id: string
  name: string
  email: string
  password: string
  avatar_url: string
  location: string
  bio: string
  points: number
  created_at: string
}
```

#### Item
```typescript
{
  id: string
  title: string
  description: string
  category: string
  size: string
  condition: string
  image_url: string
  user_id: string
  points: number
  created_at: string
}
```

#### SwapRequest
```typescript
{
  id: string
  requester_id: string
  item_id: string
  status: 'pending' | 'accepted' | 'rejected'
  message: string
  created_at: string
  updated_at: string
}
```

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Adding New Features
1. Create new pages in `app/` directory
2. Add API routes in `app/api/` for backend functionality
3. Create reusable components in `components/`
4. Update database functions in `lib/database.ts` if needed

### Styling Guidelines
- Use Tailwind CSS classes for styling
- Follow shadcn/ui component patterns
- Maintain consistent spacing and typography
- Ensure responsive design for all components

## 🌍 Environmental Impact

ReWear promotes sustainable fashion by:
- **Reducing Textile Waste**: Extending the life of clothing items
- **Promoting Circular Economy**: Encouraging item reuse and sharing
- **Building Community**: Connecting people through sustainable practices
- **Raising Awareness**: Educating users about sustainable fashion choices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the browser console for error messages
2. Ensure you're using a supported browser (Chrome, Firefox, Safari, Edge)
3. Clear localStorage if data becomes corrupted
4. Create an issue in the repository

## 🎯 Roadmap

### Planned Features
- [ ] Real-time messaging between users
- [ ] Image upload functionality
- [ ] Advanced search filters
- [ ] User verification system
- [ ] Mobile app version
- [ ] Integration with external databases
- [ ] Payment system for premium features
- [ ] Social media sharing
- [ ] Item recommendations
- [ ] Community forums

---

**Built with ❤️ for a sustainable future** 