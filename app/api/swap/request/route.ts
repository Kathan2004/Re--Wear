import { type NextRequest, NextResponse } from "next/server"
import { mockSwapRequests, mockNotifications } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fromUser, toUser, requestedItem, offeredItem, message } = body

    // Validate required fields
    if (!fromUser || !toUser || !requestedItem || !offeredItem) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Mock swap request creation
    const swapRequest = {
      id: Date.now().toString(),
      requester_id: fromUser,
      owner_id: toUser,
      requested_item_id: requestedItem,
      offered_item_id: offeredItem,
      status: "pending",
      message: message || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Add to mock database
    mockSwapRequests.push(swapRequest as any)

    // Create notification for the owner
    const notification = {
      id: (Date.now() + 1).toString(),
      user_id: toUser,
      type: "swap_request" as const,
      title: "New Swap Request",
      message: "Someone wants to swap for your item",
      read: false,
      related_id: swapRequest.id,
      created_at: new Date().toISOString(),
    }

    mockNotifications.push(notification)

    return NextResponse.json({
      success: true,
      swapRequest,
      message: "Swap request sent successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
