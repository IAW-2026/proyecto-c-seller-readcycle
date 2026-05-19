"use client"

import {
  Badge,
  Button,
  Card,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

type BookCardProps = {
  id: string
  title: string
  description: string
  price: number
  image: string
  category: string
}

export default function BookCard({
  id,
  title,
  description,
  price,
  image,
  category,
}: BookCardProps) {

  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  
  async function handleDelete() {
    const confirmDelete = confirm(`¿Estás seguro de eliminar este libro?`)
    if (!confirmDelete) return
    try {
      await fetch(`/api/products?id=${id}`, { method: "DELETE" })
      window.location.reload()
    } catch (error) {
      console.error(error)
    }
  }
  
  return (
    <Card.Root
      overflow="hidden"
      borderRadius="2xl"
      boxShadow="md"
      transition="0.2s"
      bg="white"
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "xl",
      }}
    >
      <Image
        src={image}
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
          onClick={() => router.push(`/dashboard/${id}/edit`)} 
          _hover={{
            bg: "brand.sage"
          }}
        >
          Editar
        </Button>
        <Button
          flex="1"
          bg="brand.clay"
          color="brand.beige"
          borderRadius="xl"
          fontWeight="600"
          onClick={handleDelete}
        >
          Eliminar
        </Button>
      </Card.Footer>
    </Card.Root>
  )
}