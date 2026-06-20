import prisma from "../../../../lib/prisma"

export async function GET() {
  try {
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