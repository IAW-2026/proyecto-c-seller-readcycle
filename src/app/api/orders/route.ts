import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

import prisma from "../../../lib/prisma"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const seller = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    })

    if (!seller) {
      return NextResponse.json(
        { error: "Seller not found" },
        { status: 404 }
      )
    }

    const orders = await prisma.order.findMany({
      where: {
        sellerId: seller.id,
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

    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        let paymentStatus: string | null = null
        let shippingStatus: string | null = null

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
              const payment =
                await paymentResponse.json()
              paymentStatus =
                payment.status ?? null
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
              const shipment =
                await shippingResponse.json()
              shippingStatus =
                shipment.currentStatus ?? null
            }
          }
        } catch (error) {
          console.error(
            `[ORDER_ENRICHMENT] ${order.id}`,
            error
          )
        }

        return {
          ...order,
          paymentStatus,
          shippingStatus,
        }
      })
    )

    return NextResponse.json(
      enrichedOrders
    )
  } catch (error) {
    console.error("[ORDERS_GET]", error)

    return NextResponse.json(
      {
        error:
          "Internal server error",
      },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const apiKey =
      req.headers.get("X-API-Key")

    if (
      apiKey !==
      process.env.BUYER_API_KEY
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()

    const {
      buyerId,
      shippingCost,
      items,
    } = body

    if (!buyerId || !items?.length) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      )
    }

    const firstProduct =
      await prisma.product.findUnique({
        where: {
          id: items[0].productId,
        },
      })

    if (!firstProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    const sellerId =
      firstProduct.sellerId

    const order = await prisma.$transaction(
      async (tx) => {
        let total = 0

        const validatedItems =
          await Promise.all(
            items.map(
              async (item: any) => {
                const product =
                  await tx.product.findUnique({
                    where: {
                      id: item.productId,
                    },
                  })

                if (!product) {
                  throw new Error(
                    `Product ${item.productId} not found`
                  )
                }

                if (
                  product.sellerId !==
                  sellerId
                ) {
                  throw new Error(
                    "Products belong to different sellers"
                  )
                }

                if (
                  product.stock <
                  item.quantity
                ) {
                  throw new Error(
                    `Not enough stock for ${product.title}`
                  )
                }

                total +=
                  product.price *
                  item.quantity

                return {
                  product,
                  quantity:
                    item.quantity,
                }
              }
            )
          )

        const createdOrder =
          await tx.order.create({
            data: {
              sellerId,
              buyerId,

              total,
              shippingCost,

              paymentId: null,
              shippingId: null,

              items: {
                create:
                  validatedItems.map(
                    ({
                      product,
                      quantity,
                    }) => ({
                      quantity,

                      price:
                        product.price,

                      subtotal:
                        product.price *
                        quantity,

                      productId:
                        product.id,
                    })
                  ),
              },
            },

            include: {
              items: {
                include: {
                  product: true,
                },
              },
            },
          })

        await Promise.all(
          validatedItems.map(
            async ({
              product,
              quantity,
            }) => {
              await tx.product.update({
                where: {
                  id: product.id,
                },

                data: {
                  stock: {
                    decrement:
                      quantity,
                  },
                },
              })
            }
          )
        )

        return createdOrder
      }
    )

    return NextResponse.json(order)
  } catch (error: any) {
    console.error(
      "[ORDERS_POST]",
      error
    )

    return NextResponse.json(
      {
        error:
          error.message ||
          "Internal server error",
      },
      { status: 500 }
    )
  }
}