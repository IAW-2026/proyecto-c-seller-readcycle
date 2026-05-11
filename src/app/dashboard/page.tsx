"use client"

import { Box, Container, Flex, Grid, Heading, Stack, Text } from "@chakra-ui/react"
import BookCard from "../../components/book-card"


interface Publication {
  id: number
  title: string
  author: string
  price: number
  image: string
  description: string
}

export default function ProductsPage() {
  const publications: Publication[] = [
    {
      id: 1,
      title: "1984",
      author: "George Orwell",
      price: 8000,
      description: "Una novela distópica que explora temas de vigilancia, totalitarismo y control social.",
      image: "/books/1984.jpg",
    },
    {
      id: 2,
      title: "El Principito",
      author: "Antoine de Saint-Exupéry",
      price: 6500,
      description: "Un cuento filosófico que explora temas de amistad, amor y la importancia de ver con el corazón.",
      image: "/books/principito.jpg",
    },
    {
      id: 3,
      title: "Clean Code",
      author: "Robert C. Martin",
      price: 12000,
      description: "Un libro que explora las mejores prácticas de programación y cómo escribir código limpio.",
      image: "/books/clean-code.jpg",
    },
  ]

  return (
    <Box bg="brand.beige" minH="100vh" py="12">
      <Container maxW="1200px">
        
        <Stack gap="3" mb="12" textAlign={{ base: "center", md: "left" }}>
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
            <Box w="50px" h="3px" bg="brand.clay" borderRadius="full" />
            <Text color="gray.600" fontSize="lg" fontWeight="medium">
              Gestiona tu biblioteca personal
            </Text>
          </Flex>
        </Stack>

        {publications.length === 0 ? (
          <Flex minH="40vh" align="center" justify="center" px="6" textAlign="center">
            <Stack maxW="500px" gap="6">
              <Text fontSize="3xl" fontWeight="700" color="brand.forest">
                Tu estante está vacío
              </Text>
              <Text fontSize="lg" color="gray.600">
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
              author={book.author}
              description={book.description}
              price={book.price}
              image={book.image}
            />
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  )
}