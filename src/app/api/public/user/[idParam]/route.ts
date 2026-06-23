import { NextResponse } from "next/server"
import prisma from "../../../../../lib/prisma"

export async function GET(
    req: Request,
    { params }: { params: Promise<{ idParam: string }> }
) {
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

        // 2. Get the parameter (e.g. "id=cl2j8h9p10000t5x7y3zq9a8b")
        const { idParam } = await params

        // 3. Extract the ID from the parameter if it contains "="
        let id = idParam
        if (idParam.includes("=")) {
            const parts = idParam.split("=")
            id = parts[1] || parts[0]
        }

        if (!id) {
            return NextResponse.json(
                { error: "Missing required user ID" },
                { status: 400 }
            )
        }

        // 4. Query the user in the database
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

        // 5. Return the clerkUserId
        return NextResponse.json({
            clerkUserId: user.clerkUserId,
            idClerkUser: user.clerkUserId,
        })

    } catch (error: any) {
        console.error("[PUBLIC_USER_PARAM_GET_ERROR]", error)
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        )
    }
}
