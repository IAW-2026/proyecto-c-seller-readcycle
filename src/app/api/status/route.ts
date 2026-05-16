import  prisma  from "../../../lib/prisma"

export async function GET() {
  try {
    const afa = await prisma.user.findFirst()
    return Response.json(afa)
  } catch (error) {
    return Response.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}