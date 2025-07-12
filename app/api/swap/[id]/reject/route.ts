import { type NextRequest, NextResponse } from "next/server"
import { mockSwapRequests, mockNotifications } from "@/lib/database"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { message } = body

    // Find and update the swap request
    const requestIndex = mockSwapRequests.findIndex((req) => req.id === params.id)
    if (requestIndex === -1) {
      return NextResponse.json({ error: "Swap request not found" }, { status: 404 })
    }

    mockSwapRequests[requestIndex] = {
      ...mockSwapRequests[requestIndex],
      status: "rejected",
      updated_at: new Date().toISOString(),
    }

    // Create notification for the requester
    const notification = {
      id: Date.now().toString(),
      user_id: mockSwapRequests[requestIndex].requester_id,
      type: "swap_rejected" as const,
      title: "Swap Request Rejected",
      message: "Your swap request was not accepted",
      read: false,
      related_id: params.id,
      created_at: new Date().toISOString(),
    }

    mockNotifications.push(notification)

    return NextResponse.json({
      success: true,
      message: "Swap request rejected",
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
