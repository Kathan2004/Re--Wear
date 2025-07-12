import { NextRequest, NextResponse } from "next/server"
import { getItems } from "@/lib/database"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const items = await getItems()
    const userItems = items.filter((item) => item.user_id === params.id)

    return NextResponse.json({
      items: userItems,
      total: userItems.length,
    })
  } catch (error) {
    console.error("Error fetching user listings:", error)
    return NextResponse.json(
      { error: "Failed to fetch user listings" },
      { status: 500 }
    )
  }
}
