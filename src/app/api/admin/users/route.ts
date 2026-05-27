import { clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

import { isAdmin } from "../../../../lib/isAdmin"

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

  await client.users.createUser({
    firstName: body.name,
    lastName: body.surname,
    emailAddress: [body.email],
    password: body.password,
    publicMetadata: {
      roles: [body.role],
    },
  })

  return NextResponse.json({
    success: true,
  })
}