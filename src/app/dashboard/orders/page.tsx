"use client"

import { useEffect, useState } from "react"

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react"

import { OrdersList } from "../../../components/orders/ordersList"

type Order = {
  id: string

  createdAt: string

  total: number
  shippingCost: number

  paymentId: string | null
  shippingId: string | null

  paymentStatus: string | null
  shippingStatus: string | null

  buyerId: string

  items: {
    id: string

    quantity: number
    price: number
    subtotal: number

    product: {
      id: string
      title: string
      description: string
      stock: number

      category: {
        name: string
      }

      images: {
        id: string
        url: string
        isPrimary: boolean
      }[]
    }
  }[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders")

      if (!res.ok) {
        throw new Error(
          "Error fetching orders"
        )
      }

      const data = await res.json()

      setOrders(data)
    } catch (error) {
      console.error(
        "[ORDERS_PAGE]",
        error
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const totalPages = Math.ceil(orders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentOrders = orders.slice(startIndex, startIndex + itemsPerPage)

  if (loading) {
    return (
      <Flex
        minH="70vh"
        align="center"
        justify="center"
      >
        <Spinner
          size="xl"
          color="brand.sage"
        />
      </Flex>
    )
  }

  return (
    <Box
      bg="brand.beige"
      minH="100vh"
      py={10}
    >
      <Container maxW="1200px">
        <Stack
          gap="3"
          mb="12"
        >
          <Heading
            fontSize="5xl"
            color="brand.forest"
            fontWeight="800"
          >
            Historial de ventas
          </Heading>
          <Flex
            align="center"
            justify="space-between"
            gap="4"
            wrap="wrap"
          >
            <Flex
              align="center"
              gap="4"
            >
              <Box
                w="50px"
                h="3px"
                bg="brand.clay"
                borderRadius="full"
              />
              <Text
                color="gray.600"
                fontSize="lg"
              >
                Gestiona todas tus órdenes realizadas
              </Text>
            </Flex>
          </Flex>
        </Stack>

        {orders.length === 0 ? (
          <Flex
            minH="40vh"
            align="center"
            justify="center"
            px="6"
            textAlign="center"
          >
            <Stack maxW="500px" gap="6">
              <Text
                fontSize="3xl"
                fontWeight="700"
                color="brand.forest"
              >
                No tienes ventas registradas
              </Text>
              <Text
                fontSize="lg"
                color="gray.600"
              >
                Aquí aparecerán las órdenes que realicen los compradores una vez que adquieran tus libros.
              </Text>
            </Stack>
          </Flex>
        ) : (
          <>
            <OrdersList orders={currentOrders} />
            {totalPages > 1 && (
              <Flex
                justify="center"
                align="center"
                gap="4"
                mt="10"
                flexWrap="wrap"
              >
                <Button
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }}
                  disabled={currentPage === 1}
                  bg="brand.forest"
                  color="white"
                  _hover={{
                    bg: "brand.sage",
                  }}
                >
                  Anterior
                </Button>
                <Text
                  fontWeight="600"
                  color="brand.forest"
                >
                  Página {currentPage} de {totalPages}
                </Text>
                <Button
                  onClick={() => {
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }}
                  disabled={currentPage === totalPages}
                  bg="brand.forest"
                  color="white"
                  _hover={{
                    bg: "brand.sage",
                  }}
                >
                  Siguiente
                </Button>
              </Flex>
            )}
          </>
        )}
      </Container>
    </Box>
  )
}