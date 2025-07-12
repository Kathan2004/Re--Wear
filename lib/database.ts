// Database types
export interface User {
  id: string
  email: string
  full_name: string
  password: string
  points: number
  role: "user" | "admin"
  avatar_url: string
  bio: string | null
  location: string | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
}

export interface Item {
  id: string
  title: string
  description: string
  image_url: string
  category_id: string
  user_id: string
  size: string
  condition: string
  brand: string
  points_required: number
  tags: string[]
  status: "pending" | "approved" | "rejected"
  is_available: boolean
  featured: boolean
  created_at: string
  updated_at: string
  user?: User
  category?: Category
}

export interface SwapRequest {
  id: string
  requester_id: string
  owner_id: string
  requested_item_id: string
  offered_item_id: string
  status: "pending" | "accepted" | "rejected" | "shipped" | "completed"
  message?: string
  created_at: string
  updated_at: string
  requester?: User
  owner?: User
  requested_item?: Item
  offered_item?: Item
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: "swap_request" | "swap_accepted" | "swap_rejected" | "points_earned" | "system"
  is_read: boolean
  created_at: string
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  is_read: boolean
  created_at: string
  sender?: User
  receiver?: User
}

export interface Favorite {
  id: string
  user_id: string
  item_id: string
  created_at: string
  item?: Item
}

export interface Review {
  id: string
  reviewer_id: string
  reviewed_user_id: string
  rating: number
  comment: string
  created_at: string
  reviewer?: User
  reviewed_user?: User
}

// localStorage keys
const STORAGE_KEYS = {
  USERS: 'rewear_users',
  CATEGORIES: 'rewear_categories',
  ITEMS: 'rewear_items',
  SWAP_REQUESTS: 'rewear_swap_requests',
  NOTIFICATIONS: 'rewear_notifications',
  MESSAGES: 'rewear_messages',
  FAVORITES: 'rewear_favorites',
  REVIEWS: 'rewear_reviews'
}

