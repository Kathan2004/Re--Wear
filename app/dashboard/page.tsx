"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { mockItems } from "@/lib/database"
import { Plus, Package, ArrowUpDown, Coins, TrendingUp, CheckCircle, Edit } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [userItems, setUserItems] = useState(mockItems.filter((item) => item.user_id === user?.id))
  const [userPurchases, setUserPurchases] = useState(mockItems.slice(0, 4)) // Mock purchases

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  const stats = [
    {
      title: "Total Points",
      value: user.points,
      icon: Coins,
      description: "Available for redemption",
    },
    {
      title: "Items Listed",
      value: userItems.length,
      icon: Package,
      description: "Currently active",
    },
    {
      title: "Successful Swaps",
      value: 5,
      icon: ArrowUpDown,
      description: "Completed exchanges",
    },
    {
      title: "Points Earned",
      value: 250,
      icon: TrendingUp,
      description: "Total lifetime earnings",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Dashboard</h1>
          <p className="text-gray-600">Manage your profile, items, and track your swaps</p>
        </div>

        {/* Profile Section */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Profile Picture */}
              <div className="flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.full_name} />
                  <AvatarFallback className="text-4xl">{user.full_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
              </div>

              {/* Profile Information */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" value={user.full_name} readOnly className="bg-gray-50" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" value={user.email} readOnly className="bg-gray-50" />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="New York, NY" className="bg-gray-50" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="+1 (555) 123-4567" className="bg-gray-50" />
                  </div>
                </div>

                {/* Bio Section */}
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself and your style preferences..."
                    rows={4}
                    className="bg-gray-50"
                  />
                </div>

                <div className="flex gap-3">
                  <Button className="bg-green-600 hover:bg-green-700">Save Changes</Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.description}</p>
                  </div>
                  <stat.icon className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* My Listings Section */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Listings</CardTitle>
              <CardDescription>Items you've listed for swap</CardDescription>
            </div>
            <Link href="/add-item">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {userItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {userItems.map((item) => (
                  <Link key={item.id} href={`/items/${item.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="aspect-square relative">
                        <Image
                          src={item.images[0] || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                        <Badge className="absolute top-2 right-2 bg-green-600">
                          <Coins className="h-3 w-3 mr-1" />
                          {item.points_value}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-sm line-clamp-1 mb-2">{item.title}</h3>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="text-xs">
                            {item.condition}
                          </Badge>
                          <span className="text-xs text-gray-600">Size {item.size}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No items listed yet</h3>
                <p className="text-gray-600 mb-4">Start by listing your first item to begin swapping</p>
                <Link href="/add-item">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    List Your First Item
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Purchases Section */}
        <Card>
          <CardHeader>
            <CardTitle>My Purchases</CardTitle>
            <CardDescription>Items you've acquired through swaps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {userPurchases.map((item) => (
                <Link key={item.id} href={`/items/${item.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="aspect-square relative">
                      <Image
                        src={item.images[0] || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-2 left-2 bg-blue-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Acquired
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm line-clamp-1 mb-2">{item.title}</h3>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-xs">
                          {item.condition}
                        </Badge>
                        <span className="text-xs text-gray-600">Size {item.size}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
