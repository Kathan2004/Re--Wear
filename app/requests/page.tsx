"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { mockSwapRequests, type SwapRequest } from "@/lib/database"
import { Clock, CheckCircle, XCircle, Package, Truck, MapPin, ArrowUpDown, Coins, Calendar, User } from "lucide-react"

export default function RequestsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [incomingRequests, setIncomingRequests] = useState<SwapRequest[]>([])
  const [outgoingRequests, setOutgoingRequests] = useState<SwapRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<SwapRequest | null>(null)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [showShippingModal, setShowShippingModal] = useState(false)
  const [shippingMethod, setShippingMethod] = useState<"pickup" | "courier">("courier")
  const [shippingAddress, setShippingAddress] = useState("")
  const [responseMessage, setResponseMessage] = useState("")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      // Filter requests based on user role
      const incoming = mockSwapRequests.filter((req) => req.owner_id === user.id)
      const outgoing = mockSwapRequests.filter((req) => req.requester_id === user.id)
      setIncomingRequests(incoming)
      setOutgoingRequests(outgoing)
    }
  }, [user])

  const handleViewRequest = (request: SwapRequest) => {
    setSelectedRequest(request)
    setShowRequestModal(true)
  }

  const handleAcceptRequest = async (requestId: string) => {
    try {
      // Mock API call to accept request
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update request status
      setIncomingRequests((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, status: "accepted" as const } : req)),
      )

      toast({
        title: "Request Accepted!",
        description: "The swap request has been accepted. You can now arrange shipping.",
      })

      setShowRequestModal(false)
      setSelectedRequest(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept request. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    try {
      // Mock API call to reject request
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update request status
      setIncomingRequests((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, status: "rejected" as const } : req)),
      )

      toast({
        title: "Request Rejected",
        description: "The swap request has been rejected.",
      })

      setShowRequestModal(false)
      setSelectedRequest(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject request. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleArrangeShipping = (request: SwapRequest) => {
    setSelectedRequest(request)
    setShowShippingModal(true)
  }

  const handleConfirmShipping = async () => {
    if (!selectedRequest) return

    try {
      // Mock API call to update shipping details
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update request with shipping details
      const updatedRequests = incomingRequests.map((req) =>
        req.id === selectedRequest.id
          ? {
              ...req,
              shipping_method: shippingMethod,
              shipping_address: shippingMethod === "courier" ? shippingAddress : undefined,
              status: "shipped" as const,
            }
          : req,
      )
      setIncomingRequests(updatedRequests)

      toast({
        title: "Shipping Arranged!",
        description: `Shipping method set to ${shippingMethod}. Both parties have been notified.`,
      })

      setShowShippingModal(false)
      setSelectedRequest(null)
      setShippingAddress("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to arrange shipping. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: SwapRequest["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "accepted":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Accepted
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      case "shipped":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Truck className="h-3 w-3 mr-1" />
            Shipped
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-purple-100 text-purple-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Swap Requests</h1>
          <p className="text-gray-600">Manage your incoming and outgoing swap requests</p>
        </div>

        <Tabs defaultValue="incoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="incoming">Incoming Requests ({incomingRequests.length})</TabsTrigger>
            <TabsTrigger value="outgoing">Outgoing Requests ({outgoingRequests.length})</TabsTrigger>
          </TabsList>

          {/* Incoming Requests */}
          <TabsContent value="incoming" className="space-y-6">
            {incomingRequests.length > 0 ? (
              <div className="space-y-4">
                {incomingRequests.map((request) => (
                  <Card key={request.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={request.requester?.avatar_url || "/placeholder.svg"}
                              alt={request.requester?.full_name}
                            />
                            <AvatarFallback>{request.requester?.full_name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-lg">{request.requester?.full_name}</h3>
                            <p className="text-gray-600 text-sm">wants to swap with you</p>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(request.created_at)}
                            </div>
                          </div>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mb-4">
                        {/* Requested Item */}
                        <div>
                          <h4 className="font-medium text-sm text-gray-600 mb-2">They want your:</h4>
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-16 h-16 relative">
                              <Image
                                src={request.requested_item?.images[0] || "/placeholder.svg"}
                                alt={request.requested_item?.title || ""}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium">{request.requested_item?.title}</h5>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {request.requested_item?.condition}
                                </Badge>
                                <span className="text-xs text-gray-600">Size {request.requested_item?.size}</span>
                              </div>
                              <div className="flex items-center text-sm text-green-600 mt-1">
                                <Coins className="h-3 w-3 mr-1" />
                                {request.requested_item?.points_value} points
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Offered Item */}
                        <div>
                          <h4 className="font-medium text-sm text-gray-600 mb-2">They're offering:</h4>
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-16 h-16 relative">
                              <Image
                                src={request.offered_item?.images[0] || "/placeholder.svg"}
                                alt={request.offered_item?.title || ""}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium">{request.offered_item?.title}</h5>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {request.offered_item?.condition}
                                </Badge>
                                <span className="text-xs text-gray-600">Size {request.offered_item?.size}</span>
                              </div>
                              <div className="flex items-center text-sm text-green-600 mt-1">
                                <Coins className="h-3 w-3 mr-1" />
                                {request.offered_item?.points_value} points
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {request.message && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-sm text-gray-600 mb-1">Message:</h4>
                          <p className="text-sm text-gray-700">{request.message}</p>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewRequest(request)}
                          className="bg-transparent"
                        >
                          <User className="h-4 w-4 mr-2" />
                          View Details
                        </Button>

                        {request.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleAcceptRequest(request.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Accept
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleRejectRequest(request.id)}>
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        )}

                        {request.status === "accepted" && (
                          <Button
                            size="sm"
                            onClick={() => handleArrangeShipping(request)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Truck className="h-4 w-4 mr-2" />
                            Arrange Shipping
                          </Button>
                        )}

                        {request.status === "shipped" && (
                          <Badge className="bg-blue-100 text-blue-800">
                            <Truck className="h-3 w-3 mr-1" />
                            Shipping arranged via {request.shipping_method}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No incoming requests</h3>
                  <p className="text-gray-600">When someone wants to swap with your items, they'll appear here.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Outgoing Requests */}
          <TabsContent value="outgoing" className="space-y-6">
            {outgoingRequests.length > 0 ? (
              <div className="space-y-4">
                {outgoingRequests.map((request) => (
                  <Card key={request.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={request.owner?.avatar_url || "/placeholder.svg"}
                              alt={request.owner?.full_name}
                            />
                            <AvatarFallback>{request.owner?.full_name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-lg">Request to {request.owner?.full_name}</h3>
                            <p className="text-gray-600 text-sm">Swap request sent</p>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(request.created_at)}
                            </div>
                          </div>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mb-4">
                        {/* Requested Item */}
                        <div>
                          <h4 className="font-medium text-sm text-gray-600 mb-2">You want:</h4>
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-16 h-16 relative">
                              <Image
                                src={request.requested_item?.images[0] || "/placeholder.svg"}
                                alt={request.requested_item?.title || ""}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium">{request.requested_item?.title}</h5>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {request.requested_item?.condition}
                                </Badge>
                                <span className="text-xs text-gray-600">Size {request.requested_item?.size}</span>
                              </div>
                              <div className="flex items-center text-sm text-green-600 mt-1">
                                <Coins className="h-3 w-3 mr-1" />
                                {request.requested_item?.points_value} points
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Offered Item */}
                        <div>
                          <h4 className="font-medium text-sm text-gray-600 mb-2">You're offering:</h4>
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-16 h-16 relative">
                              <Image
                                src={request.offered_item?.images[0] || "/placeholder.svg"}
                                alt={request.offered_item?.title || ""}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium">{request.offered_item?.title}</h5>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {request.offered_item?.condition}
                                </Badge>
                                <span className="text-xs text-gray-600">Size {request.offered_item?.size}</span>
                              </div>
                              <div className="flex items-center text-sm text-green-600 mt-1">
                                <Coins className="h-3 w-3 mr-1" />
                                {request.offered_item?.points_value} points
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {request.message && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-sm text-gray-600 mb-1">Your message:</h4>
                          <p className="text-sm text-gray-700">{request.message}</p>
                        </div>
                      )}

                      {request.status === "shipped" && (
                        <div className="mb-4 p-3 bg-green-50 rounded-lg">
                          <h4 className="font-medium text-sm text-gray-600 mb-1">Shipping Details:</h4>
                          <p className="text-sm text-gray-700">
                            Method: {request.shipping_method === "pickup" ? "Physical Pickup" : "Courier Service"}
                          </p>
                          {request.shipping_address && (
                            <p className="text-sm text-gray-700">Address: {request.shipping_address}</p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <ArrowUpDown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No outgoing requests</h3>
                  <p className="text-gray-600">Start browsing items to send your first swap request!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Request Details Modal */}
      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedRequest && (
            <div>
              <DialogHeader>
                <DialogTitle>Swap Request Details</DialogTitle>
                <DialogDescription>
                  Review the complete details of this swap request from {selectedRequest.requester?.full_name}
                </DialogDescription>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                {/* Requester Profile */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Requester Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={selectedRequest.requester?.avatar_url || "/placeholder.svg"}
                          alt={selectedRequest.requester?.full_name}
                        />
                        <AvatarFallback className="text-xl">
                          {selectedRequest.requester?.full_name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{selectedRequest.requester?.full_name}</h3>
                        <p className="text-gray-600">{selectedRequest.requester?.email}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          New York, NY
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Member since:</span>
                        <span>Jan 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Successful swaps:</span>
                        <span>12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rating:</span>
                        <span>4.8/5 ⭐</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Item Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Item Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm text-gray-600 mb-2">Your item:</h4>
                        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                          <div className="w-12 h-12 relative">
                            <Image
                              src={selectedRequest.requested_item?.images[0] || "/placeholder.svg"}
                              alt={selectedRequest.requested_item?.title || ""}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div>
                            <h5 className="font-medium">{selectedRequest.requested_item?.title}</h5>
                            <p className="text-sm text-gray-600">
                              {selectedRequest.requested_item?.points_value} points
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm text-gray-600 mb-2">Their item:</h4>
                        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                          <div className="w-12 h-12 relative">
                            <Image
                              src={selectedRequest.offered_item?.images[0] || "/placeholder.svg"}
                              alt={selectedRequest.offered_item?.title || ""}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div>
                            <h5 className="font-medium">{selectedRequest.offered_item?.title}</h5>
                            <p className="text-sm text-gray-600">{selectedRequest.offered_item?.points_value} points</p>
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm">
                          Value difference:{" "}
                          {Math.abs(
                            (selectedRequest.requested_item?.points_value || 0) -
                              (selectedRequest.offered_item?.points_value || 0),
                          )}{" "}
                          points
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {selectedRequest.message && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Message from Requester</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{selectedRequest.message}</p>
                  </CardContent>
                </Card>
              )}

              {selectedRequest.status === "pending" && (
                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={() => handleAcceptRequest(selectedRequest.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept Swap Request
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleRejectRequest(selectedRequest.id)}
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Request
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Shipping Arrangement Modal */}
      <Dialog open={showShippingModal} onOpenChange={setShowShippingModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Arrange Shipping</DialogTitle>
            <DialogDescription>
              Choose how you'd like to exchange items with {selectedRequest?.requester?.full_name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            <div>
              <Label className="text-base font-medium">Shipping Method</Label>
              <Select value={shippingMethod} onValueChange={(value: "pickup" | "courier") => setShippingMethod(value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pickup">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Physical Pickup (Meet in person)
                    </div>
                  </SelectItem>
                  <SelectItem value="courier">
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 mr-2" />
                      Courier Service (Ship via mail)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {shippingMethod === "pickup" && (
              <Card className="bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Physical Pickup</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        You and {selectedRequest?.requester?.full_name} will arrange to meet in person to exchange
                        items. This is often the most convenient and eco-friendly option.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {shippingMethod === "courier" && (
              <div className="space-y-4">
                <Card className="bg-orange-50">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Truck className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-orange-900">Courier Service</h4>
                        <p className="text-sm text-orange-700 mt-1">
                          Items will be shipped via postal service. Both parties are responsible for their own shipping
                          costs.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <Label htmlFor="address">Shipping Address</Label>
                  <Textarea
                    id="address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Enter the address where items should be shipped..."
                    rows={3}
                    className="mt-2"
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="message">Additional Message (Optional)</Label>
              <Textarea
                id="message"
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder="Add any additional instructions or messages..."
                rows={3}
                className="mt-2"
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={handleConfirmShipping} className="flex-1 bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Shipping Arrangement
              </Button>
              <Button variant="outline" onClick={() => setShowShippingModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
