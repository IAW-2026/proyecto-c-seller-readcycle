import { NextResponse } from "next/server"
import prisma from "../../../../../lib/prisma"

export async function POST(req: Request) {
  try {
    // 1. Authenticate the payment service webhook
    const apiKey = req.headers.get("X-API-Key")
    if (apiKey !== process.env.PAYMENTS_API_KEY) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { orderId, paymentId, status } = body

    if (!orderId || !paymentId) {
      return NextResponse.json(
        { error: "Missing required fields (orderId, paymentId)" },
        { status: 400 }
      )
    }

    // 2. Verify order exists in the database
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    // 3. Update the order's paymentId
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentId: paymentId,
      },
    })

    console.log(`[PAYMENT_WEBHOOK] Updated paymentId to "${paymentId}" for order "${orderId}"`)

    // 4. Create the shipment by calling the external shipments API
    let shippingId: string | null = null

    const normalizedStatus = status ? String(status).toUpperCase() : ""
    const isCancelledOrRejected = normalizedStatus === "cancelled" || normalizedStatus === "rejected"

    if (isCancelledOrRejected) {
      console.log(`[PAYMENT_WEBHOOK] Payment status is "${status}". Skipping shipment creation.`)
    } else {
      try {
        const response = await fetch(
          `${process.env.SHIPPING_API_URL}/api/shipments`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-API-Key": process.env.SHIPPING_API_KEY!,
            },
            body: JSON.stringify({
              orderId: orderId,
            }),
          }
        )

        if (response.ok) {
          const shipmentData = await response.json()
          shippingId = shipmentData.id

          if (shippingId) {
            // 5. Update the order's shippingId in the database
            await prisma.order.update({
              where: { id: orderId },
              data: {
                shippingId: shippingId,
              },
            })
            console.log(`[PAYMENT_WEBHOOK] Created shipment with ID "${shippingId}" for order "${orderId}"`)
          } else {
            console.error("[PAYMENT_WEBHOOK] Shipment response did not contain an ID:", shipmentData)
          }
        } else {
          const errorText = await response.text()
          console.error("[PAYMENT_WEBHOOK] Failed to create shipment. Status:", response.status, "Error:", errorText)
        }
      } catch (err: any) {
        console.error("[PAYMENT_WEBHOOK] Error calling shipping API:", err.message || err)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment webhook processed successfully",
      orderId,
      paymentId,
      shippingId,
    })

  } catch (error: any) {
    console.error("[PAYMENT_WEBHOOK_ERROR]", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
