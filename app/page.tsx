"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ItemCard } from "@/components/item-card"
import { getItems, type Item } from "@/lib/database"
import { Recycle, Users, Leaf, ArrowRight, Heart, Coins } from "lucide-react"

export default function HomePage() {
  const [featuredItems, setFeaturedItems] = useState<Item[]>([])

  useEffect(() => {
    const loadFeaturedItems = async () => {
      const items = await getItems({ featured: true, limit: 6 })
      setFeaturedItems(items)
    }
    loadFeaturedItems()
  }, [])

  const stats = [
    { label: "Items Exchanged", value: "12,543", icon: Recycle },
    { label: "Active Users", value: "3,247", icon: Users },
    { label: "CO₂ Saved (kg)", value: "8,921", icon: Leaf },
  ]

  const features = [
    {
      icon: Recycle,
      title: "Direct Swaps",
      description: "Exchange items directly with other users in your community",
    },
    {
      icon: Coins,
      title: "Points System",
      description: "Earn points by listing items and redeem them for clothes you love",
    },
    {
      icon: Heart,
      title: "Sustainable Fashion",
      description: "Reduce textile waste and promote circular fashion economy",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Swap, Share,
                <span className="text-green-600"> Sustain</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Join the ReWear community and give your unused clothes a new life. Exchange directly with others or use
                our points system to find your next favorite outfit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/browse">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                    Start Swapping
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/add-item">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                    List an Item
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Card className="overflow-hidden">
                    <Image
                      src="/hero-1.jpg"
                      alt="Sustainable fashion"
                      width={200}
                      height={200}
                      className="w-full object-cover"
                    />
                  </Card>
                  <Card className="overflow-hidden">
                    <Image
                      src="/hero-2.jpg"
                      alt="Clothing exchange"
                      width={200}
                      height={150}
                      className="w-full object-cover"
                    />
                  </Card>
                </div>
                <div className="space-y-4 pt-8">
                  <Card className="overflow-hidden">
                    <Image
                      src="/hero-3.jpg"
                      alt="Community sharing"
                      width={200}
                      height={150}
                      className="w-full object-cover"
                    />
                  </Card>
                  <Card className="overflow-hidden">
                    <Image
                      src="/hero-4.jpg"
                      alt="Eco-friendly fashion"
                      width={200}
                      height={200}
                      className="w-full object-cover"
                    />
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <stat.icon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How ReWear Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform makes it easy to exchange clothes sustainably through multiple options
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <feature.icon className="h-16 w-16 text-green-600 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Items</h2>
              <p className="text-gray-600">Discover amazing pieces from our community</p>
            </div>
            <Link href="/browse">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Sustainable Fashion Journey?</h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of users who are already making a difference through clothing exchange
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 w-full sm:w-auto">
                Join ReWear Today
              </Button>
            </Link>
            <Link href="/browse">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-600 w-full sm:w-auto bg-transparent"
              >
                Browse Items
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
