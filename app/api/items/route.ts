import { NextRequest, NextResponse } from "next/server"
import { getItems, getCategories, createItem } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const size = searchParams.get("size")
    const condition = searchParams.get("condition")
    const featured = searchParams.get("featured")
    const limit = searchParams.get("limit")

    // Get all items and categories
    const [items, categories] = await Promise.all([
      getItems(),
      getCategories()
    ])

    // Filter items based on query parameters
    let filteredItems = items.filter((item) => item.status === "approved" && item.is_available)

    if (category && category !== "all") {
      filteredItems = filteredItems.filter((item) => item.category_id === category)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredItems = filteredItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      )
    }

    if (size && size !== "all") {
      filteredItems = filteredItems.filter((item) => item.size === size)
    }

    if (condition && condition !== "all") {
      filteredItems = filteredItems.filter((item) => item.condition === condition)
    }

    if (featured === "true") {
      filteredItems = filteredItems.filter((item) => item.featured)
    }

    // Apply limit if specified
    if (limit) {
      const limitNum = parseInt(limit)
      filteredItems = filteredItems.slice(0, limitNum)
    }

    return NextResponse.json({
      items: filteredItems,
      categories: categories,
      total: filteredItems.length,
    })
  } catch (error) {
    console.error("Error fetching items:", error)
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['title', 'category_id', 'user_id', 'size', 'condition']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Create the item
    const newItem = await createItem({
      title: body.title,
      description: body.description || "",
      image_url: body.image_url || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop",
      category_id: body.category_id,
      user_id: body.user_id,
      size: body.size,
      condition: body.condition,
      brand: body.brand || "Other",
      points_required: body.points_required || 50,
      tags: body.tags || [],
      status: body.status || "pending",
      is_available: body.is_available !== undefined ? body.is_available : true,
      featured: body.featured || false
    })

    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    console.error("Error creating item:", error)
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    )
  }
}
