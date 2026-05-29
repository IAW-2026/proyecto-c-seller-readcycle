"use client"

import {
  Button,
  Checkbox,
  Dialog,
  Field,
  Input,
  Stack,
  Text,
  VStack,
  HStack,
  Portal,
} from "@chakra-ui/react"

import { useState } from "react"

interface Props {
  user: {
    id: string
    firstName: string | null
    lastName: string | null
    roles: string[]
  }
}

export default function AdminEditUserButton({
  user,
}: Props) {
  const [firstName, setFirstName] = useState(
    user.firstName || ""
  )

  const [lastName, setLastName] = useState(
    user.lastName || ""
  )

  const [roles, setRoles] = useState<string[]>(
    user.roles || []
  )

  const [loading, setLoading] = useState(false)

  const toggleRole = (role: string) => {
    if (roles.includes(role)) {
      setRoles(
        roles.filter((r) => r !== role)
      )
    } else {
      setRoles([...roles, role])
    }
  }

  const onSubmit = async () => {
    try {
      setLoading(true)

      const response = await fetch(
        `/api/admin/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            roles,
          }),
        }
      )

      if (!response.ok) {
        throw new Error("Error")
      }

      window.location.reload()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog.Root>

      <Dialog.Trigger asChild>

        <Button
            size="sm"
            bg="brand.sage"
            color="white"
            borderRadius="lg"
            w="90px"
            _hover={{
                bg: "brand.forest",
            }}
            >
            Editar
        </Button>

      </Dialog.Trigger>

      <Portal>

        <Dialog.Backdrop />

        <Dialog.Positioner>

          <Dialog.Content
            borderRadius="2xl"
            maxW="500px"
            w="full"
            maxH="90vh"
            overflow="hidden"
          >

            <Dialog.Header p="6" pb="2">

              <VStack
                align="start"
                gap="0"
              >

                <Dialog.Title
                  fontSize="2xl"
                  fontWeight="800"
                  color="brand.forest"
                >
                  Editar Usuario
                </Dialog.Title>

                <Text
                  fontSize="sm"
                  color="gray.500"
                >
                  Modificá la información del usuario
                </Text>

              </VStack>

            </Dialog.Header>

            <Dialog.Body
              p="6"
              overflowY="auto"
              flex="1"
            >

              <Stack gap="5">

                <Field.Root>

                  <Field.Label>
                    Nombre
                  </Field.Label>

                  <Input
                    borderRadius="lg"
                    value={firstName}
                    onChange={(e) =>
                      setFirstName(
                        e.target.value
                      )
                    }
                  />

                </Field.Root>

                <Field.Root>

                  <Field.Label>
                    Apellido
                  </Field.Label>

                  <Input
                    borderRadius="lg"
                    value={lastName}
                    onChange={(e) =>
                      setLastName(
                        e.target.value
                      )
                    }
                  />

                </Field.Root>

                <VStack
                  align="start"
                  gap="3"
                >

                  <Text fontWeight="600">
                    Roles
                  </Text>

                  <Checkbox.Root
                    checked={roles.includes(
                      "admin"
                    )}
                    onCheckedChange={() =>
                      toggleRole("admin")
                    }
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label>
                      Admin
                    </Checkbox.Label>
                  </Checkbox.Root>

                  <Checkbox.Root
                    checked={roles.includes(
                      "seller"
                    )}
                    onCheckedChange={() =>
                      toggleRole("seller")
                    }
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label>
                      Seller
                    </Checkbox.Label>
                  </Checkbox.Root>

                </VStack>

              </Stack>

            </Dialog.Body>

            <Dialog.Footer p="6">

              <HStack w="full">

                <Dialog.ActionTrigger asChild>

                  <Button
                    variant="outline"
                    borderRadius="lg"
                    flex="1"
                  >
                    Cancelar
                  </Button>

                </Dialog.ActionTrigger>

                <Button
                  onClick={onSubmit}
                  loading={loading}
                  bg="brand.sage"
                  borderRadius="lg"
                  flex="1"
                >
                  Guardar cambios
                </Button>

              </HStack>

            </Dialog.Footer>

          </Dialog.Content>

        </Dialog.Positioner>

      </Portal>

    </Dialog.Root>
  )
}