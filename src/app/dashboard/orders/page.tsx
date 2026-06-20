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
          </Flex>
        </Stack>
        <OrdersList orders={orders} />
      </Container>
    </Box>
  )
}