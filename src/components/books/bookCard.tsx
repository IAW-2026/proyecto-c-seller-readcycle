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
import ConfirmDialog from "../ui/confirmDialog"

interface BookCardProps {
  id: string
  title: string
  author: string
  description: string
  price: number
  stock: number
  images: string[]
  category: string
  isActive: boolean
}

export default function BookCard({
  id,
  title,
  author,
  description,
  price,
  stock,
  images,
  category,
  isActive,
}: BookCardProps) {

  const [isDeleting, setIsDeleting] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const router = useRouter()

  async function handleDelete() {
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
      setIsConfirmOpen(false)
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
    <Card.Root
      overflow="hidden"
      borderRadius="2xl"
      boxShadow="md"
      transition="0.2s"
      bg="white"
      position="relative"
      h="620px"
      display="flex"
      flexDirection="column"
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "xl",
      }}
      opacity={isActive ? 1 : 0.6}
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
        h="230px"
        minH="220px"
        objectFit="cover"
      />
      <Card.Body
        flex="1"
        display="flex"
        flexDirection="column"
        overflow="hidden"
        minH="0"
      >
        <VStack
          align="start"
          gap="2"
          mb="4"
        >
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
            lineClamp={2}
          >
            {title}
          </Card.Title>
          <Text
            fontSize="sm"
            color="gray.500"
            fontWeight="medium"
            lineClamp={1}
          >
            {author}
          </Text>
        </VStack>
        <Box
          h="72px"
          overflow="hidden"
          mb="4"
          flexShrink={0}
        >
          <Text
            color="gray.600"
            lineClamp={3}
          >
            {description}
          </Text>
        </Box>
        <Box mt="auto">
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="brand.forest"
          >
            ${price}
          </Text>
          <Text
            fontSize="sm"
            color={stock > 0 ? "brand.sage" : "brand.clay"}
            fontWeight="semibold"
          >
            {stock > 0
              ? `Stock disponible: ${stock}`
              : "Sin stock"}
          </Text>
        </Box>
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
            onClick={() => setIsConfirmOpen(true)}
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
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar Libro"
        description="¿Estás seguro de eliminar este libro?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={isDeleting}
      />
    </Card.Root>
  )
}