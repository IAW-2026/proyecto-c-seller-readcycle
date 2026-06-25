import { NextResponse } from "next/server"
import prisma from "../../../../../../lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Authenticate the buyer application
    const apiKey = req.headers.get("X-API-Key")
    if (apiKey !== process.env.BUYER_API_KEY) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: "Missing seller id parameter" },
        { status: 400 }
      )
    }

    // 2. Fetch the seller details including address
    const seller = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
      },
    })

    if (!seller) {
      return NextResponse.json(
        { error: "Seller not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(seller)
  } catch (error: any) {
    console.error("[BUYER_SELLER_GET_ERROR]", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
