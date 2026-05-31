"use client"

import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Link,
  Spacer,
} from "@chakra-ui/react"

import Image from "next/image"
import NextLink from "next/link"

import {
  Show,
  SignInButton,
  SignUpButton,
  useUser
} from "@clerk/nextjs"

import UserButton from "./clerkUserButton"

export function Navbar() {
  const { user } = useUser()
  const isAdmin = (user?.publicMetadata?.roles as string[])?.includes("admin")
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
        <Flex h="20" align="center">
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
                <Button variant="ghost" color="brand.forest" borderRadius="brand" fontFamily="heading" fontWeight="600" px="4" _hover={{ bg: "brand.sand" }} > 
                  Mis publicaciones 
                </Button>
              </NextLink> 
            </Link>

           <Link asChild href="/dashboard/new"> 
            <NextLink href="/dashboard/new"> 
                <Button variant="ghost" color="brand.forest" borderRadius="brand" fontFamily="heading" fontWeight="600" px="4" _hover={{ bg: "brand.sand" }} > 
                  Crear nueva publicación 
                </Button> 
              </NextLink> 
            </Link>

            <Link asChild href="/dashboard/orders"> 
              <NextLink href="/dashboard/orders"> 
                <Button variant="ghost" color="brand.forest" borderRadius="brand" fontFamily="heading" fontWeight="600" px="4" _hover={{ bg: "brand.sand" }} > 
                  Historial de ventas 
                </Button> 
              </NextLink> 
              </Link>
              {isAdmin && (
                <Link asChild href="/dashboard/admin">
                  <NextLink href="/dashboard/admin">
                    <Button
                      bg="brand.clay"
                      color="white"
                      borderRadius="brand"
                      fontFamily="heading"
                      fontWeight="600"
                      px="5"
                      py="2"
                      shadow="sm"
                      transition="0.2s"
                      _hover={{
                        bg: "red.700",
                        transform: "translateY(-1px)",
                      }}
                      _active={{
                        transform: "scale(0.98)",
                      }}
                    >
                      Panel Administrador
                    </Button>
                  </NextLink>
                </Link>
              )}
          </HStack>
          <Spacer />

          <HStack gap="3">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  color="brand.forest"
                >
                  Iniciar sesión
                </Button>
              </SignInButton>

              <SignUpButton mode="modal">
                <Button
                  bg="brand.forest"
                  color="white"
                  _hover={{ opacity: 0.9 }}
                >
                  Registrarse
                </Button>
              </SignUpButton>
            </Show>

            <Show when="signed-in">
              <UserButton />
            </Show>
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}