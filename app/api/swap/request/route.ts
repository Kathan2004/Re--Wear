import { NextRequest, NextResponse } from "next/server"
import { createSwapRequest, createNotification } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { requester_id, owner_id, requested_item_id, offered_item_id, message } = body

    // Validate required fields
    if (!requester_id || !owner_id || !requested_item_id || !offered_item_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create swap request
    const swapRequest = await createSwapRequest({
      requester_id,
      owner_id,
      requested_item_id,
      offered_item_id,
      status: "pending",
      message,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    // Create notification for the owner
    await createNotification({
      user_id: owner_id,
      title: "New Swap Request",
      message: `You have received a new swap request for your item`,
      type: "swap_request",
      is_read: false
    })

    return NextResponse.json({
      success: true,
      swapRequest
    })
  } catch (error) {
    console.error("Error creating swap request:", error)
    return NextResponse.json(
      { error: "Failed to create swap request" },
      { status: 500 }
    )
  }
}
