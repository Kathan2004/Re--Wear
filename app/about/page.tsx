"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Recycle, Users, Leaf, Heart, Target, Award, Globe, ArrowRight } from "lucide-react"

export default function AboutPage() {
  const stats = [
    { label: "Items Exchanged", value: "12,543", icon: Recycle },
    { label: "Active Users", value: "3,247", icon: Users },
    { label: "CO₂ Saved (kg)", value: "8,921", icon: Leaf },
    { label: "Countries", value: "15", icon: Globe },
  ]

  const values = [
    {
      icon: Heart,
      title: "Sustainability First",
      description: "We believe in creating a circular economy where fashion waste becomes fashion opportunity.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Our platform thrives on the connections and trust built between community members.",
    },
    {
      icon: Target,
      title: "Quality Focus",
      description: "Every item on our platform is verified to ensure quality and authenticity.",
    },
    {
      icon: Award,
      title: "Fair Exchange",
      description: "Our points system ensures fair and transparent exchanges for all users.",
    },
  ]

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      bio: "Former fashion industry executive passionate about sustainable fashion and circular economy.",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      bio: "Tech entrepreneur with 10+ years experience building scalable platforms and communities.",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Emma Rodriguez",
      role: "Head of Community",
      bio: "Community building expert focused on creating meaningful connections between users.",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "David Kim",
      role: "Head of Sustainability",
      bio: "Environmental scientist dedicated to measuring and maximizing our positive impact.",
      image: "/placeholder.svg?height=300&width=300",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-green-100 text-green-800 mb-4">About ReWear</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Revolutionizing Fashion Through
                <span className="text-green-600"> Community Exchange</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Founded in 2023, ReWear is on a mission to transform the fashion industry by creating a sustainable,
                community-driven platform where clothes get a second life and people discover their next favorite
                pieces.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                    Join Our Community
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/browse">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                    Browse Items
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <Card className="overflow-hidden">
                <Image
                  src="/about-team.jpg"
                  alt="ReWear team working together"
                  width={600}
                  height={400}
                  className="w-full object-cover"
                />
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact So Far</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Together with our community, we're making a real difference in sustainable fashion
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                The fashion industry is one of the world's largest polluters, with millions of tons of clothing ending
                up in landfills each year. We believe there's a better way.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                ReWear was born from the simple idea that one person's unused clothing could be another person's perfect
                find. By creating a trusted community platform for clothing exchange, we're extending the life cycle of
                garments and reducing fashion waste.
              </p>
              <p className="text-lg text-gray-600">
                Our vision is a world where every piece of clothing reaches its full potential, where communities are
                connected through shared values of sustainability, and where looking good doesn't come at the cost of
                our planet.
              </p>
            </div>

            <div className="relative">
              <Card className="overflow-hidden">
                <Image
                  src="/about-mission.jpg"
                  alt="Sustainable fashion concept"
                  width={600}
                  height={400}
                  className="w-full object-cover"
                />
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do at ReWear
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <value.icon className="h-16 w-16 text-green-600 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <Card className="overflow-hidden">
                <Image
                  src="/about-sustainability.jpg"
                  alt="Environmental impact of fashion"
                  width={600}
                  height={400}
                  className="w-full object-cover"
                />
              </Card>
            </div>

            <div>
              <Badge className="bg-green-100 text-green-800 mb-4">Environmental Impact</Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Making Fashion Sustainable</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Reducing Waste</h3>
                  <p className="text-gray-600">
                    Every item exchanged on ReWear prevents clothing from ending up in landfills, reducing textile waste
                    and environmental impact.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Carbon Footprint</h3>
                  <p className="text-gray-600">
                    By extending the life of existing garments, we significantly reduce the carbon footprint associated
                    with producing new clothing.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Circular Economy</h3>
                  <p className="text-gray-600">
                    Our platform promotes a circular economy model where resources are reused, recycled, and kept in
                    circulation for as long as possible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate individuals working together to revolutionize sustainable fashion
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-green-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Info Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Company Information</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Founded</h3>
                <p className="text-gray-600 mb-6">
                  ReWear was founded in 2023 in San Francisco, California, by a team of fashion industry veterans and
                  sustainability advocates who saw the urgent need for change in how we consume fashion.
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Funding</h3>
                <p className="text-gray-600">
                  We've raised $2.5M in seed funding from leading sustainability-focused VCs and angel investors who
                  share our vision for a more sustainable fashion future.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Recognition</h3>
                <p className="text-gray-600 mb-6">
                  ReWear has been recognized as one of the "Top 10 Sustainable Fashion Startups to Watch" by Fashion
                  Tech Weekly and featured in TechCrunch, Vogue Business, and Sustainable Fashion Forum.
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Partnerships</h3>
                <p className="text-gray-600">
                  We partner with local fashion schools, sustainability organizations, and community groups to promote
                  circular fashion practices and education.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Join the ReWear Revolution</h2>
          <p className="text-xl text-green-100 mb-8">
            Be part of the movement towards sustainable fashion. Start swapping today and make a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 w-full sm:w-auto">
                Get Started Now
              </Button>
            </Link>
            <Link href="/browse">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-600 w-full sm:w-auto bg-transparent"
              >
                Explore Items
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
