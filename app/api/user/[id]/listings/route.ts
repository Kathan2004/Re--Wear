import { type NextRequest, NextResponse } from "next/server"
import { mockItems } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const userItems = mockItems.filter(
    (item) => item.user_id === params.id && item.status === "approved" && item.is_available,
  )

  return NextResponse.json({ items: userItems })
}
