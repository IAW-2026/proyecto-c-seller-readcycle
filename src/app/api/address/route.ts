import { auth } from "@clerk/nextjs/server"
import prisma from "../../../lib/prisma"

export async function PUT(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    })
    if (!dbUser) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const body = await req.json()
    const address = await prisma.address.upsert({
      where: {
        userId: dbUser.id,
      },
      update: {
        province: body.province,
        city: body.city,
        street: body.street,
        number: Number(body.number),
        zipCode: body.zipCode,
      },
      create: {
        province: body.province,
        city: body.city,
        street: body.street,
        number: Number(body.number),
        zipCode: body.zipCode,
        userId: dbUser.id,
      },
    })
    return Response.json(address)
  } catch (error) {
    console.error(error)
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    })

    if (!dbUser) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const address = await prisma.address.findUnique({
      where: {
        userId: dbUser.id,
      },
    })
    return Response.json(address)

  } catch (error) {
    console.error(error)
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}