// Initialize sample data
const initializeSampleData = () => {
  // Check if data already exists
  if (typeof window === 'undefined') return

  // 
  const sampleUsers: User[] = [
    {
      id: "1",
      email: "kathan@example.com",
      full_name: "Kathan Patel",
      password: "password123",
      points: 250,
      role: "admin",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      bio: "Fashion enthusiast from Mumbai. Love sustainable clothing and community sharing.",
      location: "Mumbai, India",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z"
    },
    {
      id: "2",
      email: "priyansh@example.com",
      full_name: "Priyansh Sharma",
      password: "password123",
      points: 180,
      role: "user",
      avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      bio: "Student from Delhi. Always looking for unique pieces to add to my collection.",
      location: "Delhi, India",
      created_at: "2024-01-10T14:30:00Z",
      updated_at: "2024-01-10T14:30:00Z"
    },
    {
      id: "3",
      email: "prabhakar@example.com",
      full_name: "Prabhakar Kumar",
      password: "password123",
      points: 320,
      role: "user",
      avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      bio: "Professional from Bangalore. Passionate about reducing fashion waste.",
      location: "Bangalore, India",
      created_at: "2024-01-05T09:15:00Z",
      updated_at: "2024-01-05T09:15:00Z"
    },
    {
      id: "4",
      email: "ananya@example.com",
      full_name: "Ananya Gupta",
      password: "password123",
      points: 195,
      role: "user",
      avatar_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      bio: "Creative designer from Chennai. Love vintage and sustainable fashion.",
      location: "Chennai, India",
      created_at: "2024-01-12T16:45:00Z",
      updated_at: "2024-01-12T16:45:00Z"
    },
    {
      id: "5",
      email: "arjun@example.com",
      full_name: "Arjun Singh",
      password: "password123",
      points: 140,
      role: "user",
      avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      bio: "Tech professional from Hyderabad. Minimalist approach to fashion.",
      location: "Hyderabad, India",
      created_at: "2024-01-08T11:20:00Z",
      updated_at: "2024-01-08T11:20:00Z"
    }
  ]

  // Sample categories
  const sampleCategories: Category[] = [
    {
      id: "1",
      name: "T-Shirts",
      description: "Casual and formal t-shirts",
      icon: "👕"
    },
    {
      id: "2",
      name: "Jeans",
      description: "Denim jeans and pants",
      icon: "👖"
    },
    {
      id: "3",
      name: "Dresses",
      description: "Casual and formal dresses",
      icon: "👗"
    },
    {
      id: "4",
      name: "Jackets",
      description: "Denim, leather, and casual jackets",
      icon: "🧥"
    },
    {
      id: "5",
      name: "Shoes",
      description: "Sneakers, formal shoes, and boots",
      icon: "👟"
    },
    {
      id: "6",
      name: "Accessories",
      description: "Bags, jewelry, and other accessories",
      icon: "👜"
    }
  ]

  // Sample items with web images
  const sampleItems: Item[] = [
    {
      id: "1",
      title: "Vintage Denim Jacket",
      description: "Classic blue denim jacket in excellent condition. Perfect for layering.",
      image_url: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=400&fit=crop",
      category_id: "4",
      user_id: "1",
      size: "M",
      condition: "Excellent",
      brand: "Levi's",
      points_required: 150,
      tags: ["vintage", "denim", "jacket", "classic"],
      status: "approved",
      is_available: true,
      featured: true,
      created_at: "2024-01-20T10:00:00Z",
      updated_at: "2024-01-20T10:00:00Z"
    },
    {
      id: "2",
      title: "Casual White T-Shirt",
      description: "Comfortable cotton t-shirt, perfect for everyday wear.",
      image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
      category_id: "1",
      user_id: "2",
      size: "L",
      condition: "Good",
      brand: "H&M",
      points_required: 50,
      tags: ["casual", "cotton", "basic", "white"],
      status: "approved",
      is_available: true,
      featured: false,
      created_at: "2024-01-18T14:30:00Z",
      updated_at: "2024-01-18T14:30:00Z"
    },
    {
      id: "3",
      title: "Floral Summer Dress",
      description: "Beautiful floral print dress, perfect for summer occasions.",
      image_url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop",
      category_id: "3",
      user_id: "3",
      size: "S",
      condition: "Excellent",
      brand: "Zara",
      points_required: 120,
      tags: ["floral", "summer", "dress", "elegant"],
      status: "approved",
      is_available: true,
      featured: true,
      created_at: "2024-01-19T09:15:00Z",
      updated_at: "2024-01-19T09:15:00Z"
    },
    {
      id: "4",
      title: "Classic Blue Jeans",
      description: "High-quality denim jeans with perfect fit.",
      image_url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
      category_id: "2",
      user_id: "4",
      size: "32",
      condition: "Good",
      brand: "Nike",
      points_required: 80,
      tags: ["denim", "jeans", "classic", "blue"],
      status: "approved",
      is_available: true,
      featured: false,
      created_at: "2024-01-17T16:45:00Z",
      updated_at: "2024-01-17T16:45:00Z"
    },
    {
      id: "5",
      title: "Leather Crossbody Bag",
      description: "Stylish leather bag, perfect for daily use.",
      image_url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
      category_id: "6",
      user_id: "5",
      size: "One Size",
      condition: "Excellent",
      brand: "Vintage",
      points_required: 200,
      tags: ["leather", "bag", "crossbody", "stylish"],
      status: "approved",
      is_available: true,
      featured: true,
      created_at: "2024-01-16T11:20:00Z",
      updated_at: "2024-01-16T11:20:00Z"
    },
    {
      id: "6",
      title: "Comfortable Hoodie",
      description: "Warm and cozy hoodie for cold weather.",
      image_url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
      category_id: "1",
      user_id: "1",
      size: "XL",
      condition: "Good",
      brand: "Adidas",
      points_required: 100,
      tags: ["hoodie", "warm", "comfortable", "casual"],
      status: "approved",
      is_available: true,
      featured: false,
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z"
    }
  ]

  // Sample swap requests
  const sampleSwapRequests: SwapRequest[] = [
    {
      id: "1",
      requester_id: "2",
      owner_id: "1",
      requested_item_id: "1",
      offered_item_id: "2",
      status: "pending",
      message: "I love this denim jacket! Would you be interested in swapping for my white t-shirt?",
      created_at: "2024-01-21T10:00:00Z",
      updated_at: "2024-01-21T10:00:00Z"
    },
    {
      id: "2",
      requester_id: "3",
      owner_id: "4",
      requested_item_id: "4",
      offered_item_id: "3",
      status: "accepted",
      message: "These jeans look perfect for my style. I can offer my floral dress in exchange.",
      created_at: "2024-01-20T14:30:00Z",
      updated_at: "2024-01-20T14:30:00Z"
    },
    {
      id: "3",
      requester_id: "1",
      owner_id: "5",
      requested_item_id: "5",
      offered_item_id: "6",
      status: "pending",
      message: "This leather bag is exactly what I've been looking for! I can offer my comfortable hoodie.",
      created_at: "2024-01-22T09:15:00Z",
      updated_at: "2024-01-22T09:15:00Z"
    },
    {
      id: "4",
      requester_id: "4",
      owner_id: "2",
      requested_item_id: "2",
      offered_item_id: "4",
      status: "rejected",
      message: "I'd love to swap for your t-shirt with my jeans.",
      created_at: "2024-01-19T16:45:00Z",
      updated_at: "2024-01-19T16:45:00Z"
    },
    {
      id: "5",
      requester_id: "5",
      owner_id: "3",
      requested_item_id: "3",
      offered_item_id: "5",
      status: "shipped",
      message: "Your floral dress is beautiful! I can offer my leather bag in exchange.",
      created_at: "2024-01-18T11:30:00Z",
      updated_at: "2024-01-18T11:30:00Z"
    }
  ]

  // Sample notifications
  const sampleNotifications: Notification[] = [
    {
      id: "1",
      user_id: "1",
      title: "New Swap Request",
      message: "Priyansh Sharma wants to swap your Vintage Denim Jacket",
      type: "swap_request",
      is_read: false,
      created_at: "2024-01-21T10:00:00Z"
    },
    {
      id: "2",
      user_id: "2",
      title: "Points Earned",
      message: "You earned 50 points for listing an item",
      type: "points_earned",
      is_read: true,
      created_at: "2024-01-18T14:30:00Z"
    },
    {
      id: "3",
      user_id: "3",
      title: "Swap Accepted",
      message: "Prabhakar Singh accepted your swap request for the Floral Summer Dress",
      type: "swap_accepted",
      is_read: false,
      created_at: "2024-01-20T14:30:00Z"
    },
    {
      id: "4",
      user_id: "4",
      title: "New Swap Request",
      message: "Kathan Patel wants to swap your Classic Blue Jeans",
      type: "swap_request",
      is_read: false,
      created_at: "2024-01-22T09:15:00Z"
    },
    {
      id: "5",
      user_id: "5",
      title: "Item Approved",
      message: "Your Leather Crossbody Bag has been approved and is now live",
      type: "system",
      is_read: true,
      created_at: "2024-01-17T11:20:00Z"
    }
  ]

  // Initialize data if it doesn't exist
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(sampleUsers))
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(sampleCategories))
  }
  if (!localStorage.getItem(STORAGE_KEYS.ITEMS)) {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(sampleItems))
  }
  if (!localStorage.getItem(STORAGE_KEYS.SWAP_REQUESTS)) {
    localStorage.setItem(STORAGE_KEYS.SWAP_REQUESTS, JSON.stringify(sampleSwapRequests))
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(sampleNotifications))
  }
  // Sample messages
  const sampleMessages: Message[] = [
    {
      id: "1",
      sender_id: "2",
      receiver_id: "1",
      content: "Hi! I'm interested in your denim jacket. Is it still available?",
      is_read: false,
      created_at: "2024-01-21T10:00:00Z"
    },
    {
      id: "2",
      sender_id: "1",
      receiver_id: "2",
      content: "Yes, it's still available! What would you like to swap for it?",
      is_read: true,
      created_at: "2024-01-21T10:05:00Z"
    },
    {
      id: "3",
      sender_id: "3",
      receiver_id: "4",
      content: "Your jeans look perfect! I can offer my floral dress in exchange.",
      is_read: false,
      created_at: "2024-01-20T14:30:00Z"
    }
  ]

  if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(sampleMessages))
  }
  // Sample favorites
  const sampleFavorites: Favorite[] = [
    {
      id: "1",
      user_id: "1",
      item_id: "3",
      created_at: "2024-01-20T15:30:00Z"
    },
    {
      id: "2",
      user_id: "2",
      item_id: "1",
      created_at: "2024-01-21T09:45:00Z"
    },
    {
      id: "3",
      user_id: "3",
      item_id: "5",
      created_at: "2024-01-19T12:20:00Z"
    }
  ]

  // Sample reviews
  const sampleReviews: Review[] = [
    {
      id: "1",
      reviewer_id: "2",
      reviewed_user_id: "1",
      rating: 5,
      comment: "Great swap experience! The item was exactly as described.",
      created_at: "2024-01-20T16:00:00Z"
    },
    {
      id: "2",
      reviewer_id: "3",
      reviewed_user_id: "4",
      rating: 4,
      comment: "Smooth transaction and good communication.",
      created_at: "2024-01-19T14:30:00Z"
    },
    {
      id: "3",
      reviewer_id: "1",
      reviewed_user_id: "5",
      rating: 5,
      comment: "Excellent condition and fast shipping!",
      created_at: "2024-01-18T11:15:00Z"
    }
  ]

  if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(sampleFavorites))
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(sampleReviews))
  }
}

