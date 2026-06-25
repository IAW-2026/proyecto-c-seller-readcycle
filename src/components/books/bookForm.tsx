"use client"

import React, { useState, useEffect } from "react"

import {
  Box,
  Button,
  Field,
  Input,
  Textarea,
  SimpleGrid,
  VStack,
  Icon,
  Center,
  Text,
  NativeSelect,
  Image,
  HStack
} from "@chakra-ui/react"

import {
  LuCamera,
  LuSend
} from "react-icons/lu"

import { supabase } from "../../lib/supabase"
import { toaster } from "../ui/toaster"

export interface Category {
  id: string
  name: string
}

export interface BookFormData {
  title: string
  author: string
  description: string
  price: string
  stock: string
  weight: string
  categoryId: string
}

interface BookFormProps {
  categories: Category[]

  onSubmit: (data: {
    title: string
    author: string
    description: string
    price: number
    stock: number
    weight: number
    categoryId: string
    images: string[]
  }) => Promise<void>

  initialData?: {
    title: string
    author: string
    description: string
    price: number
    stock: number
    weight: number
    categoryId: string
  }

  initialImages?: string[]
}

const emptyForm: BookFormData = {
  title: "",
  author: "",
  description: "",
  price: "",
  stock: "",
  weight: "",
  categoryId: ""
}

export function BookForm({
  categories,
  onSubmit,
  initialData
}: BookFormProps) {
  const [formData, setFormData] = useState<BookFormData>(emptyForm)
  const [image, setImage] = useState<File | null>(null)
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        author: initialData.author || "",
        description: initialData.description || "",
        price: initialData.price?.toString() ?? "",
        stock: initialData.stock?.toString() ?? "1",
        weight: initialData.weight?.toString() ?? "0",
        categoryId: initialData.categoryId || ""
      })
    }
  }, [initialData])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImages = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return

    const file = e.target.files[0]

    if (!file) return

    setImage(file)

    setPreviewImages([
      URL.createObjectURL(file)
    ])
  }

  async function uploadImage(file: File) {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}.${fileExt}`

    const { error } = await supabase.storage
      .from("products")
      .upload(`books/${fileName}`, file)

    if (error) {
      throw error
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("products")
      .getPublicUrl(`books/${fileName}`)

    return publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.title ||
      !formData.author ||
      !formData.description ||
      !formData.price ||
      !formData.categoryId ||
      !formData.weight
    ) {
      toaster.create({
        title: "Campos obligatorios",
        description: "Por favor, completa los campos obligatorios.",
        type: "error",
      })
      return
    }

    try {
      setLoading(true)

      const imageUrl = image
        ? await uploadImage(image)
        : null

      await onSubmit({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        weight: Number(formData.weight),
        categoryId: formData.categoryId,

        images: imageUrl
          ? [imageUrl]
          : [],
      })

    } catch (error) {
      console.error(error)
      toaster.create({
        title: "Error",
        description: "Error al crear la publicación",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const focusStyles = {
    _focusVisible: {
      borderColor: "brand.sage",
      outline: "none",
      boxShadow: "0 0 0 1px var(--chakra-colors-brand-sage)"
    }
  }

  const numberInputStyles = {
    sx: {
      "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
        appearance: "none",
        margin: 0
      },
      "&[type=number]": {
        MozAppearance: "textfield"
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <VStack gap={6} align="stretch">
        <Box
          bg="white"
          p={8}
          borderRadius="brand"
          boxShadow="sm"
          border="1px solid"
          borderColor="gray.100"
        >
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            gap={8}
          >
            <VStack gap={4} align="stretch" h="100%">
              <Box position="relative" w="100%" h="220px">
                <Center
                  h="100%"
                  w="100%"
                  border="2px dashed"
                  borderColor="brand.sage"
                  borderRadius="brand"
                  bg="brand.beige"
                  overflow="hidden"
                >
                  {previewImages.length > 0 ? (
                    <Image
                      src={previewImages[0]}
                      alt="Preview"
                      w="100%"
                      h="100%"
                      objectFit="cover"
                    />
                  ) : (
                    <VStack gap={2}>
                      <Icon
                        as={LuCamera}
                        boxSize="40px"
                        color="brand.sage"
                      />

                      <Text
                        fontSize="sm"
                        fontWeight="bold"
                        color="brand.sage"
                      >
                        {initialData
                          ? "Cambiar foto"
                          : "Agregar foto *"}
                      </Text>
                    </VStack>
                  )}
                </Center>

                <Input
                  type="file"
                  accept="image/*"
                  position="absolute"
                  top={0}
                  left={0}
                  w="100%"
                  h="100%"
                  opacity={0}
                  cursor="pointer"
                  onChange={handleImages}
                />
              </Box>
            </VStack>

            <VStack
              gap={4}
              gridColumn={{ md: "span 2" }}
              align="stretch"
            >
              <Field.Root>
                <Field.Label
                  fontSize="xs"
                  fontWeight="bold"
                >
                  Título del libro *
                </Field.Label>

                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ej: Clean Code"
                  variant="subtle"
                  {...focusStyles}
                />
              </Field.Root>

              <Field.Root>
                <Field.Label
                  fontSize="xs"
                  fontWeight="bold"
                >
                  Autor *
                </Field.Label>

                <Input
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Ej: Robert C. Martin"
                  variant="subtle"
                  {...focusStyles}
                />
              </Field.Root>

              <SimpleGrid columns={2} gap={4}>
                <Field.Root>
                  <Field.Label
                    fontSize="xs"
                    fontWeight="bold"
                  >
                    Precio *
                  </Field.Label>

                  <Input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="$ 15000"
                    variant="subtle"
                    {...focusStyles}
                    {...numberInputStyles}
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label
                    fontSize="xs"
                    fontWeight="bold"
                  >
                    Stock *
                  </Field.Label>

                  <Input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="1"
                    variant="subtle"
                    {...focusStyles}
                    {...numberInputStyles}
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label
                    fontSize="xs"
                    fontWeight="bold"
                  >
                    Peso (kg) *
                  </Field.Label>

                  <Input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="0.5"
                    variant="subtle"
                    {...focusStyles}
                    {...numberInputStyles}
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label
                    fontSize="xs"
                    fontWeight="bold"
                  >
                    Categoría *
                  </Field.Label>

                  <NativeSelect.Root>
                    <NativeSelect.Field
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      {...focusStyles}
                    >
                      <option value="">
                        Selecciona una categoría
                      </option>

                      {categories.map((category) => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </option>
                      ))}
                    </NativeSelect.Field>

                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Field.Root>
              </SimpleGrid>
            </VStack>
          </SimpleGrid>
        </Box>

        <Box
          bg="white"
          p={8}
          borderRadius="brand"
          boxShadow="sm"
          border="1px solid"
          borderColor="gray.100"
        >
          <VStack
            align="start"
            gap={1}
            mb={4}
          >
            <Text
              fontSize="lg"
              fontWeight="bold"
              color="brand.forest"
            >
              Descripción
            </Text>
          </VStack>

          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Ej: Libro en excelente estado, sin anotaciones..."
            variant="subtle"
            rows={4}
            {...focusStyles}
          />
        </Box>

        <Button
          type="submit"
          bg="brand.sage"
          color="white"
          py={7}
          _hover={{
            bg: "brand.forest"
          }}
          loading={loading}
        >
          <Icon as={LuSend} mr={2} />

          {initialData
            ? "Guardar cambios"
            : "Publicar libro"}
        </Button>
      </VStack>
    </form>
  )
}