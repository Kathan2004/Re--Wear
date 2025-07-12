export interface Seller {
  id: string
  business_name: string
  owner_name: string
  email: string
  phone: string
  business_type: string
  location: string
  description?: string
  logo_url?: string
  status: "active" | "pending" | "blocked"
  rating: number
  total_items: number
  total_sales: number
  commission_paid: number
  block_reason?: string
  blocked_at?: string
  created_at: string
  updated_at: string
}

export interface Commission {
  id: string
  seller_id: string
  seller_name: string
  transaction_id: string
  transaction_type: string
  amount: number
  percentage: number
  created_at: string
}

// Mock sellers data
export const mockSellers: Seller[] = [
  {
    id: "1",
    business_name: "Vintage Threads Co.",
    owner_name: "Sarah Johnson",
    email: "sarah@vintagethreads.com",
    phone: "+1 (555) 123-4567",
    business_type: "Vintage Clothing Store",
    location: "New York, NY",
    description:
      "Curated collection of authentic vintage clothing from the 60s to 90s. We specialize in rare finds and designer pieces.",
    logo_url: "/placeholder.svg?height=100&width=100",
    status: "active",
    rating: 4.8,
    total_items: 156,
    total_sales: 89,
    commission_paid: 2340,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    business_name: "EcoFashion Hub",
    owner_name: "Michael Chen",
    email: "michael@ecofashion.com",
    phone: "+1 (555) 234-5678",
    business_type: "Sustainable Fashion",
    location: "San Francisco, CA",
    description: "Sustainable and eco-friendly fashion brand focused on organic materials and ethical production.",
    logo_url: "/placeholder.svg?height=100&width=100",
    status: "active",
    rating: 4.9,
    total_items: 203,
    total_sales: 145,
    commission_paid: 3890,
    created_at: "2024-01-10T14:30:00Z",
    updated_at: "2024-01-10T14:30:00Z",
  },
  {
    id: "3",
    business_name: "Street Style Collective",
    owner_name: "Emma Rodriguez",
    email: "emma@streetstyle.com",
    phone: "+1 (555) 345-6789",
    business_type: "Streetwear",
    location: "Los Angeles, CA",
    description: "Urban streetwear and contemporary fashion for the modern generation.",
    logo_url: "/placeholder.svg?height=100&width=100",
    status: "blocked",
    rating: 3.2,
    total_items: 78,
    total_sales: 23,
    commission_paid: 567,
    block_reason:
      "Multiple customer complaints about product quality and delayed shipping. Failed to respond to support requests.",
    blocked_at: "2024-01-20T09:15:00Z",
    created_at: "2024-01-05T11:20:00Z",
    updated_at: "2024-01-20T09:15:00Z",
  },
  {
    id: "4",
    business_name: "Luxury Consignment",
    owner_name: "David Kim",
    email: "david@luxuryconsign.com",
    phone: "+1 (555) 456-7890",
    business_type: "Luxury Consignment",
    location: "Miami, FL",
    description: "High-end designer consignment specializing in authenticated luxury brands and accessories.",
    logo_url: "/placeholder.svg?height=100&width=100",
    status: "active",
    rating: 4.7,
    total_items: 89,
    total_sales: 67,
    commission_paid: 4560,
    created_at: "2024-01-08T16:45:00Z",
    updated_at: "2024-01-08T16:45:00Z",
  },
  {
    id: "5",
    business_name: "Boho Chic Boutique",
    owner_name: "Lisa Thompson",
    email: "lisa@bohochic.com",
    phone: "+1 (555) 567-8901",
    business_type: "Boutique",
    location: "Austin, TX",
    description: "Bohemian and indie fashion pieces for free spirits and creative souls.",
    logo_url: "/placeholder.svg?height=100&width=100",
    status: "pending",
    rating: 4.5,
    total_items: 45,
    total_sales: 12,
    commission_paid: 234,
    created_at: "2024-01-22T13:30:00Z",
    updated_at: "2024-01-22T13:30:00Z",
  },
  {
    id: "6",
    business_name: "Athletic Wear Pro",
    owner_name: "James Wilson",
    email: "james@athleticpro.com",
    phone: "+1 (555) 678-9012",
    business_type: "Sportswear",
    location: "Denver, CO",
    description: "Professional athletic wear and sports equipment for serious athletes and fitness enthusiasts.",
    logo_url: "/placeholder.svg?height=100&width=100",
    status: "active",
    rating: 4.6,
    total_items: 134,
    total_sales: 98,
    commission_paid: 2890,
    created_at: "2024-01-12T08:15:00Z",
    updated_at: "2024-01-12T08:15:00Z",
  },
  {
    id: "7",
    business_name: "Kids Fashion Corner",
    owner_name: "Maria Garcia",
    email: "maria@kidsfashion.com",
    phone: "+1 (555) 789-0123",
    business_type: "Children's Clothing",
    location: "Chicago, IL",
    description: "Adorable and comfortable clothing for children of all ages, from newborns to teens.",
    logo_url: "/placeholder.svg?height=100&width=100",
    status: "active",
    rating: 4.9,
    total_items: 267,
    total_sales: 189,
    commission_paid: 3456,
    created_at: "2024-01-07T12:00:00Z",
    updated_at: "2024-01-07T12:00:00Z",
  },
  {
    id: "8",
    business_name: "Formal Elegance",
    owner_name: "Robert Brown",
    email: "robert@formalelegance.com",
    phone: "+1 (555) 890-1234",
    business_type: "Formal Wear",
    location: "Boston, MA",
    description: "Elegant formal wear for special occasions, weddings, and professional events.",
    logo_url: "/placeholder.svg?height=100&width=100",
    status: "blocked",
    rating: 2.8,
    total_items: 56,
    total_sales: 8,
    commission_paid: 123,
    block_reason:
      "Selling counterfeit designer items and misrepresenting product authenticity. Violated platform terms of service.",
    blocked_at: "2024-01-18T14:22:00Z",
    created_at: "2024-01-14T09:30:00Z",
    updated_at: "2024-01-18T14:22:00Z",
  },
]

