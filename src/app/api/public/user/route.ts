import { NextResponse } from "next/server"
import prisma from "../../../../lib/prisma"

export async function GET(req: Request) {
    try {
        // 1. Authenticate with X-API-Key matching PAYMENT_API_KEY / PAYMENTS_API_KEY
        const apiKey = req.headers.get("X-API-Key")
        const expectedApiKey = process.env.PAYMENTS_API_KEY

        if (!apiKey || apiKey !== expectedApiKey) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        // 2. Get the user ID from the query parameter
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json(
                { error: "Missing required query parameter: id" },
                { status: 400 }
            )
        }

        // 3. Query the user in the database
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
            select: {
                clerkUserId: true,
            },
        })

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        // 4. Return the clerkUserId as requested
        return NextResponse.json({
            clerkUserId: user.clerkUserId,
            idClerkUser: user.clerkUserId,
        })

    } catch (error: any) {
        console.error("[PUBLIC_USER_GET_ERROR]", error)
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        )
    }
}
