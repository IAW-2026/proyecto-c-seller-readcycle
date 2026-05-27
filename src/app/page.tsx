"use client"

import NextImage from "next/image"
import NextLink from "next/link"

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react"

export default function Home() {
  return (
    <Box
      minH="100vh"
      bg="brand.beige"
      position="relative"
      overflow="hidden"
    >
      {/* Background blobs */}
      <Box
        position="absolute"
        top="-10%"
        right="-5%"
        w="400px"
        h="400px"
        borderRadius="full"
        bg="brand.sand"
        filter="blur(120px)"
        opacity={0.5}
      />

      <Box
        position="absolute"
        top="60%"
        left="-5%"
        w="300px"
        h="300px"
        borderRadius="full"
        bg="brand.clay"
        filter="blur(120px)"
        opacity={0.2}
      />

      <Container maxW="container.xl" minH="100vh">
        <Flex
          direction="column"
          align="center"
          justify="center"
          textAlign="center"
          px={6}
          py={20}
          minH="100vh"
          position="relative"
        >
          {/* Logo */}
          <Box
            mb={12}
            transition="0.7s"
            _hover={{
              transform: "scale(1.05)",
            }}
            css={{
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
            }}
          >
            <NextImage
              src="/logo.png"
              alt="ReadCycle logo"
              width={350}
              height={80}
              priority
            />
          </Box>

          <Stack gap={8} align="center" maxW="700px">
            <Heading
              fontSize={{ base: "4xl", md: "6xl" }}
              lineHeight="1.1"
              fontWeight="extrabold"
              color="brand.forest"
              letterSpacing="tight"
            >
              Tus historias merecen
              <br />
              <Text as="span" color="brand.clay">
                un nuevo capítulo
              </Text>
            </Heading>

            <Text
              maxW="550px"
              fontSize={{ base: "lg", md: "xl" }}
              lineHeight="tall"
              color="brand.sage"
              opacity={0.8}
            >
              Dales una segunda vida a los libros que ya leíste y encontrá tu
              próxima aventura a un precio increíble.
            </Text>

            <Flex
              direction={{ base: "column", sm: "row" }}
              gap={4}
              mt={4}
              w="full"
              justify="center"
            >
              <Link asChild _hover={{ textDecoration: "none" }}>
                <NextLink href="/dashboard">
                  <Button
                    size="lg"
                    h="56px"
                    px={10}
                    borderRadius="full"
                    bg="brand.forest"
                    color="brand.beige"
                    fontSize="lg"
                    fontWeight="bold"
                    transition="all 0.2s"
                    _hover={{
                      bg: "brand.sage",
                      transform: "translateY(-4px)",
                      boxShadow: "lg",
                    }}
                    _active={{
                      transform: "scale(0.95)",
                    }}
                  >
                    Empezar a vender
                  </Button>
                </NextLink>
              </Link>
            </Flex>
          </Stack>

          {/* Footer phrase */}
          <Flex
            mt={24}
            align="center"
            gap={2}
            color="brand.forest"
            opacity={0.4}
            fontWeight="medium"
            letterSpacing="widest"
            textTransform="uppercase"
            fontSize="xs"
          >
            <Box w={8} h="1px" bg="brand.forest" opacity={0.2} />
            Libros usados, historias nuevas
            <Box w={8} h="1px" bg="brand.forest" opacity={0.2} />
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}