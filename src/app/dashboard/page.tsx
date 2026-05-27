"use client"

import { useEffect, useState } from "react"

import {
  Box,
  Container,
  Flex,
  Grid,
  Heading,
  Stack,
  Text,
  Spinner,
  Center
} from "@chakra-ui/react"

import BookCard from "../../components/book-card"

interface Publication {
  id: string
  title: string
  price: number
  description: string
  category: {
    name: string
  }
  isActive: boolean

  images?: { url: string }[]
}

export default function ProductsPage() {

  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products")
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error)
        }
        setPublications(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <Box bg="brand.beige" minH="100vh" py="12">
      <Container maxW="1200px">
        <Stack
          gap="3"
          mb="12"
          textAlign={{ base: "center", md: "left" }}
        >

          <Heading
            as="h1"
            fontSize={{ base: "3xl", md: "5xl" }}
            color="brand.forest"
            fontWeight="800"
            letterSpacing="tight"
          >
            Mis Publicaciones
          </Heading>

          <Flex
            align="center"
            gap="4"
            justify={{ base: "center", md: "flex-start" }}
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
              fontWeight="medium"
            >
              Gestiona tu biblioteca personal
            </Text>
          </Flex>
        </Stack>
        {loading ? (
          <Center py="20">
            <Spinner size="xl" />
          </Center>
        ) : publications.length === 0 ? (
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
                Tu estante está vacío
              </Text>
              <Text
                fontSize="lg"
                color="gray.600"
              >
                Publicá tu primer libro hoy y conectá con alguien que esté buscando tu próxima gran historia.
              </Text>
            </Stack>
          </Flex>
        ) : (
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap="8"
          >
            {publications.map((book) => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                description={book.description}
                price={book.price}
                images={book.images?.map(img => img.url) || []}
                category={book.category.name}
                isActive={book.isActive}
              />
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  )
}