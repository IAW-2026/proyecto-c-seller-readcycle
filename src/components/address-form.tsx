"use client"

import { useUser } from "@clerk/nextjs"

import {
  Box,
  Button,
  Container,
  Field,
  Flex,
  Grid,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react"

export function AddressForm() {
  const { user } = useUser()
  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const addressData = {
      street: formData.get("street"),
      number: formData.get("number"),

      city: formData.get("city"),
      province: formData.get("province"),

      zipCode: formData.get("zipCode"),
    }
    try {
      await fetch("/api/address", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressData),
      })
      alert("Dirección guardada correctamente")
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <Box
      bg="brand.beige"
      minH="100vh"
      py={12}
    >
      <Container maxW="1200px">
        <Stack gap="5" mb="12">

          <Heading
            fontSize="5xl"
            color="brand.forest"
            fontWeight="800"
          >
            Mi Direccion
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
              Completa tu información de dirección
            </Text>
          </Flex>
        </Stack>
        <Grid
          templateColumns={{
            base: "1fr",
            lg: "2fr 1fr",
          }}
          gap={8}
          alignItems="start"
        >
          <Stack gap={8}>
            <form onSubmit={handleSubmit}>
              <Box
                bg="white"
                p={8}
                rounded="2xl"
                border="1px solid"
                borderColor="gray.200"
                shadow="sm"
              >
                <Grid
                  templateColumns={{
                    base: "1fr",
                    md: "repeat(2, 1fr)",
                  }}
                  gap={5}
                >
                  <Field.Root required>
                    <Field.Label fontWeight="600">
                      Calle
                    </Field.Label>
                    <Input
                      name="street"
                      placeholder="Ej: Mitre"
                      bg="gray.100"
                      border="none"
                      h="50px"
                    />
                  </Field.Root>
                  <Field.Root required>
                    <Field.Label fontWeight="600">
                      Número
                    </Field.Label>
                    <Input
                      name="number"
                      placeholder="123"
                      bg="gray.100"
                      border="none"
                      h="50px"
                    />
                  </Field.Root>
                  <Field.Root required>
                    <Field.Label fontWeight="600">
                      Ciudad
                    </Field.Label>
                    <Input
                      name="city"
                      placeholder="Ej: Bahía Blanca"
                      bg="gray.100"
                      border="none"
                      h="50px"
                    />
                  </Field.Root>
                  <Field.Root required>
                    <Field.Label fontWeight="600">
                      Provincia
                    </Field.Label>
                    <Input
                      name="province"
                      placeholder="Ej: Buenos Aires"
                      bg="gray.100"
                      border="none"
                      h="50px"
                    />
                  </Field.Root>
                  <Field.Root required>
                    <Field.Label fontWeight="600">
                      Código postal
                    </Field.Label>
                    <Input
                      name="zipCode"
                      bg="gray.100"
                      border="none"
                      h="50px"
                    />
                  </Field.Root>
                  <Field.Root required>
                    <Field.Label fontWeight="600">
                      País
                    </Field.Label>
                    <Input
                      name="country"
                      defaultValue="Argentina"
                      readOnly 
                      cursor="not-allowed"
                      bg="gray.100"
                      border="none"
                      h="50px"
                    />
                  </Field.Root>
                </Grid>
                <Button
                  type="submit"
                  mt={8}
                  w="full"
                  h="56px"
                  bg="brand.sage"
                  color="white"
                  rounded="xl"
                  fontWeight="600"
                  fontSize="md"
                  _hover={{
                    bg: "brand.forest",
                  }}
                >
                  Guardar dirección
                </Button>
              </Box>
            </form>
            <Text color="gray.500" fontSize="sm" mt={4} textAlign="center">
              Recuerda que solo puedes tener una direccion por usuario, pero puedes actualizarla cuando quieras
            </Text>
          </Stack>
        </Grid>
      </Container>
      
    </Box>
    
  )
}