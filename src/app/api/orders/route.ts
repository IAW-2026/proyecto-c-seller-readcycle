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
    const body = await req.json()

    const {
      sellerId,
      buyerId,
      shippingCost,
      items,
    } = body

    if (!sellerId || !buyerId || !items?.length) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      )
    }

    let total = 0

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: {
          id: item.productId,
        },
      })

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        )
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Not enough stock for ${product.title}`,
          },
          { status: 400 }
        )
      }

      total += product.price * item.quantity
    }

    const order = await prisma.order.create({
      data: {
        sellerId,
        buyerId,

        total,
        shippingCost,

        status: "PENDING",
        shippingStatus: "PREPARING",

        items: {
          create: await Promise.all(
            items.map(async (item: any) => {
              const product =
                await prisma.product.findUnique({
                  where: {
                    id: item.productId,
                  },
                })

              await prisma.product.update({
                where: {
                  id: item.productId,
                },

                data: {
                  stock: {
                    decrement: item.quantity,
                  },
                },
              })

              return {
                quantity: item.quantity,
                price: product!.price,
                subtotal:
                  product!.price * item.quantity,
                productId: item.productId,
              }
            })
          ),
        },
      },

      include: {
        items: true,
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error("[ORDERS_POST]", error)

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}