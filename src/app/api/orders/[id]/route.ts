import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

import prisma from "../../../../lib/prisma"

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string
    }>
  }
) {
  try {
    const { userId } = await auth()
    const apiKey = req.headers.get("X-API-Key")

    let isAuthorized = false
    let isExternalService = false

    // 1. Check API Key first (for external services)
    if (apiKey) {
      if (
        apiKey === process.env.BUYER_API_KEY ||
        apiKey === process.env.PAYMENTS_API_KEY
      ) {
        isAuthorized = true
        isExternalService = true
      }
    }

    // 2. Check Clerk Session (for frontend / dashboard)
    let seller: any = null
    if (!isAuthorized && userId) {
      seller = await prisma.user.findUnique({
        where: {
          clerkUserId: userId,
        },
      })
      if (seller) {
        isAuthorized = true
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params

    // 3. Query the order
    const order = await prisma.order.findFirst({
      where: {
        id,
        ...(isExternalService ? {} : { sellerId: seller?.id }),
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
    })

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    let payment: any = null
    let shipment: any = null

    try {
      if (order.paymentId) {
        const paymentResponse =
          await fetch(
            `${process.env.PAYMENTS_API_URL}/api/payments/transactions/${order.paymentId}`,
            {
              headers: {
                "X-API-Key":
                  process.env
                    .PAYMENTS_OUTBOUND_API_KEY!,
              },
            }
          )

        if (paymentResponse.ok) {
          payment = await paymentResponse.json()
        }
      }

      if (order.shippingId) {
        const shippingResponse =
          await fetch(
            `${process.env.SHIPPING_API_URL}/api/shipments/${order.shippingId}`,
            {
              headers: {
                "X-API-Key":
                  process.env
                    .SHIPPING_API_KEY!,
              },
            }
          )

        if (shippingResponse.ok) {
          shipment = await shippingResponse.json()
        }
      }
    } catch (error) {
      console.error(
        `[ORDER_ENRICHMENT] ${order.id}`,
        error
      )
    }

    return NextResponse.json({
      ...order,
      payment,
      shipment,
      paymentStatus: payment?.status ?? null,
      shippingStatus: shipment?.currentStatus ?? null,
    })
  } catch (error) {
    console.error(
      "[ORDER_GET_BY_ID]",
      error
    )

    return NextResponse.json(
      {
        error:
          "Internal server error",
      },
      { status: 500 }
    )
  }
}