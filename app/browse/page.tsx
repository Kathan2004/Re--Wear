"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { getItems, getCategories, type Item, type Category } from "@/lib/database"
import { Search, Filter, Coins, ArrowUpDown, Shield, User, Upload, Star, MapPin, Package } from "lucide-react"
import Image from "next/image"

export default function SearchSwapPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  // State management
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSize, setSelectedSize] = useState("all")
  const [selectedCondition, setSelectedCondition] = useState("all")
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [allItems, setAllItems] = useState<Item[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [userItems, setUserItems] = useState<Item[]>([])
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [showItemModal, setShowItemModal] = useState(false)
  const [showSwapModal, setShowSwapModal] = useState(false)
  const [selectedOwnItem, setSelectedOwnItem] = useState<string>("")
  const [showNewItemForm, setShowNewItemForm] = useState(false)

  // New item form state
  const [newItemTitle, setNewItemTitle] = useState("")
  const [newItemSize, setNewItemSize] = useState("")
  const [newItemCondition, setNewItemCondition] = useState("")
  const [newItemDescription, setNewItemDescription] = useState("")

  // Filter options
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"]
  const conditions = ["Excellent", "Good", "Fair", "Poor"]
  const brands = ["Nike", "Adidas", "Zara", "H&M", "Vintage", "Other"]

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      const [itemsData, categoriesData] = await Promise.all([
        getItems({ status: "approved", is_available: true }),
        getCategories()
      ])
      
      setAllItems(itemsData)
      setCategories(categoriesData)
      
      // Filter user's own items
      if (user) {
        const userOwnItems = itemsData.filter((item) => item.user_id === user.id)
        setUserItems(userOwnItems)
      }
    }
    
    loadData()
  }, [user])

  // Filter items based on search and filters
  useEffect(() => {
    let filtered = allItems.filter((item) => item.status === "approved" && item.is_available)

    // Search query
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category_id === selectedCategory)
    }

    // Size filter
    if (selectedSize !== "all") {
      filtered = filtered.filter((item) => item.size === selectedSize)
    }

    // Condition filter
    if (selectedCondition !== "all") {
      filtered = filtered.filter((item) => item.condition === selectedCondition)
    }

    setFilteredItems(filtered)
  }, [searchQuery, selectedCategory, selectedSize, selectedCondition, selectedBrand, allItems])

  const handleItemClick = (item: Item) => {
    setSelectedItem(item)
    setShowItemModal(true)
  }

  const handleRequestSwap = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to request swaps",
        variant: "destructive",
      })
      return
    }
    setShowItemModal(false)
    setShowSwapModal(true)
  }

  const handleSendSwapRequest = async () => {
    if (!selectedItem || !selectedOwnItem || !user) {
      toast({
        title: "Selection Required",
        description: "Please select an item to offer for swap",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch('/api/swap/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requester_id: user.id,
          owner_id: selectedItem.user_id,
          requested_item_id: selectedItem.id,
          offered_item_id: selectedOwnItem,
          message: `I'd like to swap my item for your "${selectedItem.title}"`
        }),
      })

      if (response.ok) {
        toast({
          title: "Swap Request Sent!",
          description: `Your swap request for "${selectedItem.title}" has been sent successfully.`,
        })

        setShowSwapModal(false)
        setSelectedOwnItem("")
      } else {
        throw new Error('Failed to send request')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send swap request. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddNewItem = async () => {
    if (!newItemTitle || !newItemSize || !newItemCondition || !user) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newItemTitle,
          description: newItemDescription,
          category_id: "1", // Default to T-Shirts
          user_id: user.id,
          size: newItemSize,
          condition: newItemCondition,
          brand: "Other",
          points_required: 50,
          tags: [],
          status: "pending",
          is_available: true,
          featured: false,
          image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop"
        }),
      })

      if (response.ok) {
        const newItem = await response.json()
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
        
        // Refresh items list
        const itemsData = await getItems({ status: "approved", is_available: true })
        setAllItems(itemsData)
        if (user) {
          const userOwnItems = itemsData.filter((item) => item.user_id === user.id)
          setUserItems(userOwnItems)
        }
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add item')
      }
    } catch (error) {
      console.error('Error adding item:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add item. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse & Swap</h1>
              <p className="text-gray-600">Discover amazing pieces and start swapping sustainably</p>
            </div>
            {user && (
              <Button onClick={() => setShowNewItemForm(true)} className="bg-green-600 hover:bg-green-700">
                <Upload className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search items, brands, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sizes</SelectItem>
                    {sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                  <SelectTrigger>
                    <SelectValue placeholder="Condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Conditions</SelectItem>
                    {conditions.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleItemClick(item)}>
              <CardContent className="p-0">
                <div className="relative">
                  <Image
                    src={item.image_url || "/placeholder.jpg"}
                    alt={item.title}
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover"
                  />
                  <Badge className="absolute top-2 right-2" variant="secondary">
                    {item.condition}
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={item.user?.avatar_url} />
                        <AvatarFallback>{item.user?.full_name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-500">{item.user?.full_name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">{item.points_required}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Item Detail Modal */}
        <Dialog open={showItemModal} onOpenChange={setShowItemModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedItem?.title}</DialogTitle>
              <DialogDescription>{selectedItem?.description}</DialogDescription>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-4">
                <div className="relative">
                  <Image
                    src={selectedItem.image_url || "/placeholder.jpg"}
                    alt={selectedItem.title}
                    width={400}
                    height={400}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <Badge className="absolute top-2 right-2" variant="secondary">
                    {selectedItem.condition}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Size</Label>
                    <p className="text-sm text-gray-600">{selectedItem.size}</p>
                  </div>
                  <div>
                    <Label>Brand</Label>
                    <p className="text-sm text-gray-600">{selectedItem.brand}</p>
                  </div>
                  <div>
                    <Label>Points Required</Label>
                    <p className="text-sm text-gray-600">{selectedItem.points_required}</p>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <p className="text-sm text-gray-600">{categories.find(c => c.id === selectedItem.category_id)?.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={selectedItem.user?.avatar_url} />
                    <AvatarFallback>{selectedItem.user?.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedItem.user?.full_name}</p>
                    <p className="text-sm text-gray-500">Member since {new Date(selectedItem.user?.created_at || '').getFullYear()}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleRequestSwap} className="flex-1">
                    Request Swap
                  </Button>
                  <Button variant="outline" onClick={() => setShowItemModal(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Swap Request Modal */}
        <Dialog open={showSwapModal} onOpenChange={setShowSwapModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Swap</DialogTitle>
              <DialogDescription>
                Select one of your items to offer in exchange for "{selectedItem?.title}"
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Select value={selectedOwnItem} onValueChange={setSelectedOwnItem}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your item to offer" />
                </SelectTrigger>
                <SelectContent>
                  {userItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.title}
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

        {/* Add New Item Modal */}
        <Dialog open={showNewItemForm} onOpenChange={setShowNewItemForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
              <DialogDescription>
                List a new item for the community to discover
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
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
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleAddNewItem} className="flex-1">
                  Add Item
                </Button>
                <Button variant="outline" onClick={() => setShowNewItemForm(false)}>
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
