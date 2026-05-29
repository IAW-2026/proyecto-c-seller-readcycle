import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react"

import Link from "next/link"
import { redirect } from "next/navigation"

import { isAdmin } from "../../../lib/isAdmin"

export default async function AdminPage() {
  const admin = await isAdmin()

  if (!admin) {
    redirect("/")
  }

  return (
    <Box bg="brand.beige" minH="100vh" py={2}> 
      <Container maxW="1400px" py="10" >
        <VStack align="stretch" gap="10">

          <Stack gap="5">
            <Heading
              fontSize="5xl"
              color="brand.forest"
              fontWeight="800"
              lineHeight="1"
            >
              Panel de Administración
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
                Gestioná usuarios y productos del marketplace
              </Text>
            </Flex>
          </Stack>

          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            gap="6"
          >

            <Box
              bg="white"
              borderWidth="1px"
              borderColor="brand.sand"
              borderRadius="brand"
              p="8"
              shadow="sm"
              transition="0.2s"
              _hover={{
                transform: "translateY(-4px)",
                shadow: "md",
              }}
            >
              <VStack
                align="start"
                gap="5"
                h="full"
              >

                <Heading
                  size="lg"
                  color="brand.forest"
                >
                  Usuarios
                </Heading>

                <Text
                  color="gray.600"
                  flex="1"
                >
                  Crear, visualizar y eliminar
                  usuarios del sistema.
                </Text>

                <Button
                  asChild
                  bg="brand.forest"
                  color="white"
                  size="lg"
                  borderRadius="brand"
                  _hover={{
                    opacity: 0.9,
                  }}
                >
                  <Link href="/dashboard/admin/users">
                    Administrar usuarios
                  </Link>
                </Button>

              </VStack>
            </Box>

            <Box
              bg="white"
              borderWidth="1px"
              borderColor="brand.sand"
              borderRadius="brand"
              p="8"
              shadow="sm"
              transition="0.2s"
              _hover={{
                transform: "translateY(-4px)",
                shadow: "md",
              }}
            >
              <VStack
                align="start"
                gap="5"
                h="full"
              >

                <Heading
                  size="lg"
                  color="brand.forest"
                >
                  Productos
                </Heading>

                <Text
                  color="gray.600"
                  flex="1"
                >
                  Visualizá y eliminá publicaciones
                  de cualquier vendedor.
                </Text>

                <Button
                  asChild
                  bg="brand.clay"
                  color="white"
                  size="lg"
                  borderRadius="brand"
                  _hover={{
                    opacity: 0.9,
                  }}
                >
                  <Link href="/dashboard/admin/products">
                    Administrar productos
                  </Link>
                </Button>

              </VStack>
            </Box>

          </SimpleGrid>

        </VStack>
      </Container>
     </Box>
  )
}