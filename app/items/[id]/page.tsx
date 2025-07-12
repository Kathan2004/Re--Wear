"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { mockItems, type Item } from "@/lib/database"
import {
  ArrowLeft,
  Search,
  Heart,
  Share2,
  Shield,
  Coins,
  ArrowUpDown,
  MapPin,
  Calendar,
  Package,
  Star,
  Upload,
  MessageCircle,
} from "lucide-react"

export default function ItemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const [item, setItem] = useState<Item | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showSwapModal, setShowSwapModal] = useState(false)
  const [selectedOwnItem, setSelectedOwnItem] = useState<string>("")
  const [showNewItemForm, setShowNewItemForm] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  // New item form state
  const [newItemTitle, setNewItemTitle] = useState("")
  const [newItemSize, setNewItemSize] = useState("")
  const [newItemCondition, setNewItemCondition] = useState("")
  const [newItemDescription, setNewItemDescription] = useState("")

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"]
  const conditions = ["Excellent", "Good", "Fair", "Poor"]

  // User's own items (mock data filtered by current user)
  const userItems = mockItems.filter((item) => item.user_id === user?.id)

  useEffect(() => {
    // Find item by ID
    const foundItem = mockItems.find((item) => item.id === params.id)
    if (foundItem) {
      setItem(foundItem)
    } else {
      router.push("/browse")
    }
  }, [params.id, router])

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

  const handleAddNewItem = async () => {
    if (!newItemTitle || !newItemSize || !newItemCondition) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Item Added!",
        description: "Your new item has been added and is pending approval.",
      })

      // Reset form
      setNewItemTitle("")
      setNewItemSize("")
      setNewItemCondition("")
      setNewItemDescription("")
      setShowNewItemForm(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading item details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-lg font-semibold text-gray-900">Item Details</h1>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search..." className="pl-10 w-64" />
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsLiked(!isLiked)}>
                <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <Card className="overflow-hidden">
              <div className="aspect-square relative bg-gray-100">
                <Image
                  src={item.images[selectedImageIndex] || "/placeholder.svg"}
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
              </div>
            </Card>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {[...Array(4)].map((_, index) => (
                <Card
                  key={index}
                  className={`overflow-hidden cursor-pointer transition-all ${
                    selectedImageIndex === index ? "ring-2 ring-green-600" : ""
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <div className="aspect-square relative bg-gray-100">
                    <Image
                      src={item.images[index] || "/placeholder.svg"}
                      alt={`${item.title} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Title and Basic Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
                <Badge className="bg-green-100 text-green-800">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>
              <p className="text-gray-600 text-lg">{item.category?.name}</p>
            </div>

            {/* Price and Points */}
            <div className="flex items-center gap-4">
              <Badge className="bg-green-600 text-white px-4 py-2 text-lg">
                <Coins className="h-5 w-5 mr-2" />
                {item.points_value} Points
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-lg">
                Size {item.size}
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-lg">
                {item.condition}
              </Badge>
            </div>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3">Product Description</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>

            {/* Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Item Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Category:</span>
                    <p className="font-medium">{item.category?.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Size:</span>
                    <p className="font-medium">{item.size}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Condition:</span>
                    <p className="font-medium">{item.condition}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Points Value:</span>
                    <p className="font-medium">{item.points_value}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-gray-600">Tags:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Owner Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Owner Information</h3>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={item.user?.avatar_url || "/placeholder.svg"} alt={item.user?.full_name} />
                    <AvatarFallback>{item.user?.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-lg">{item.user?.full_name}</p>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>New York, NY</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Member since Jan 2024</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                      <span>4.8 (24 reviews)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 py-3"
                onClick={handleRequestSwap}
                disabled={item.user_id === user?.id}
              >
                <ArrowUpDown className="h-5 w-5 mr-2" />
                Request Swap
              </Button>
              <Button variant="outline" className="py-3 bg-transparent">
                <MessageCircle className="h-5 w-5 mr-2" />
                Message
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Swap Request Modal */}
      <Dialog open={showSwapModal} onOpenChange={setShowSwapModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request Swap</DialogTitle>
            <DialogDescription>
              Choose an item from your collection to offer in exchange for "{item?.title}"
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="my-items" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="my-items">My Items</TabsTrigger>
              <TabsTrigger value="add-new">Add New Item</TabsTrigger>
            </TabsList>

            <TabsContent value="my-items" className="space-y-4">
              {userItems.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {userItems.map((userItem) => (
                    <Card
                      key={userItem.id}
                      className={`cursor-pointer transition-all ${
                        selectedOwnItem === userItem.id ? "ring-2 ring-green-600" : ""
                      }`}
                      onClick={() => setSelectedOwnItem(userItem.id)}
                    >
                      <div className="aspect-square relative">
                        <Image
                          src={userItem.images[0] || "/placeholder.svg"}
                          alt={userItem.title}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                      </div>
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm line-clamp-1">{userItem.title}</h4>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-600">Size {userItem.size}</span>
                          <Badge variant="outline" className="text-xs">
                            {userItem.condition}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">You don't have any items listed yet</p>
                  <Button onClick={() => setShowNewItemForm(true)} variant="outline">
                    Add Your First Item
                  </Button>
                </div>
              )}

              {userItems.length > 0 && (
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSendSwapRequest}
                    disabled={!selectedOwnItem}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Send Swap Request
                  </Button>
                  <Button variant="outline" onClick={() => setShowSwapModal(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="add-new" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Item Title *</Label>
                  <Input
                    id="title"
                    value={newItemTitle}
                    onChange={(e) => setNewItemTitle(e.target.value)}
                    placeholder="e.g., Vintage Denim Jacket"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="size">Size *</Label>
                    <Select value={newItemSize} onValueChange={setNewItemSize}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {sizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="condition">Condition *</Label>
                    <Select value={newItemCondition} onValueChange={setNewItemCondition}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditions.map((condition) => (
                          <SelectItem key={condition} value={condition}>
                            {condition}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newItemDescription}
                    onChange={(e) => setNewItemDescription(e.target.value)}
                    placeholder="Describe your item..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Images</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload images</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleAddNewItem} className="flex-1 bg-green-600 hover:bg-green-700">
                    Add Item & Send Request
                  </Button>
                  <Button variant="outline" onClick={() => setShowSwapModal(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}
