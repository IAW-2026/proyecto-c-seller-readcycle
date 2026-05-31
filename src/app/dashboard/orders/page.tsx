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

  status: string
  shippingStatus: string

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

  const createMockOrder = async () => {
    try {
      const mockCart = {
        buyerId: "buyer_test_123",

        shippingCost: 3000,

        items: [
          {
            productId:
              "cmppv6yjb0000wswg5hpvpumw",

            quantity: 1,
          },

          {
            productId:
              "cmpof99y20002fowg9de2adfm",

            quantity: 1,
          },
        ],
      }

      const res = await fetch("/api/orders", {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(mockCart),
      })

      if (!res.ok) {
        const errorData = await res.json()

        console.log(errorData)

        throw new Error(errorData.error)
      }

      await fetchOrders()
    } catch (error) {
      console.error(
        "[MOCK_ORDER]",
        error
      )
    }
  }

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
                Gestiona todas tus órdenes
                realizadas
              </Text>
            </Flex>

            <Button
              bg="brand.forest"
              color="white"
              onClick={createMockOrder}
            >
              Mockear compra
            </Button>
          </Flex>
        </Stack>

        <OrdersList orders={orders} />
      </Container>
    </Box>
  )
}