// Initialize data on client side
if (typeof window !== 'undefined') {
  initializeSampleData()
  console.log('Database initialized with sample data')
}

// Force reinitialize data (for debugging)
export const forceReinitializeData = () => {
  if (typeof window === 'undefined') return
  
  console.log('Force reinitializing data...')
  
  // Clear existing data
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key)
  })
  
  // Reinitialize
  initializeSampleData()
  
  console.log('Data reinitialized successfully')
}

// Debug function to check data
export const debugData = () => {
  if (typeof window === 'undefined') return
  
  console.log('=== DEBUG DATA ===')
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    const data = localStorage.getItem(key)
    console.log(`${name}:`, data ? JSON.parse(data).length : 0, 'items')
  })
  console.log('==================')
}

// Utility function to reset all data to sample data
export const resetToSampleData = () => {
  if (typeof window === 'undefined') return
  
  console.log('Resetting to sample data...')
  forceReinitializeData()
  console.log('Data reset complete!')
}

// Database functions
export const getUsers = async (): Promise<User[]> => {
  if (typeof window === 'undefined') return []
  const users = localStorage.getItem(STORAGE_KEYS.USERS)
  return users ? JSON.parse(users) : []
}

export const getUser = async (id: string): Promise<User | null> => {
  const users = await getUsers()
  return users.find(user => user.id === id) || null
}

