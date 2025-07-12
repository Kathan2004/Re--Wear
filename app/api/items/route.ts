import { type NextRequest, NextResponse } from "next/server"
import { mockItems, mockCategories } from "@/lib/database"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  // Get filter parameters
  const category = searchParams.get("category")
  const size = searchParams.get("size")
  const condition = searchParams.get("condition")
  const brand = searchParams.get("brand")
  const search = searchParams.get("search")
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "12")

  let filteredItems = mockItems.filter((item) => item.status === "approved" && item.is_available)

  // Apply filters
  if (category && category !== "all") {
    filteredItems = filteredItems.filter((item) => item.category_id === category)
  }

  if (size && size !== "all") {
    filteredItems = filteredItems.filter((item) => item.size === size)
  }

  if (condition && condition !== "all") {
    filteredItems = filteredItems.filter((item) => item.condition === condition)
  }

  if (search) {
    filteredItems = filteredItems.filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())),
    )
  }

  // Pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedItems = filteredItems.slice(startIndex, endIndex)

  return NextResponse.json({
    items: paginatedItems,
    total: filteredItems.length,
    page,
    totalPages: Math.ceil(filteredItems.length / limit),
    categories: mockCategories,
  })
}
