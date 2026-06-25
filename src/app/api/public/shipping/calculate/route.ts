import { NextResponse } from "next/server"
import prisma from "../../../../../lib/prisma"

export async function POST(req: Request) {
  try {
    // 1. Authenticate the buyer application
    const apiKey = req.headers.get("X-API-Key")
    if (apiKey !== process.env.BUYER_API_KEY) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { sellerId, destinationZipCode, totalWeight } = body

    if (!sellerId || !destinationZipCode || totalWeight === undefined) {
      return NextResponse.json(
        { error: "Missing required fields (sellerId, destinationZipCode, totalWeight)" },
        { status: 400 }
      )
    }

    // 2. Fetch the seller's address
    const sellerAddress = await prisma.address.findUnique({
      where: {
        userId: sellerId,
      },
    })

    if (!sellerAddress) {
      return NextResponse.json(
        { error: "Seller address not found or not configured" },
        { status: 404 }
      )
    }

    const originZipCode = sellerAddress.zipCode
    const weight = Number(totalWeight)

    if (isNaN(weight)) {
      return NextResponse.json(
        { error: "totalWeight must be a valid number" },
        { status: 400 }
      )
    }

    // 3. Call the external shipments API to act as a bridge
    const response = await fetch(
      `${process.env.SHIPPING_API_URL}/api/shipments/calculate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.SHIPPING_OUTBOUND_API_KEY!,
        },
        body: JSON.stringify({
          weight,
          originZipCode,
          destinationZipCode,
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error("[SHIPPING_CALCULATION_ERROR]", errorData)
      return NextResponse.json(
        { error: "Failed to calculate shipping cost from external service" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error: any) {
    console.error("[SHIPPING_CALCULATE_POST]", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