export const createUser = async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> => {
  const users = await getUsers()
  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  users.push(newUser)
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
  return newUser
}

export const updateUser = async (id: string, updates: Partial<User>): Promise<User | null> => {
  const users = await getUsers()
  const index = users.findIndex(user => user.id === id)
  if (index === -1) return null
  
  users[index] = { ...users[index], ...updates, updated_at: new Date().toISOString() }
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
  return users[index]
}

export const getCategories = async (): Promise<Category[]> => {
  if (typeof window === 'undefined') return []
  const categories = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
  return categories ? JSON.parse(categories) : []
}

export const getItems = async (filters?: {
  category_id?: string
  user_id?: string
  status?: string
  is_available?: boolean
  featured?: boolean
  limit?: number
}): Promise<Item[]> => {
  if (typeof window === 'undefined') return []
  
  const items = localStorage.getItem(STORAGE_KEYS.ITEMS)
  let parsedItems: Item[] = items ? JSON.parse(items) : []
  
  // Apply filters
  if (filters) {
    if (filters.category_id) {
      parsedItems = parsedItems.filter(item => item.category_id === filters.category_id)
    }
    if (filters.user_id) {
      parsedItems = parsedItems.filter(item => item.user_id === filters.user_id)
    }
    if (filters.status) {
      parsedItems = parsedItems.filter(item => item.status === filters.status)
    }
    if (filters.is_available !== undefined) {
      parsedItems = parsedItems.filter(item => item.is_available === filters.is_available)
    }
    if (filters.featured !== undefined) {
      parsedItems = parsedItems.filter(item => item.featured === filters.featured)
    }
    if (filters.limit) {
      parsedItems = parsedItems.slice(0, filters.limit)
    }
  }
  
  // Populate user and category data
  const users = await getUsers()
  const categories = await getCategories()
  
  return parsedItems.map(item => ({
    ...item,
    user: users.find(user => user.id === item.user_id),
    category: categories.find(category => category.id === item.category_id)
  }))
}

