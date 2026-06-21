"use client"

import {
  Box,
  Button,
  HStack,
  Input,
  NativeSelect,
  VStack,
} from "@chakra-ui/react"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CreateUserForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("SELLER")

  async function handleSubmit() {
    const response = await fetch(
      "/api/admin/users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          surname,
          email,
          password,
          role,
        }),
      }
    )
    if (response.ok) {
      setName("")
      setSurname("")
      setEmail("")
      setPassword("")
      setRole("SELLER")

      router.refresh()
    }
  }

  return (
    <Box
      p="6"
      borderWidth="1px"
      borderRadius="2xl"
      bg="white"
    >
      <VStack gap="4">
        <HStack w="full">
          <Input
            placeholder="Nombre"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />
          <Input
            placeholder="Apellido"
            value={surname}
            onChange={(e) =>
              setSurname(e.target.value)
            }
          />

        </HStack>
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />
        <NativeSelect.Root>
          <NativeSelect.Field
            value={role}
            onChange={(
              e: React.ChangeEvent<HTMLSelectElement>
            ) => setRole(e.target.value)}
          >
            <option value="SELLER">
              Seller
            </option>

            <option value="ADMIN">
              Admin
            </option>
          </NativeSelect.Field>
        </NativeSelect.Root>
        <Button
          w="full"
          bg="brand.forest"
          color="white"
          onClick={handleSubmit}
        >
          Crear usuario
        </Button>
      </VStack>
    </Box>
  )
}