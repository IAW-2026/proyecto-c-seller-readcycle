import { clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

import { isAdmin } from "../../../../lib/isAdmin"
import  prisma  from "../../../../lib/prisma"

export async function POST(req: Request) {
  const admin = await isAdmin()

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  const body = await req.json()

  const client = await clerkClient()

  // Crear usuario en Clerk
  const clerkUser = await client.users.createUser({
    firstName: body.name,
    lastName: body.surname,
    emailAddress: [body.email],
    password: body.password,
    publicMetadata: {
      roles: [body.role],
    },
  })

  // Crear usuario en tu DB
  await prisma.user.create({
    data: {
      clerkUserId: clerkUser.id,
      name: body.name,
      surname: body.surname,
      email: body.email,
    },
  })

  return NextResponse.json({
    success: true,
  })
}