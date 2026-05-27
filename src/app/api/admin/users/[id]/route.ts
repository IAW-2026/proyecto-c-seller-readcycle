import { clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

import { isAdmin } from "../../../../../lib/isAdmin"

export async function DELETE(
  req: Request,
  context: {
    params: Promise<{
      id: string
    }>
  }
) {
  const admin = await isAdmin()

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  const params = await context.params

  const client = await clerkClient()

  await client.users.deleteUser(params.id)

  return NextResponse.json({
    success: true,
  })
}