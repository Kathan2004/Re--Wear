"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { getSwapRequests, type SwapRequest } from "@/lib/database"
import { ArrowUpDown, Check, X, Package, Clock, MessageCircle, MapPin } from "lucide-react"
import Image from "next/image"

export default function RequestsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [incoming, setIncoming] = useState<SwapRequest[]>([])
  const [outgoing, setOutgoing] = useState<SwapRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<SwapRequest | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const requests = await getSwapRequests()
        
        if (user) {
          const incomingRequests = requests.filter((req) => req.owner_id === user.id)
          const outgoingRequests = requests.filter((req) => req.requester_id === user.id)
          
          setIncoming(incomingRequests)
          setOutgoing(outgoingRequests)
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading requests:', error)
        setIsLoading(false)
      }
    }
    
    loadRequests()
  }, [user])

  const handleAccept = async (requestId: string) => {
    try {
      const response = await fetch(`/api/swap/${requestId}/accept`, {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Request Accepted!",
          description: "The swap request has been accepted successfully.",
        })
        // Refresh requests
        const requests = await getSwapRequests()
        if (user) {
          const incomingRequests = requests.filter((req) => req.owner_id === user.id)
          const outgoingRequests = requests.filter((req) => req.requester_id === user.id)
          setIncoming(incomingRequests)
          setOutgoing(outgoingRequests)
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to accept the request. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept the request. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (requestId: string) => {
    try {
      const response = await fetch(`/api/swap/${requestId}/reject`, {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Request Rejected",
          description: "The swap request has been rejected.",
        })
        // Refresh requests
        const requests = await getSwapRequests()
        if (user) {
          const incomingRequests = requests.filter((req) => req.owner_id === user.id)
          const outgoingRequests = requests.filter((req) => req.requester_id === user.id)
          setIncoming(incomingRequests)
          setOutgoing(outgoingRequests)
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to reject the request. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject the request. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "accepted":
        return <Badge className="bg-green-600">Accepted</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "shipped":
        return <Badge className="bg-blue-600">Shipped</Badge>
      case "completed":
        return <Badge className="bg-green-600">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "accepted":
        return <Check className="h-4 w-4" />
      case "rejected":
        return <X className="h-4 w-4" />
      case "shipped":
        return <Package className="h-4 w-4" />
      case "completed":
        return <Check className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to view your requests.</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading requests...</p>
        </div>
      </div>
    )
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
          <TabsList>
            <TabsTrigger value="incoming">
              Incoming ({incoming.length})
            </TabsTrigger>
            <TabsTrigger value="outgoing">
              Outgoing ({outgoing.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="incoming" className="space-y-4">
            {incoming.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <ArrowUpDown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No incoming requests</h3>
                  <p className="text-gray-600">You don't have any pending swap requests at the moment.</p>
                </CardContent>
              </Card>
            ) : (
              incoming.map((request) => (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex space-x-4">
                        <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={request.requested_item?.image_url || "/placeholder.jpg"}
                            alt={request.requested_item?.title || "Item"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg">{request.requested_item?.title}</h3>
                            {getStatusBadge(request.status)}
                          </div>
                          <p className="text-gray-600 mb-2">
                            Requested by {request.requester?.full_name}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{new Date(request.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>Mumbai, India</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request)
                            setShowDetailModal(true)
                          }}
                        >
                          View Details
                        </Button>
                        {request.status === "pending" && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleAccept(request.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(request.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="outgoing" className="space-y-4">
            {outgoing.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <ArrowUpDown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No outgoing requests</h3>
                  <p className="text-gray-600">You haven't sent any swap requests yet.</p>
                </CardContent>
              </Card>
            ) : (
              outgoing.map((request) => (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex space-x-4">
                        <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={request.requested_item?.image_url || "/placeholder.jpg"}
                            alt={request.requested_item?.title || "Item"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg">{request.requested_item?.title}</h3>
                            {getStatusBadge(request.status)}
                          </div>
                          <p className="text-gray-600 mb-2">
                            Owner: {request.owner?.full_name}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{new Date(request.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>Delhi, India</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request)
                            setShowDetailModal(true)
                          }}
                        >
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Request Detail Modal */}
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Swap Request Details</DialogTitle>
              <DialogDescription>
                Detailed information about this swap request
              </DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Requested Item</h4>
                    <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={selectedRequest.requested_item?.image_url || "/placeholder.jpg"}
                        alt={selectedRequest.requested_item?.title || "Item"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="mt-2 font-medium">{selectedRequest.requested_item?.title}</p>
                    <p className="text-sm text-gray-600">{selectedRequest.requested_item?.description}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Offered Item</h4>
                    <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={selectedRequest.offered_item?.image_url || "/placeholder.jpg"}
                        alt={selectedRequest.offered_item?.title || "Item"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="mt-2 font-medium">{selectedRequest.offered_item?.title}</p>
                    <p className="text-sm text-gray-600">{selectedRequest.offered_item?.description}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Request Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Requested:</span>
                      <p className="mt-1">{new Date(selectedRequest.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Requester:</span>
                      <p className="mt-1">{selectedRequest.requester?.full_name}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Owner:</span>
                      <p className="mt-1">{selectedRequest.owner?.full_name}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
