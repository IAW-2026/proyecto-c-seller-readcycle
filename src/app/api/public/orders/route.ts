import { NextResponse } from "next/server"
import prisma from "../../../../lib/prisma"

export async function GET(req: Request) {
    try {
        // 1. Authenticate the buyer application
        const apiKey = req.headers.get("X-API-Key")
        if (apiKey !== process.env.ANALYTICS_API_KEY) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        // 2. Fetch all orders
        const orders = await prisma.order.findMany({
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
    } catch (error: any) {
        console.error("[PUBLIC_ORDERS_GET_ERROR]", error)
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        )
    }
}
