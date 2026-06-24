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
  const apiKey = req.headers.get("X-API-Key")
  const hasValidApiKey = apiKey && apiKey === process.env.ADMIN_API_KEY
  const admin = await isAdmin()

  if (!admin && !hasValidApiKey) {
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