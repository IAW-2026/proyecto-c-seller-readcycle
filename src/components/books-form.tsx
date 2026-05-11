"use client"

import React, { useState } from "react"

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
  NativeSelect
} from "@chakra-ui/react"

import {
  LuCamera,
  LuSend
} from "react-icons/lu"


// --------------------
// TYPES
// --------------------

export interface Category {
  id: number
  name: string
}

export interface BookFormData {
  title: string
  description: string
  price: string
  stock: string
  weight: string
  image: string
  categoryId: string
}

interface BookFormProps {
  initialData?: BookFormData
  categories: Category[]
  mode?: "create" | "edit"
  onSubmit: (data: {
    title: string
    description: string
    price: number
    stock: number
    weight: number
    image: string
    categoryId: number
  }) => void
}



// --------------------
// INITIAL STATE
// --------------------

const emptyForm: BookFormData = {
  title: "",
  description: "",
  price: "",
  stock: "",
  weight: "",
  image: "",
  categoryId: ""
}



// --------------------
// COMPONENT
// --------------------

export const BookForm = ({
  initialData,
  categories,
  mode = "create",
  onSubmit
}: BookFormProps) => {

  const [formData, setFormData] = useState<BookFormData>(
    initialData || emptyForm
  )



  // --------------------
  // HANDLERS
  // --------------------

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



  const handleSubmit = () => {

    onSubmit({
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      weight: Number(formData.weight),
      categoryId: Number(formData.categoryId)
    })
  }



  // --------------------
  // STYLES
  // --------------------

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



  // --------------------
  // RENDER
  // --------------------

  return (

    <VStack gap={6} align="stretch">

      {/* INFORMACIÓN */}
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

          {/* IMAGE */}
          <Center
            h="220px"
            border="2px dashed"
            borderColor="brand.sage"
            borderRadius="brand"
            bg="brand.beige"
            cursor="pointer"
          >

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
                Agregar fotos
              </Text>

            </VStack>

          </Center>



          {/* INPUTS */}
          <VStack
            gap={4}
            gridColumn={{ md: "span 2" }}
            align="stretch"
          >

            {/* TITLE */}
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



            {/* GRID */}
            <SimpleGrid columns={2} gap={4}>

              {/* PRICE */}
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



              {/* STOCK */}
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



              {/* WEIGHT */}
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



              {/* CATEGORY */}
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
                  >

                    <option value="">
                      Selecciona una categoría
                    </option>

                    {categories.map(category => (

                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>

                    ))}

                  </NativeSelect.Field>

                </NativeSelect.Root>

              </Field.Root>

            </SimpleGrid>

          </VStack>

        </SimpleGrid>

      </Box>



      {/* DESCRIPTION */}
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



      {/* BUTTON */}
      <Button
        bg="brand.sage"
        color="white"
        py={7}
        _hover={{
          bg: "brand.forest"
        }}
        onClick={handleSubmit}
      >

        <Icon as={LuSend} mr={2} />

        {mode === "create"
          ? "Publicar libro"
          : "Guardar cambios"}

      </Button>

    </VStack>
  )
}