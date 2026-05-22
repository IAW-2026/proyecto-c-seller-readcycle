"use client"

import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Link,
  Spacer
} from "@chakra-ui/react"

import Image from "next/image"
import NextLink from "next/link"

export function Navbar() {
  return (
    <Box
      as="header"
      borderBottomWidth="1px"
      borderColor="brand.sand"
      bg="brand.beige"
      position="sticky"
      top="0"
      zIndex="sticky"
    >
      <Container
        maxW="full" 
        px={{ base: "4", md: "10" }} 
      >
        <Flex
          h="20"
          align="center"
        >
          <Link
            asChild
            textDecoration="none"
            _hover={{ textDecoration: "none" }}
          >
            <NextLink href="/">
              <Image
                src="/logoH.png"
                alt="ReadCycle Logo"
                width={180}
                height={60}
                style={{ objectFit: "contain" }}
                priority
              />
            </NextLink>
          </Link>

          <HStack gap="4" ml="10" display={{ base: "none", md: "flex" }}>
            <Link asChild href="/dashboard">
              <NextLink href="/dashboard">
                <Button
                  variant="ghost"
                  color="brand.forest"
                  borderRadius="brand"
                  fontFamily="heading"
                  fontWeight="600"
                  px="4"
                  _hover={{ bg: "brand.sand" }}
                >
                  Mis publicaciones
                </Button>
              </NextLink>
            </Link>

            <Link asChild href="/dashboard/new">
              <NextLink href="/dashboard/new">
                <Button
                  variant="ghost"
                  color="brand.forest"
                  borderRadius="brand"
                  fontFamily="heading"
                  fontWeight="600"
                  px="4"
                  _hover={{ bg: "brand.sand" }}
                >
                  Crear nueva publicación
                </Button>
              </NextLink>
            </Link>

            <Link asChild href="/dashboard/orders">
              <NextLink href="/dashboard/orders">
                <Button
                  variant="ghost"
                  color="brand.forest"
                  borderRadius="brand"
                  fontFamily="heading"
                  fontWeight="600"
                  px="4"
                  _hover={{ bg: "brand.sand" }}
                >
                  Historial de ventas
                </Button>
            </NextLink>
            </Link>
          </HStack>
          <Spacer />
        </Flex>
      </Container>
    </Box>
  )
}