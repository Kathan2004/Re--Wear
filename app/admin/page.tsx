"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { mockSellers, mockCommissions, type Seller } from "@/lib/admin-database"
import {
  Users,
  DollarSign,
  TrendingUp,
  Package,
  Shield,
  Ban,
  CheckCircle,
  Search,
  Calendar,
  MapPin,
  Star,
  AlertTriangle,
  Eye,
} from "lucide-react"

export default function AdminPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [sellers, setSellers] = useState<Seller[]>(mockSellers)
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null)
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [showSellerModal, setShowSellerModal] = useState(false)
  const [blockReason, setBlockReason] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check admin authentication
    const adminAuth = localStorage.getItem("admin_authenticated")
    if (!adminAuth) {
      router.push("/admin-auth")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated")
    router.push("/admin-auth")
  }

  const handleBlockSeller = (seller: Seller) => {
    setSelectedSeller(seller)
    setShowBlockModal(true)
  }

  const handleViewSeller = (seller: Seller) => {
    setSelectedSeller(seller)
    setShowSellerModal(true)
  }

  const confirmBlockSeller = async () => {
    if (!selectedSeller || !blockReason.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a reason for blocking this seller",
        variant: "destructive",
      })
      return
    }

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update seller status
      setSellers((prev) =>
        prev.map((seller) =>
          seller.id === selectedSeller.id
            ? {
                ...seller,
                status: "blocked" as const,
                block_reason: blockReason,
                blocked_at: new Date().toISOString(),
              }
            : seller,
        ),
      )

      toast({
        title: "Seller Blocked",
        description: `${selectedSeller.business_name} has been blocked successfully.`,
      })

      setShowBlockModal(false)
      setSelectedSeller(null)
      setBlockReason("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to block seller. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUnblockSeller = async (seller: Seller) => {
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update seller status
      setSellers((prev) =>
        prev.map((s) =>
          s.id === seller.id
            ? {
                ...s,
                status: "active" as const,
                block_reason: undefined,
                blocked_at: undefined,
              }
            : s,
        ),
      )

      toast({
        title: "Seller Unblocked",
        description: `${seller.business_name} has been unblocked successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unblock seller. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Filter sellers based on search and status
  const filteredSellers = sellers.filter((seller) => {
    const matchesSearch =
      seller.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.owner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || seller.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const stats = [
    {
      title: "Total Sellers",
      value: sellers.length,
      icon: Users,
      description: "Registered businesses",
      color: "text-blue-600",
    },
    {
      title: "Active Sellers",
      value: sellers.filter((s) => s.status === "active").length,
      icon: CheckCircle,
      description: "Currently active",
      color: "text-green-600",
    },
    {
      title: "Total Commission",
      value: `$${mockCommissions.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}`,
      icon: DollarSign,
      description: "This month",
      color: "text-green-600",
    },
    {
      title: "Blocked Sellers",
      value: sellers.filter((s) => s.status === "blocked").length,
      icon: Ban,
      description: "Suspended accounts",
      color: "text-red-600",
    },
  ]

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header - now this will be at the very top */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">ReWear Admin</h1>
            </div>

            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage sellers, monitor commissions, and oversee platform operations</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sellers">Sellers Management</TabsTrigger>
            <TabsTrigger value="commissions">Commissions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-gray-500">{stat.description}</p>
                      </div>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activities and seller updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sellers.slice(0, 5).map((seller) => (
                    <div key={seller.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={seller.logo_url || "/placeholder.svg"} alt={seller.business_name} />
                          <AvatarFallback>{seller.business_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{seller.business_name}</p>
                          <p className="text-sm text-gray-600">
                            Joined {new Date(seller.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          seller.status === "active"
                            ? "default"
                            : seller.status === "blocked"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {seller.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sellers Management Tab */}
          <TabsContent value="sellers" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Search sellers by name, business, or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Sellers List */}
            <Card>
              <CardHeader>
                <CardTitle>Sellers ({filteredSellers.length})</CardTitle>
                <CardDescription>Manage all sellers on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredSellers.map((seller) => (
                    <div key={seller.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={seller.logo_url || "/placeholder.svg"} alt={seller.business_name} />
                          <AvatarFallback>{seller.business_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{seller.business_name}</h3>
                            <Badge
                              variant={
                                seller.status === "active"
                                  ? "default"
                                  : seller.status === "blocked"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {seller.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600">
                            {seller.owner_name} • {seller.email}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {seller.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Package className="h-4 w-4" />
                              {seller.total_items} items
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4" />
                              {seller.rating}/5
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Joined {new Date(seller.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          {seller.block_reason && (
                            <div className="mt-2 p-2 bg-red-50 rounded border-l-4 border-red-400">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                <span className="text-sm font-medium text-red-800">Blocked:</span>
                              </div>
                              <p className="text-sm text-red-700 mt-1">{seller.block_reason}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewSeller(seller)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        {seller.status === "blocked" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnblockSeller(seller)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Unblock
                          </Button>
                        ) : (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleBlockSeller(seller)}
                            disabled={seller.status === "blocked"}
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Block
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {filteredSellers.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No sellers found</h3>
                    <p className="text-gray-600">Try adjusting your search or filters</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Commissions Tab */}
          <TabsContent value="commissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Commission Overview</CardTitle>
                <CardDescription>Track platform earnings and commission details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        ${mockCommissions.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
                      </div>
                      <div className="text-gray-600">Total Commission</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        ${(mockCommissions.reduce((sum, c) => sum + c.amount, 0) / mockCommissions.length).toFixed(0)}
                      </div>
                      <div className="text-gray-600">Average per Transaction</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Package className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                      <div className="text-3xl font-bold text-gray-900 mb-2">{mockCommissions.length}</div>
                      <div className="text-gray-600">Total Transactions</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Recent Commissions</h3>
                  {mockCommissions.map((commission) => (
                    <div key={commission.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg" alt={commission.seller_name} />
                          <AvatarFallback>{commission.seller_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{commission.seller_name}</p>
                          <p className="text-sm text-gray-600">{commission.transaction_type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">${commission.amount}</p>
                        <p className="text-sm text-gray-500">{new Date(commission.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Block Seller Modal */}
      <Dialog open={showBlockModal} onOpenChange={setShowBlockModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Block Seller</DialogTitle>
            <DialogDescription>
              You are about to block {selectedSeller?.business_name}. Please provide a reason for this action.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="blockReason">Reason for blocking *</Label>
              <Textarea
                id="blockReason"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="Enter the reason for blocking this seller..."
                rows={4}
                className="mt-2"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={confirmBlockSeller}
                variant="destructive"
                className="flex-1"
                disabled={!blockReason.trim()}
              >
                <Ban className="h-4 w-4 mr-2" />
                Block Seller
              </Button>
              <Button variant="outline" onClick={() => setShowBlockModal(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Seller Modal */}
      <Dialog open={showSellerModal} onOpenChange={setShowSellerModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedSeller && (
            <div>
              <DialogHeader>
                <DialogTitle>Seller Details</DialogTitle>
                <DialogDescription>Complete information about {selectedSeller.business_name}</DialogDescription>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                {/* Business Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Business Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={selectedSeller.logo_url || "/placeholder.svg"}
                          alt={selectedSeller.business_name}
                        />
                        <AvatarFallback className="text-xl">{selectedSeller.business_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{selectedSeller.business_name}</h3>
                        <p className="text-gray-600">{selectedSeller.business_type}</p>
                        <Badge
                          variant={
                            selectedSeller.status === "active"
                              ? "default"
                              : selectedSeller.status === "blocked"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {selectedSeller.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Owner:</span>
                        <span>{selectedSeller.owner_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span>{selectedSeller.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span>{selectedSeller.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span>{selectedSeller.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Joined:</span>
                        <span>{new Date(selectedSeller.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Items:</span>
                        <span className="font-semibold">{selectedSeller.total_items}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Sales:</span>
                        <span className="font-semibold">{selectedSeller.total_sales}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Rating:</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{selectedSeller.rating}/5</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Commission Paid:</span>
                        <span className="font-semibold text-green-600">${selectedSeller.commission_paid}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {selectedSeller.description && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Business Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{selectedSeller.description}</p>
                  </CardContent>
                </Card>
              )}

              {selectedSeller.block_reason && (
                <Card className="mt-6 border-red-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-red-800">Block Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <span className="font-medium text-red-800">
                          Blocked on{" "}
                          {selectedSeller.blocked_at ? new Date(selectedSeller.blocked_at).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                      <p className="text-red-700">{selectedSeller.block_reason}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
