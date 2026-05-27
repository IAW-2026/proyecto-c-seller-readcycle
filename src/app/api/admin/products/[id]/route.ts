import { NextResponse } from "next/server"

import prisma from "../../../../../lib/prisma"
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

  await prisma.product.update({
    where: {
      id: params.id,
    },
    data: {
      isActive: false,
    },
  })

  return NextResponse.json({
    success: true,
  })
}