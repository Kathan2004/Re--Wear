import { type NextRequest, NextResponse } from "next/server"
import { mockItems } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const item = mockItems.find((item) => item.id === params.id)

  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 })
  }

  return NextResponse.json({ item })
}
