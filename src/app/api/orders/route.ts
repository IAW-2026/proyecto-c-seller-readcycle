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

    return NextResponse.json(orders)
  } catch (error) {
    console.error("[ORDERS_GET]", error)

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
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

    const order = await prisma.$transaction(
      async (tx) => {
        let total = 0

        const validatedItems = await Promise.all(
          items.map(async (item: any) => {
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
              product.stock < item.quantity
            ) {
              throw new Error(
                `Not enough stock for ${product.title}`
              )
            }

            total +=
              product.price * item.quantity

            return {
              product,
              quantity: item.quantity,
            }
          })
        )

        const createdOrder =
          await tx.order.create({
            data: {
              sellerId: seller.id,
              buyerId,

              total,
              shippingCost,

              status: "PENDING",
              shippingStatus:
                "PREPARING",

              items: {
                create: validatedItems.map(
                  ({
                    product,
                    quantity,
                  }) => ({
                    quantity,

                    price: product.price,

                    subtotal:
                      product.price *
                      quantity,

                    productId: product.id,
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
                    decrement: quantity,
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
    console.error("[ORDERS_POST]", error)

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