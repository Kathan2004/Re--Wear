export interface Item {
  id: string
  user_id: string
  title: string
  description: string
  category_id: string
  type: string
  size: string
  condition: string
  tags: string[]
  images: string[]
  points_value: number
  status: "pending" | "approved" | "rejected"
  is_available: boolean
  featured: boolean
  created_at: string
  updated_at: string
  user?: {
    full_name: string
    avatar_url?: string
  }
  category?: {
    name: string
  }
}

export interface SwapRequest {
  id: string
  requester_id: string
  owner_id: string
  requested_item_id: string
  offered_item_id: string
  status: "pending" | "accepted" | "rejected" | "completed" | "shipped"
  message?: string
  shipping_method?: "pickup" | "courier"
  shipping_address?: string
  tracking_number?: string
  created_at: string
  updated_at: string
  requester?: {
    id: string
    full_name: string
    avatar_url?: string
    email: string
  }
  owner?: {
    id: string
    full_name: string
    avatar_url?: string
    email: string
  }
  requested_item?: Item
  offered_item?: Item
}

export interface Notification {
  id: string
  user_id: string
  type: "swap_request" | "swap_accepted" | "swap_rejected" | "swap_shipped" | "swap_completed"
  title: string
  message: string
  read: boolean
  related_id?: string
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
}

// Mock database functions (in a real app, these would connect to Supabase)
export const mockUsers: any[] = [
  {
    id: "1",
    email: "admin@rewear.com",
    full_name: "Admin User",
    points: 1000,
    role: "admin",
    avatar_url: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    email: "user@example.com",
    full_name: "Jane Doe",
    points: 150,
    role: "user",
    avatar_url: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    email: "john@example.com",
    full_name: "John Smith",
    points: 200,
    role: "user",
    avatar_url: "/placeholder.svg?height=40&width=40",
  },
]

export const mockCategories: Category[] = [
  { id: "1", name: "Tops", slug: "tops" },
  { id: "2", name: "Bottoms", slug: "bottoms" },
  { id: "3", name: "Dresses", slug: "dresses" },
  { id: "4", name: "Outerwear", slug: "outerwear" },
  { id: "5", name: "Shoes", slug: "shoes" },
  { id: "6", name: "Accessories", slug: "accessories" },
]

export const mockItems: Item[] = [
  {
    id: "1",
    user_id: "1",
    title: "Vintage Denim Jacket",
    description:
      "Classic blue denim jacket in excellent condition. Perfect for layering and adding a vintage touch to any outfit.",
    category_id: "4",
    type: "Jacket",
    size: "M",
    condition: "Excellent",
    tags: ["vintage", "denim", "casual"],
    images: ["/denim-jacket.jpg"],
    points_value: 75,
    status: "approved",
    is_available: true,
    featured: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    user: { full_name: "Admin User", avatar_url: "/placeholder.svg?height=40&width=40" },
    category: { name: "Outerwear" },
  },
  {
    id: "2",
    user_id: "2",
    title: "Floral Summer Dress",
    description: "Beautiful floral print dress, perfect for summer occasions. Lightweight and comfortable.",
    category_id: "3",
    type: "Dress",
    size: "S",
    condition: "Good",
    tags: ["floral", "summer", "casual"],
    images: ["/floral-dress.jpg"],
    points_value: 60,
    status: "approved",
    is_available: true,
    featured: true,
    created_at: "2024-01-14T15:30:00Z",
    updated_at: "2024-01-14T15:30:00Z",
    user: { full_name: "Jane Doe", avatar_url: "/placeholder.svg?height=40&width=40" },
    category: { name: "Dresses" },
  },
  {
    id: "3",
    user_id: "2",
    title: "Designer Handbag",
    description: "Authentic designer handbag in mint condition. Rarely used.",
    category_id: "6",
    type: "Bag",
    size: "One Size",
    condition: "Excellent",
    tags: ["designer", "luxury", "handbag"],
    images: ["/designer-handbag.jpg"],
    points_value: 120,
    status: "approved",
    is_available: true,
    featured: false,
    created_at: "2024-01-13T09:15:00Z",
    updated_at: "2024-01-13T09:15:00Z",
    user: { full_name: "Jane Doe", avatar_url: "/placeholder.svg?height=40&width=40" },
    category: { name: "Accessories" },
  },
  {
    id: "4",
    user_id: "3",
    title: "Casual T-Shirt",
    description: "Comfortable cotton t-shirt in great condition.",
    category_id: "1",
    type: "T-Shirt",
    size: "L",
    condition: "Good",
    tags: ["casual", "cotton", "comfortable"],
    images: ["/casual-tshirt.jpg"],
    points_value: 30,
    status: "approved",
    is_available: true,
    featured: false,
    created_at: "2024-01-12T14:20:00Z",
    updated_at: "2024-01-12T14:20:00Z",
    user: { full_name: "John Smith", avatar_url: "/placeholder.svg?height=40&width=40" },
    category: { name: "Tops" },
  },
]

export const mockSwapRequests: SwapRequest[] = [
  {
    id: "1",
    requester_id: "2",
    owner_id: "1",
    requested_item_id: "1",
    offered_item_id: "2",
    status: "pending",
    message: "Hi! I'd love to swap my floral dress for your vintage denim jacket. It would be perfect for my style!",
    created_at: "2024-01-16T10:30:00Z",
    updated_at: "2024-01-16T10:30:00Z",
    requester: {
      id: "2",
      full_name: "Jane Doe",
      avatar_url: "/placeholder.svg?height=40&width=40",
      email: "user@example.com",
    },
    owner: {
      id: "1",
      full_name: "Admin User",
      avatar_url: "/placeholder.svg?height=40&width=40",
      email: "admin@rewear.com",
    },
    requested_item: mockItems[0],
    offered_item: mockItems[1],
  },
  {
    id: "2",
    requester_id: "3",
    owner_id: "2",
    requested_item_id: "3",
    offered_item_id: "4",
    status: "accepted",
    message: "Would you be interested in swapping your designer handbag for my t-shirt?",
    shipping_method: "courier",
    created_at: "2024-01-15T14:20:00Z",
    updated_at: "2024-01-16T09:15:00Z",
    requester: {
      id: "3",
      full_name: "John Smith",
      avatar_url: "/placeholder.svg?height=40&width=40",
      email: "john@example.com",
    },
    owner: {
      id: "2",
      full_name: "Jane Doe",
      avatar_url: "/placeholder.svg?height=40&width=40",
      email: "user@example.com",
    },
    requested_item: mockItems[2],
    offered_item: mockItems[3],
  },
]

export const mockNotifications: Notification[] = [
  {
    id: "1",
    user_id: "1",
    type: "swap_request",
    title: "New Swap Request",
    message: "Jane Doe wants to swap for your Vintage Denim Jacket",
    read: false,
    related_id: "1",
    created_at: "2024-01-16T10:30:00Z",
  },
  {
    id: "2",
    user_id: "3",
    type: "swap_accepted",
    title: "Swap Request Accepted",
    message: "Jane Doe accepted your swap request for Designer Handbag",
    read: false,
    related_id: "2",
    created_at: "2024-01-16T09:15:00Z",
  },
]
