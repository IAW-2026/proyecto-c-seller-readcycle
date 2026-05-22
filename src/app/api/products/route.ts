import { auth } from "@clerk/nextjs/server"
import prisma from "../../../lib/prisma"

export async function POST(req: Request) {

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

      include: {
        address: true,
      },
    })

    if (!dbUser) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    if (!dbUser.address) {
      return Response.json(
        { error: "You must add an address first" },
        { status: 400 }
      )
    }

    const body = await req.json()

    if (
      !body.title ||
      !body.description ||
      !body.price ||
      !body.stock ||
      !body.weight ||
      !body.categoryId ||
      !body.images ||
      body.images.length === 0
    ) {

      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        title: body.title,
        description: body.description,
        price: Number(body.price),
        stock: Number(body.stock),
        weight: Number(body.weight),
        sellerId: dbUser.id,
        categoryId: body.categoryId,

        images: {
          create: {
            url: body.images[0],
            isPrimary: true,
          },
        },
      },

      include: {
        category: true,
        images: true,
      },
    })
    return Response.json(product)

  } catch (error) {
    console.error(error)
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) { 
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

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
    if (id) {
      const product = await prisma.product.findFirst({
        where: {
          id: id,
          sellerId: dbUser.id, 
        },
        include: {
          category: true,
          images: {
            orderBy: {
              isPrimary: "desc",
            },
          },
        },
      })

      if (!product) {
        return Response.json(
          { error: "Product not found" },
          { status: 404 }
        )
      }

      return Response.json(product) // Devuelve un OBJETO único, no un array
    }
    const products = await prisma.product.findMany({
      where: {
        sellerId: dbUser.id,
      },

      include: {
        category: true,

        images: {
          orderBy: {
            isPrimary: "desc",
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    const { userId } = await auth()

    if (!userId) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    if (!id) {
      return Response.json(
        { error: "Product ID is required" },
        { status: 400 }
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
    const deleteResult = await prisma.product.deleteMany({
      where: {
        id: id,
        sellerId: dbUser.id,
      },
    })

    if (deleteResult.count === 0) {
      return Response.json(
        { error: "Product not found or unauthorized" },
        { status: 404 }
      )
    }
    return Response.json({ message: "Producto eliminado exitosamente" })

  } catch (error) {
    console.error(error)
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const body = await request.json()

    const { userId } = await auth()
    if (!userId) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    if (!id) {
      return Response.json(
        { error: "Product ID is required" },
        { status: 400 }
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

    // 1. Verificamos que el producto exista y le pertenezca a este usuario
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: id,
        sellerId: dbUser.id,
      },
    })

    if (!existingProduct) {
      return Response.json(
        { error: "Product not found or unauthorized" },
        { status: 404 }
      )
    }

    // 2. Actualizamos el producto y reemplazamos la imagen
    await prisma.product.update({
      where: {
        id: id,
      },

      data: {
        title: body.title,
        description: body.description,
        price: body.price,
        stock: body.stock,
        weight: body.weight,
        categoryId: body.categoryId,

        images: {
          deleteMany: {},

          create: {
            url: body.images[0],
            isPrimary: true,
          },
        },
      },
    })

    return Response.json({ message: "Product updated successfully" })

  } catch (error) {
    console.error(error)
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}