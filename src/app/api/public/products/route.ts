import prisma from "../../../../lib/prisma"

export async function GET(req: Request) {
  try {
    // 1. Authenticate the buyer application
    const apiKey = req.headers.get("X-API-Key")
    if (apiKey !== process.env.BUYER_API_KEY && apiKey !== process.env.ANALYTICS_API_KEY && apiKey !== process.env.ADMIN_API_KEY) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },

      include: {
        category: true,

        images: {
          orderBy: {
            isPrimary: "desc",
          },
        },

        seller: {
          select: {
            id: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    })

    return Response.json(products)

  } catch (error) {
    console.error(error)

    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
