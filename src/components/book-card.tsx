"use client"

import {
  Badge,
  Box,
  Button,
  Card,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface BookCardProps {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  category: string
  isActive: boolean
}

export default function BookCard({
  id,
  title,
  description,
  price,
  images,
  category,
  isActive,
}: BookCardProps) {

  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    const confirmDelete = confirm(
      "¿Estás seguro de eliminar este libro?"
    )

    if (!confirmDelete) return

    try {
      setIsDeleting(true)

      await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      })

      window.location.reload()
    } catch (error) {
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  async function handleReactivate() {
  try {
    setIsDeleting(true)

    await fetch(`/api/products?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isActive: true,
      }),
    })

    window.location.reload()
  } catch (error) {
    console.error(error)
  } finally {
    setIsDeleting(false)
  }
}

  return (
    <Box opacity={isActive ? 1 : 0.6}>
      <Card.Root
        overflow="hidden"
        borderRadius="2xl"
        boxShadow="md"
        transition="0.2s"
        bg="white"
        position="relative"
        _hover={{
          transform: "translateY(-4px)",
          boxShadow: "xl",
        }}
      >
        {!isActive && (
          <Box
            position="absolute"
            top="3"
            right="3"
            zIndex="10"
          >
            <Badge
              bg="red.500"
              color="white"
              px="3"
              py="1"
              borderRadius="full"
            >
              Inactivo
            </Badge>
          </Box>
        )}

        <Image
          src={images?.[0] || "/placeholder-book.jpg"}
          alt={title}
          h="220px"
          objectFit="cover"
        />

        <Card.Body gap="4">
          <VStack align="start" gap="2">
            <Badge
              bg="brand.sage"
              color="white"
              px="3"
              py="1"
              borderRadius="full"
              fontSize="xs"
            >
              {category}
            </Badge>

            <Card.Title
              fontSize="xl"
              color="brand.forest"
            >
              {title}
            </Card.Title>
          </VStack>

          <Card.Description
            color="gray.600"
            lineClamp={3}
          >
            {description}
          </Card.Description>

          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="brand.forest"
          >
            ${price}
          </Text>
        </Card.Body>

        <Card.Footer gap="3">
          <Button
            flex="1"
            bg="brand.forest"
            color="brand.beige"
            borderRadius="xl"
            fontWeight="600"
            onClick={() =>
              router.push(`/dashboard/${id}/edit`)
            }
            _hover={{
              bg: "brand.sage",
            }}
            disabled={!isActive}
          >
            Editar
          </Button>

          {isActive ? (
            <Button
              flex="1"
              bg="brand.clay"
              color="brand.beige"
              borderRadius="xl"
              fontWeight="600"
              onClick={handleDelete}
              loading={isDeleting}
            >
              Eliminar
            </Button>
          ) : (
            <Button
              flex="1"
              bg="green.600"
              color="white"
              borderRadius="xl"
              fontWeight="600"
              onClick={handleReactivate}
              loading={isDeleting}
              _hover={{
                bg: "green.700",
              }}
            >
              Reactivar
            </Button>
          )}
        </Card.Footer>
      </Card.Root>
    </Box>
  )
}