export const getItem = async (id: string): Promise<Item | null> => {
  const items = await getItems()
  return items.find(item => item.id === id) || null
}

export const createItem = async (itemData: Omit<Item, 'id' | 'created_at' | 'updated_at'>): Promise<Item> => {
  const items = await getItems()
  const newItem: Item = {
    ...itemData,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  items.push(newItem)
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items))
  return newItem
}

export const updateItem = async (id: string, updates: Partial<Item>): Promise<Item | null> => {
  const items = await getItems()
  const index = items.findIndex(item => item.id === id)
  if (index === -1) return null
  
  items[index] = { ...items[index], ...updates, updated_at: new Date().toISOString() }
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items))
  return items[index]
}

export const deleteItem = async (id: string): Promise<boolean> => {
  const items = await getItems()
  const filteredItems = items.filter(item => item.id !== id)
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(filteredItems))
  return true
}

export const getSwapRequests = async (): Promise<SwapRequest[]> => {
  if (typeof window === 'undefined') return []
  
  const requests = localStorage.getItem(STORAGE_KEYS.SWAP_REQUESTS)
  let parsedRequests: SwapRequest[] = requests ? JSON.parse(requests) : []
  
  // Populate related data
  const users = await getUsers()
  const items = await getItems()
  
  return parsedRequests.map(request => ({
    ...request,
    requester: users.find(user => user.id === request.requester_id),
    owner: users.find(user => user.id === request.owner_id),
    requested_item: items.find(item => item.id === request.requested_item_id),
    offered_item: items.find(item => item.id === request.offered_item_id)
  }))
}

export const createSwapRequest = async (requestData: Omit<SwapRequest, 'id' | 'created_at' | 'updated_at'>): Promise<SwapRequest> => {
  const requests = await getSwapRequests()
  const newRequest: SwapRequest = {
    ...requestData,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  requests.push(newRequest)
  localStorage.setItem(STORAGE_KEYS.SWAP_REQUESTS, JSON.stringify(requests))
  return newRequest
}

export const updateSwapRequest = async (id: string, updates: Partial<SwapRequest>): Promise<SwapRequest | null> => {
  const requests = await getSwapRequests()
  const index = requests.findIndex(request => request.id === id)
  if (index === -1) return null
  
  requests[index] = { ...requests[index], ...updates, updated_at: new Date().toISOString() }
  localStorage.setItem(STORAGE_KEYS.SWAP_REQUESTS, JSON.stringify(requests))
  return requests[index]
}

export const getNotifications = async (userId?: string): Promise<Notification[]> => {
  if (typeof window === 'undefined') return []
  
  const notifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)
  let parsedNotifications: Notification[] = notifications ? JSON.parse(notifications) : []
  
  if (userId) {
    parsedNotifications = parsedNotifications.filter(notification => notification.user_id === userId)
  }
  
  return parsedNotifications
}

