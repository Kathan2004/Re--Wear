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
import { mockItems, mockCategories, type Item } from "@/lib/database"
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
  const [filteredItems, setFilteredItems] = useState<Item[]>(mockItems)
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

  // User's own items (mock data filtered by current user)
  const userItems = mockItems.filter((item) => item.user_id === user?.id)

  // Filter items based on search and filters
  useEffect(() => {
    let filtered = mockItems.filter((item) => item.status === "approved" && item.is_available)

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
  }, [searchQuery, selectedCategory, selectedSize, selectedCondition, selectedBrand])

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
    if (!selectedItem || !selectedOwnItem) {
      toast({
        title: "Selection Required",
        description: "Please select an item to offer for swap",
        variant: "destructive",
      })
      return
    }

    // Mock API call
    try {
      const swapRequest = {
        fromUser: user?.id,
        toUser: selectedItem.user_id,
        requestedItem: selectedItem.id,
        offeredItem: selectedOwnItem,
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Swap Request Sent!",
        description: `Your swap request for "${selectedItem.title}" has been sent successfully.`,
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

    // Mock API call to add new item
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse & Swap</h1>
          <p className="text-gray-600">Discover amazing pieces and start swapping sustainably</p>
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
                    {mockCategories.map((category) => (
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
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""} found
          </p>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleItemClick(item)}
            >
              <div className="aspect-square relative">
                <Image src={item.images[0] || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                {item.featured && (
                  <Badge className="absolute top-2 left-2 bg-yellow-500 hover:bg-yellow-600">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
                <Badge className="absolute top-2 right-2 bg-green-600 hover:bg-green-700">
                  <Coins className="h-3 w-3 mr-1" />
                  {item.points_value}
                </Badge>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">{item.title}</h3>

                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{item.condition}</Badge>
                  <span className="text-sm text-gray-600">Size {item.size}</span>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={item.user?.avatar_url || "/placeholder.svg"} alt={item.user?.full_name} />
                      <AvatarFallback className="text-xs">{item.user?.full_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600">{item.user?.full_name}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Item Detail Modal */}
      <Dialog open={showItemModal} onOpenChange={setShowItemModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedItem && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={selectedItem.images[0] || "/placeholder.svg"}
                    alt={selectedItem.title}
                    fill
                    className="object-cover"
                  />
                </div>
                {selectedItem.images.length > 1 && (
                  <div className="flex gap-2">
                    {selectedItem.images.slice(1, 4).map((image, index) => (
                      <div key={index} className="aspect-square w-20 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${selectedItem.title} ${index + 2}`}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Item Details */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold">{selectedItem.title}</h2>
                    <Badge className="bg-green-100 text-green-800">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  <p className="text-gray-600">{selectedItem.category?.name}</p>
                </div>

                <div className="flex items-center gap-4">
                  <Badge className="bg-green-600 text-white px-3 py-1">
                    <Coins className="h-4 w-4 mr-1" />
                    {selectedItem.points_value} Points
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    Size {selectedItem.size}
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    {selectedItem.condition}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">{selectedItem.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.tags.map((tag) => (
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
                        src={selectedItem.user?.avatar_url || "/placeholder.svg"}
                        alt={selectedItem.user?.full_name}
                      />
                      <AvatarFallback>{selectedItem.user?.full_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedItem.user?.full_name}</p>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>New York, NY</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={handleRequestSwap}
                    disabled={selectedItem.user_id === user?.id}
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
          )}
        </DialogContent>
      </Dialog>

      {/* Swap Request Modal */}
      <Dialog open={showSwapModal} onOpenChange={setShowSwapModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request Swap</DialogTitle>
            <DialogDescription>
              Choose an item from your collection to offer in exchange for "{selectedItem?.title}"
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
                  {userItems.map((item) => (
                    <Card
                      key={item.id}
                      className={`cursor-pointer transition-all ${
                        selectedOwnItem === item.id ? "ring-2 ring-green-600" : ""
                      }`}
                      onClick={() => setSelectedOwnItem(item.id)}
                    >
                      <div className="aspect-square relative">
                        <Image
                          src={item.images[0] || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                      </div>
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-600">Size {item.size}</span>
                          <Badge variant="outline" className="text-xs">
                            {item.condition}
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
