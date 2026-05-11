"use client"

import {
  Box,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text
} from "@chakra-ui/react"

import {
  BookForm,
  Category
} from "../../../components/books-form"

import { SellingTipsPanel } from "../../../components/selling-tips-panel"

export default function CreateBookPage() {

  // Mock de categorías
  // Luego esto vendrá de Prisma/API
  const categories: Category[] = [
    { id: 1, name: "Programación" },
    { id: 2, name: "Novela" },
    { id: 3, name: "Ciencia ficción" },
    { id: 4, name: "Historia" },
    { id: 5, name: "Matemática" }
  ]



  // SUBMIT
  const handleCreate = (data: {
    title: string
    description: string
    price: number
    stock: number
    weight: number
    image: string
    categoryId: number
  }) => {

    console.log("Creando libro...", data)
  }



  return (

    <Box
      bg="brand.beige"
      minH="100vh"
      py={12}
    >

      <Container maxW="1200px">

        {/* Header */}
        <Stack gap="3" mb="12">

          <Heading
            fontSize="5xl"
            color="brand.forest"
            fontWeight="800"
          >
            Vende tu libro
          </Heading>

          <Flex align="center" gap="4">

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
              Completa la información para publicarlo
            </Text>

          </Flex>

        </Stack>



        {/* Layout */}
        <SimpleGrid
          columns={{ base: 1, lg: 3 }}
          gap={8}
          alignItems="start"
        >

          {/* Formulario */}
          <Box gridColumn={{ lg: "span 2" }}>

            <BookForm
              mode="create"
              categories={categories}
              onSubmit={handleCreate}
            />

          </Box>



          {/* Panel lateral */}
          <SellingTipsPanel />

        </SimpleGrid>

      </Container>

    </Box>
  )
}