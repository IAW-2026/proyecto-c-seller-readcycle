"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation" 
import {
  Alert,
  Box,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  Center
} from "@chakra-ui/react"
import { BookForm, Category } from "../../../../components/books-form"
import { SellingTipsPanel } from "../../../../components/selling-tips-panel"

export default function EditBookPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = params.id as string 

  const [hasAddress, setHasAddress] = useState<boolean | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [bookInitialData, setBookInitialData] = useState<any>(null)
  const [isLoadingBook, setIsLoadingBook] = useState(true)

  useEffect(() => {
    async function checkAddress() {
      try {
        const response = await fetch("/api/address")
        const data = await response.json()
        if (data?.id) {
          setHasAddress(true)
        } else {
          setHasAddress(false)
        }
      } catch (error) {
        console.error(error)
        setHasAddress(false)
      }
    }
    checkAddress()
  }, [])

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/categories")
        const data = await response.json()
        if (Array.isArray(data)) {
          setCategories(data)
        }
      } catch (error) {
        console.error("Error al cargar las categorías:", error)
      }
    }
    loadCategories()
  }, [])

  useEffect(() => {
    if (!bookId) return
    async function loadBookData() {
      try {
        const response = await fetch(`/api/products?id=${bookId}`)
        if (response.ok) {
          const data = await response.json()
          setBookInitialData(data)
        }
      } catch (error) {
        console.error("Error cargando el producto:", error)
      } finally {
        setIsLoadingBook(false)
      }
    }
    loadBookData()
  }, [bookId])

  const handleUpdate = async (data: {
    title: string
    description: string
    price: number
    stock: number
    weight: number
    categoryId: string
  }) => {
    try {
      const response = await fetch(`/api/products?id=${bookId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || "Error al actualizar el libro")
      }
      router.push("/dashboard")
    } catch (error: any) {
      console.error(error)
      alert(error.message)
    }
  }

  if (hasAddress === null || isLoadingBook) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" />
      </Center>
    )
  }
  return (
    <Box bg="brand.beige" minH="100vh" py={12}>
      <Container maxW="1200px">
        <Stack gap="3" mb="12">
          <Heading fontSize="5xl" color="brand.forest" fontWeight="800">
            Edita tu libro
          </Heading>
          <Flex align="center" gap="4">
            <Box w="50px" h="3px" bg="brand.clay" borderRadius="full" />
            <Text color="gray.600" fontSize="lg">
              Modifica los campos necesarios para actualizar tu publicación
            </Text>
          </Flex>
        </Stack>

        {!hasAddress && (
          <Alert.Root status="warning" rounded="2xl" bg="orange.50" border="1px solid" borderColor="orange.200">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Debes cargar una dirección antes de editar</Alert.Title>
            </Alert.Content>
          </Alert.Root>
        )}

        {hasAddress && (
          <SimpleGrid columns={{ base: 1, lg: 3 }} gap={8} alignItems="start">
            <Box gridColumn={{ lg: "span 2" }}>
              <BookForm 
                categories={categories} 
                onSubmit={handleUpdate} 
                initialData={bookInitialData} 
              />
            </Box>
            <SellingTipsPanel />
          </SimpleGrid>
        )}
      </Container>
    </Box>
  )
}