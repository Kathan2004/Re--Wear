import { NextRequest, NextResponse } from "next/server"
import { updateSwapRequest, createNotification } from "@/lib/database"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Update swap request status to accepted
    const updatedRequest = await updateSwapRequest(params.id, {
      status: "accepted",
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
      title: "Swap Request Accepted!",
      message: "Your swap request has been accepted by the owner",
      type: "swap_accepted",
      is_read: false
    })

    return NextResponse.json({
      success: true,
      swapRequest: updatedRequest
    })
  } catch (error) {
    console.error("Error accepting swap request:", error)
    return NextResponse.json(
      { error: "Failed to accept swap request" },
      { status: 500 }
    )
  }
}
