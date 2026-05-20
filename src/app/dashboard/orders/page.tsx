"use client"

import { useEffect, useState } from "react"

import {
  Box,
  Container,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react"

import { OrdersList } from "../../../components/orders-list"

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

  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: "order_1",

        createdAt: new Date().toISOString(),

        total: 15000,
        shippingCost: 3000,

        status: "PAID",
        shippingStatus: "IN_TRANSIT",

        buyerId: "buyer_123",

        items: [
          {
            id: "item_1",

            quantity: 1,
            price: 12000,
            subtotal: 12000,

            product: {
              id: "cmpeic0u90000t0wgvtdn7anx",

              title: "Clean Code",

              description: "Mal libro",

              stock: 2,

              category: {
                name: "Programación",
              },

              images: [
                {
                  id: "img_1",

                  url:
                    "https://placehold.co/300x400",

                  isPrimary: true,
                },
              ],
            },
          },
        ],
      },
    ]

    setOrders(mockOrders)
    setLoading(false)
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
        </Stack>

        <OrdersList orders={orders} />
      </Container>
    </Box>
  )
}