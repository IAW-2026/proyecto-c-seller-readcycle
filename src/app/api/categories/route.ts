import prisma from "../../../lib/prisma"

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    })
    return Response.json(categories)
  } catch (error) {
    console.error(error)
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}