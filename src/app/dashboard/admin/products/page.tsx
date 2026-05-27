// app/admin/products/page.tsx

import {
  Box,
  Container,
  Heading,
  HStack,
  Image,
  Table,
  Text,
  VStack,
  Stack,
} from "@chakra-ui/react"

import { redirect } from "next/navigation"

import prisma from "../../../../lib/prisma"
import { isAdmin } from "../../../../lib/isAdmin"

import AdminDeleteProductButton from "../../../../components/admin-delete-product-button"

export default async function AdminProductsPage() {
  const admin = await isAdmin()

  if (!admin) {
    redirect("/")
  }

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    include: {
      seller: true,
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <Container maxW="1400px" py="10">
      <VStack align="stretch" gap="8">

        <Stack gap="5">
          <Heading
           fontSize="5xl"
           color="brand.forest"
           fontWeight="800"
           lineHeight="1"
          >
          Administración de Productos
          </Heading>
        </Stack>

        <Box
          bg="white"
          borderWidth="1px"
          borderColor="brand.sand"
          borderRadius="brand"
          overflow="hidden"
          shadow="sm"
        >
          <Table.Root>

            <Table.Header bg="brand.beige">
              <Table.Row>

                <Table.ColumnHeader py="4"  color="brand.forest" borderRadius="brand" fontFamily="heading" fontWeight="600" px="4" _hover={{ bg: "brand.sand" }}>
                  Producto
                </Table.ColumnHeader>

                <Table.ColumnHeader py="4"  color="brand.forest" borderRadius="brand" fontFamily="heading" fontWeight="600" px="4" _hover={{ bg: "brand.sand" }} >
                  Vendedor
                </Table.ColumnHeader>

                <Table.ColumnHeader py="4"  color="brand.forest" borderRadius="brand" fontFamily="heading" fontWeight="600" px="4" _hover={{ bg: "brand.sand" }} >
                  Precio
                </Table.ColumnHeader>

                <Table.ColumnHeader py="4" color="brand.forest" borderRadius="brand" fontFamily="heading" fontWeight="600" px="4" _hover={{ bg: "brand.sand" }} >
                  Acciones
                </Table.ColumnHeader>

              </Table.Row>
            </Table.Header>

            <Table.Body>
              {products.map((product) => (
                <Table.Row key={product.id}>

                  <Table.Cell>
                    <HStack gap="4">

                      <Image
                        src={
                          product.images?.[0]?.url ||
                          "/placeholder.png"
                        }
                        alt={product.title}
                        boxSize="70px"
                        objectFit="cover"
                        borderRadius="xl"
                      />

                      <Text fontWeight="600">
                        {product.title}
                      </Text>

                    </HStack>
                  </Table.Cell>

                  <Table.Cell>
                    {product.seller.name}{" "}
                    {product.seller.surname}
                  </Table.Cell>

                  <Table.Cell>
                    ${product.price}
                  </Table.Cell>

                  <Table.Cell>
                    <AdminDeleteProductButton
                      productId={product.id}
                    />
                  </Table.Cell>

                </Table.Row>
              ))}
            </Table.Body>

          </Table.Root>
        </Box>

      </VStack>
    </Container>
  )
}