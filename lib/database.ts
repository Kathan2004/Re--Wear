import { supabase } from './supabase'
import type { Database } from './supabase'

export type Item = Database['public']['Tables']['items']['Row'] & {
  user?: {
    full_name: string
    avatar_url?: string
  }
  category?: {
    name: string
  }
}

export type SwapRequest = Database['public']['Tables']['swap_requests']['Row'] & {
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

export type Notification = Database['public']['Tables']['notifications']['Row']

export type Category = Database['public']['Tables']['categories']['Row']

export type User = Database['public']['Tables']['users']['Row']

export type Message = Database['public']['Tables']['messages']['Row']

export type UserReview = Database['public']['Tables']['user_reviews']['Row']

// Database functions
export async function getItems(filters?: {
  category?: string
  search?: string
  status?: string
  featured?: boolean
  limit?: number
  offset?: number
}): Promise<Item[]> {
  let query = supabase
    .from('items')
    .select(`
      *,
      user:users(full_name, avatar_url),
      category:categories(name)
    `)
    .eq('status', 'approved')
    .eq('is_available', true)

  if (filters?.category) {
    query = query.eq('category_id', filters.category)
  }

  if (filters?.search) {
    query = query.textSearch('title', filters.search)
  }

  if (filters?.featured) {
    query = query.eq('featured', true)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching items:', error)
    return []
  }

  return data || []
}

export async function getItem(id: string): Promise<Item | null> {
  const { data, error } = await supabase
    .from('items')
    .select(`
      *,
      user:users(full_name, avatar_url),
      category:categories(name)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching item:', error)
    return null
  }

  return data
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data || []
}

export async function getSwapRequests(userId: string): Promise<SwapRequest[]> {
  const { data, error } = await supabase
    .from('swap_requests')
    .select(`
      *,
      requester:users!swap_requests_requester_id_fkey(full_name, avatar_url, email),
      owner:users!swap_requests_owner_id_fkey(full_name, avatar_url, email),
      requested_item:items!swap_requests_requested_item_id_fkey(*),
      offered_item:items!swap_requests_offered_item_id_fkey(*)
    `)
    .or(`requester_id.eq.${userId},owner_id.eq.${userId}`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching swap requests:', error)
    return []
  }

  return data || []
}

export async function getNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching notifications:', error)
    return []
  }

  return data || []
}

export async function createSwapRequest(swapData: {
  requester_id: string
  owner_id: string
  requested_item_id: string
  offered_item_id?: string
  swap_type: 'direct' | 'points' | 'mixed'
  points_offered?: number
  message?: string
}): Promise<SwapRequest | null> {
  const { data, error } = await supabase
    .from('swap_requests')
    .insert(swapData)
    .select()
    .single()

  if (error) {
    console.error('Error creating swap request:', error)
    return null
  }

  return data
}

export async function updateSwapRequest(
  id: string,
  updates: Partial<Database['public']['Tables']['swap_requests']['Update']>
): Promise<SwapRequest | null> {
  const { data, error } = await supabase
    .from('swap_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating swap request:', error)
    return null
  }

  return data
}

export async function createNotification(notificationData: {
  user_id: string
  type: string
  title: string
  message: string
  related_id?: string
}): Promise<Notification | null> {
  const { data, error } = await supabase
    .from('notifications')
    .insert(notificationData)
    .select()
    .single()

  if (error) {
    console.error('Error creating notification:', error)
    return null
  }

  return data
}

export async function markNotificationAsRead(id: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id)

  if (error) {
    console.error('Error marking notification as read:', error)
  }
}

export async function getUser(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user:', error)
    return null
  }

  return data
}

export async function updateUser(
  userId: string,
  updates: Partial<Database['public']['Tables']['users']['Update']>
): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating user:', error)
    return null
  }

  return data
}

export async function createItem(itemData: {
  user_id: string
  title: string
  description: string
  category_id: string
  type: string
  size: string
  condition: string
  tags?: string[]
  images?: string[]
  points_value?: number
}): Promise<Item | null> {
  const { data, error } = await supabase
    .from('items')
    .insert(itemData)
    .select()
    .single()

  if (error) {
    console.error('Error creating item:', error)
    return null
  }

  return data
}

export async function updateItem(
  itemId: string,
  updates: Partial<Database['public']['Tables']['items']['Update']>
): Promise<Item | null> {
  const { data, error } = await supabase
    .from('items')
    .update(updates)
    .eq('id', itemId)
    .select()
    .single()

  if (error) {
    console.error('Error updating item:', error)
    return null
  }

  return data
}

export async function getMessages(swapRequestId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('swap_request_id', swapRequestId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching messages:', error)
    return []
  }

  return data || []
}

export async function sendMessage(messageData: {
  sender_id: string
  receiver_id: string
  swap_request_id: string
  content: string
}): Promise<Message | null> {
  const { data, error } = await supabase
    .from('messages')
    .insert(messageData)
    .select()
    .single()

  if (error) {
    console.error('Error sending message:', error)
    return null
  }

  return data
}

export async function addToFavorites(userId: string, itemId: string): Promise<void> {
  const { error } = await supabase
    .from('user_favorites')
    .insert({ user_id: userId, item_id: itemId })

  if (error) {
    console.error('Error adding to favorites:', error)
  }
}

export async function removeFromFavorites(userId: string, itemId: string): Promise<void> {
  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .eq('user_id', userId)
    .eq('item_id', itemId)

  if (error) {
    console.error('Error removing from favorites:', error)
  }
}

export async function getFavorites(userId: string): Promise<Item[]> {
  const { data, error } = await supabase
    .from('user_favorites')
    .select(`
      item:items(
        *,
        user:users(full_name, avatar_url),
        category:categories(name)
      )
    `)
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching favorites:', error)
    return []
  }

  return data?.map(fav => fav.item) || []
}

export async function createReview(reviewData: {
  reviewer_id: string
  reviewed_user_id: string
  swap_request_id: string
  rating: number
  comment?: string
}): Promise<UserReview | null> {
  const { data, error } = await supabase
    .from('user_reviews')
    .insert(reviewData)
    .select()
    .single()

  if (error) {
    console.error('Error creating review:', error)
    return null
  }

  return data
}

export async function getUserReviews(userId: string): Promise<UserReview[]> {
  const { data, error } = await supabase
    .from('user_reviews')
    .select('*')
    .eq('reviewed_user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user reviews:', error)
    return []
  }

  return data || []
}