export const createNotification = async (notificationData: Omit<Notification, 'id' | 'created_at'>): Promise<Notification> => {
  const notifications = await getNotifications()
  const newNotification: Notification = {
    ...notificationData,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  }
  notifications.push(newNotification)
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications))
  return newNotification
}

export const markNotificationAsRead = async (id: string): Promise<boolean> => {
  const notifications = await getNotifications()
  const index = notifications.findIndex(notification => notification.id === id)
  if (index === -1) return false
  
  notifications[index].is_read = true
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications))
  return true
}

export const getMessages = async (userId?: string): Promise<Message[]> => {
  if (typeof window === 'undefined') return []
  
  const messages = localStorage.getItem(STORAGE_KEYS.MESSAGES)
  let parsedMessages: Message[] = messages ? JSON.parse(messages) : []
  
  if (userId) {
    parsedMessages = parsedMessages.filter(message => 
      message.sender_id === userId || message.receiver_id === userId
    )
  }
  
  // Populate user data
  const users = await getUsers()
  
  return parsedMessages.map(message => ({
    ...message,
    sender: users.find(user => user.id === message.sender_id),
    receiver: users.find(user => user.id === message.receiver_id)
  }))
}

export const createMessage = async (messageData: Omit<Message, 'id' | 'created_at'>): Promise<Message> => {
  const messages = await getMessages()
  const newMessage: Message = {
    ...messageData,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  }
  messages.push(newMessage)
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages))
  return newMessage
}

export const getFavorites = async (userId?: string): Promise<Favorite[]> => {
  if (typeof window === 'undefined') return []
  
  const favorites = localStorage.getItem(STORAGE_KEYS.FAVORITES)
  let parsedFavorites: Favorite[] = favorites ? JSON.parse(favorites) : []
  
  if (userId) {
    parsedFavorites = parsedFavorites.filter(favorite => favorite.user_id === userId)
  }
  
  // Populate item data
  const items = await getItems()
  
  return parsedFavorites.map(favorite => ({
    ...favorite,
    item: items.find(item => item.id === favorite.item_id)
  }))
}

export const addToFavorites = async (userId: string, itemId: string): Promise<Favorite> => {
  const favorites = await getFavorites()
  const newFavorite: Favorite = {
    id: Date.now().toString(),
    user_id: userId,
    item_id: itemId,
    created_at: new Date().toISOString()
  }
  favorites.push(newFavorite)
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites))
  return newFavorite
}

export const removeFromFavorites = async (userId: string, itemId: string): Promise<boolean> => {
  const favorites = await getFavorites()
  const filteredFavorites = favorites.filter(favorite => 
    !(favorite.user_id === userId && favorite.item_id === itemId)
  )
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filteredFavorites))
  return true
}

export const getReviews = async (userId?: string): Promise<Review[]> => {
  if (typeof window === 'undefined') return []
  
  const reviews = localStorage.getItem(STORAGE_KEYS.REVIEWS)
  let parsedReviews: Review[] = reviews ? JSON.parse(reviews) : []
  
  if (userId) {
    parsedReviews = parsedReviews.filter(review => review.reviewed_user_id === userId)
  }
  
  // Populate user data
  const users = await getUsers()
  
  return parsedReviews.map(review => ({
    ...review,
    reviewer: users.find(user => user.id === review.reviewer_id),
    reviewed_user: users.find(user => user.id === review.reviewed_user_id)
  }))
}

export const createReview = async (reviewData: Omit<Review, 'id' | 'created_at'>): Promise<Review> => {
  const reviews = await getReviews()
  const newReview: Review = {
    ...reviewData,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  }
  reviews.push(newReview)
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews))
  return newReview
}
