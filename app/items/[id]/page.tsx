"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { getItems, getCategories, type Item, type Category } from "@/lib/database"
import { ArrowLeft, Coins, MapPin, Star, Shield, ArrowUpDown, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ItemDetailPage() {
  const params = useParams()
  const { user } = useAuth()
  const { toast } = useToast()

  const [item, setItem] = useState<Item | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [userItems, setUserItems] = useState<Item[]>([])
  const [showSwapModal, setShowSwapModal] = useState(false)
  const [selectedOwnItem, setSelectedOwnItem] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [itemsData, categoriesData] = await Promise.all([
          getItems(),
          getCategories()
        ])
        
        setCategories(categoriesData)
        
        // Find the specific item
        const foundItem = itemsData.find((item) => item.id === params.id)
        setItem(foundItem || null)
        
        // Filter user's own items
        if (user) {
          const userOwnItems = itemsData.filter((item) => item.user_id === user.id)
          setUserItems(userOwnItems)
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading item:', error)
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [params.id, user])

  const handleRequestSwap = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to request swaps",
        variant: "destructive",
      })
      return
    }
    setShowSwapModal(true)
  }

  const handleSendSwapRequest = async () => {
    if (!item || !selectedOwnItem) {
      toast({
        title: "Selection Required",
        description: "Please select an item to offer for swap",
        variant: "destructive",
      })
      return
    }

    try {
      const swapRequest = {
        fromUser: user?.id,
        toUser: item.user_id,
        requestedItem: item.id,
        offeredItem: selectedOwnItem,
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Swap Request Sent!",
        description: `Your swap request for "${item.title}" has been sent successfully.`,
      })

      setShowSwapModal(false)
      setSelectedOwnItem("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send swap request. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading item...</p>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Item Not Found</h1>
          <p className="text-gray-600 mb-6">The item you're looking for doesn't exist or has been removed.</p>
          <Link href="/browse">
            <Button>Browse Items</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/browse" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Browse
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="aspect-square relative bg-white rounded-lg overflow-hidden shadow-lg">
              <Image
                src={item.image_url || "/placeholder.jpg"}
                alt={item.title}
                fill
                className="object-cover"
              />
              {item.featured && (
                <Badge className="absolute top-4 left-4 bg-yellow-500 hover:bg-yellow-600">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              <Badge className="absolute top-4 right-4 bg-green-600 hover:bg-green-700">
                <Coins className="h-3 w-3 mr-1" />
                {item.points_required} Points
              </Badge>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
                <Badge className="bg-green-100 text-green-800">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>
              <p className="text-gray-600">
                {categories.find(c => c.id === item.category_id)?.name}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Badge className="bg-green-600 text-white px-3 py-1">
                <Coins className="h-4 w-4 mr-1" />
                {item.points_required} Points
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                Size {item.size}
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                {item.condition}
              </Badge>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Owner Info */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Owner</h3>
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={item.user?.avatar_url || "/placeholder-user.jpg"}
                    alt={item.user?.full_name}
                  />
                  <AvatarFallback>{item.user?.full_name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{item.user?.full_name}</p>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>Member since {new Date(item.user?.created_at || '').getFullYear()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleRequestSwap}
                disabled={item.user_id === user?.id}
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Request Swap
              </Button>
              <Button variant="outline">
                <User className="h-4 w-4 mr-2" />
                View Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Swap Request Modal */}
        <Dialog open={showSwapModal} onOpenChange={setShowSwapModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Swap</DialogTitle>
              <DialogDescription>
                Select one of your items to offer in exchange for "{item.title}"
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Select value={selectedOwnItem} onValueChange={setSelectedOwnItem}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your item to offer" />
                </SelectTrigger>
                <SelectContent>
                  {userItems.map((userItem) => (
                    <SelectItem key={userItem.id} value={userItem.id}>
                      {userItem.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex space-x-2">
                <Button onClick={handleSendSwapRequest} className="flex-1">
                  Send Request
                </Button>
                <Button variant="outline" onClick={() => setShowSwapModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