// Mock commission data
export const mockCommissions: Commission[] = [
  {
    id: "1",
    seller_id: "1",
    seller_name: "Vintage Threads Co.",
    transaction_id: "txn_001",
    transaction_type: "Item Sale",
    amount: 45.5,
    percentage: 5.0,
    created_at: "2024-01-20T10:30:00Z",
  },
  {
    id: "2",
    seller_id: "2",
    seller_name: "EcoFashion Hub",
    transaction_id: "txn_002",
    transaction_type: "Item Sale",
    amount: 67.8,
    percentage: 5.0,
    created_at: "2024-01-19T15:45:00Z",
  },
  {
    id: "3",
    seller_id: "4",
    seller_name: "Luxury Consignment",
    transaction_id: "txn_003",
    transaction_type: "Item Sale",
    amount: 125.0,
    percentage: 5.0,
    created_at: "2024-01-18T11:20:00Z",
  },
  {
    id: "4",
    seller_id: "6",
    seller_name: "Athletic Wear Pro",
    transaction_id: "txn_004",
    transaction_type: "Item Sale",
    amount: 34.25,
    percentage: 5.0,
    created_at: "2024-01-17T14:15:00Z",
  },
  {
    id: "5",
    seller_id: "7",
    seller_name: "Kids Fashion Corner",
    transaction_id: "txn_005",
    transaction_type: "Item Sale",
    amount: 28.9,
    percentage: 5.0,
    created_at: "2024-01-16T09:30:00Z",
  },
  {
    id: "6",
    seller_id: "1",
    seller_name: "Vintage Threads Co.",
    transaction_id: "txn_006",
    transaction_type: "Subscription Fee",
    amount: 29.99,
    percentage: 100.0,
    created_at: "2024-01-15T08:00:00Z",
  },
  {
    id: "7",
    seller_id: "2",
    seller_name: "EcoFashion Hub",
    transaction_id: "txn_007",
    transaction_type: "Item Sale",
    amount: 89.75,
    percentage: 5.0,
    created_at: "2024-01-14T16:45:00Z",
  },
  {
    id: "8",
    seller_id: "4",
    seller_name: "Luxury Consignment",
    transaction_id: "txn_008",
    transaction_type: "Item Sale",
    amount: 156.4,
    percentage: 5.0,
    created_at: "2024-01-13T13:20:00Z",
  },
]
