import { auth } from "@clerk/nextjs/server"
import prisma from "../../../lib/prisma"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    })

    if (!user) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      )
    }
    return Response.json(user)

  } catch (error) {
    console.error(error)

    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}