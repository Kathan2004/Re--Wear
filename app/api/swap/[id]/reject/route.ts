import { NextRequest, NextResponse } from "next/server"
import { updateSwapRequest, createNotification } from "@/lib/database"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Update swap request status to rejected
    const updatedRequest = await updateSwapRequest(params.id, {
      status: "rejected",
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
      title: "Swap Request Rejected",
      message: "Your swap request has been rejected by the owner",
      type: "swap_rejected",
      is_read: false
    })

    return NextResponse.json({
      success: true,
      swapRequest: updatedRequest
    })
  } catch (error) {
    console.error("Error rejecting swap request:", error)
    return NextResponse.json(
      { error: "Failed to reject swap request" },
      { status: 500 }
    )
  }
}
