import { NextResponse } from "next/server"
import prisma from "../../../../../../lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ buyerId: string }> }
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

    const { buyerId } = await params

    if (!buyerId) {
      return NextResponse.json(
        { error: "Missing buyerId parameter" },
        { status: 400 }
      )
    }

    // 2. Fetch all orders for this buyer
    const orders = await prisma.order.findMany({
      where: {
        buyerId: buyerId,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
                category: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // 3. Enrich orders with payment and shipping data
    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        let payment: any = null
        let shipment: any = null

        try {
          if (order.paymentId) {
            const paymentResponse = await fetch(
              `${process.env.PAYMENTS_API_URL}/api/payments/transactions/${order.paymentId}`,
              {
                headers: {
                  "X-API-Key": process.env.PAYMENTS_OUTBOUND_API_KEY!,
                },
              }
            )

            if (paymentResponse.ok) {
              payment = await paymentResponse.json()
            }
          }

          if (order.shippingId) {
            const shippingResponse = await fetch(
              `${process.env.SHIPPING_API_URL}/api/shipments/${order.shippingId}`,
              {
                headers: {
                  "X-API-Key": process.env.SHIPPING_API_KEY!,
                },
              }
            )

            if (shippingResponse.ok) {
              shipment = await shippingResponse.json()
            }
          }
        } catch (error) {
          console.error(
            `[ORDER_ENRICHMENT_ERROR] For order ${order.id}`,
            error
          )
        }

        return {
          ...order,
          payment,
          shipment,
          paymentStatus: payment?.status ?? null,
          shippingStatus: shipment?.currentStatus ?? null,
        }
      })
    )

    return NextResponse.json(enrichedOrders)
  } catch (error: any) {
    console.error("[BUYER_ORDERS_GET_ERROR]", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
