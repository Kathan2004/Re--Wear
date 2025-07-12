import { NextRequest, NextResponse } from "next/server"
import { updateSwapRequest, createNotification } from "@/lib/database"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { shipping_method, shipping_address } = body

    // Update swap request status to shipped
    const updatedRequest = await updateSwapRequest(params.id, {
      status: "shipped",
      updated_at: new Date().toISOString()
    })

    if (!updatedRequest) {
      return NextResponse.json(
        { error: "Swap request not found" },
        { status: 404 }
      )
    }

    // Create notification for the requester
    await createNotification({
      user_id: updatedRequest.requester_id,
      title: "Item Shipped",
      message: "The item you requested has been shipped",
      type: "system",
      is_read: false
    })

    return NextResponse.json({
      success: true,
      swapRequest: updatedRequest
    })
  } catch (error) {
    console.error("Error updating shipping status:", error)
    return NextResponse.json(
      { error: "Failed to update shipping status" },
      { status: 500 }
    )
  }
}
