import {
  Badge,
  Box,
  Container,
  Heading,
  HStack,
  Table,
  Text,
  VStack,
  Stack,
} from "@chakra-ui/react"

import {
  clerkClient,
  auth,
} from "@clerk/nextjs/server"

import { redirect } from "next/navigation"
import { isAdmin } from "../../../../lib/isAdmin"
import AdminDeleteUserButton from "../../../../components/admin/deleteUserButton"
import AdminEditUserButton from "../../../../components/admin/editUserButton"
import CreateUserForm from "../../../../components/admin/createUserForm"

export default async function AdminUsersPage() {
  const admin = await isAdmin()

  if (!admin) {
    redirect("/")
  }

  const { userId } = await auth()

  const client = await clerkClient()

  const users = await client.users.getUserList({
    limit: 100,
  })

  return (
     <Box bg="brand.beige" minH="100vh" py={2}>  
      <Container maxW="1400px" py="10">
        <VStack align="stretch" gap="8">
          <Stack gap="2">
            <Heading
              fontSize="5xl"
              color="brand.forest"
              fontWeight="900"
              lineHeight="1"
            >
              Administración de Usuarios
            </Heading>
          </Stack>
          <CreateUserForm />
          <Box
            bg="white"
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="2xl"
            overflow="hidden"
            shadow="md"
          >
            <Table.Root>
              <Table.Header bg="gray.50">
                <Table.Row>
                  <Table.ColumnHeader py="4">
                    Usuario
                  </Table.ColumnHeader>
                  <Table.ColumnHeader py="4">
                    Email
                  </Table.ColumnHeader>
                  <Table.ColumnHeader py="4">
                    Roles
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    py="4"
                    w="220px"
                  >
                    Acciones
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {users.data
                  .filter((user) => user.id !== userId)
                  .map((user) => { const roles = (user.publicMetadata.roles as string[]) || []
                    return (
                      <Table.Row
                        key={user.id}
                        _hover={{
                          bg: "gray.50",
                        }}
                      >
                        <Table.Cell py="5">
                          <VStack
                            align="start"
                            gap="0"
                          >
                            <Text
                              fontWeight="700"
                              color="brand.forest"
                            >
                              {user.firstName} {user.lastName}
                            </Text>
                          </VStack>
                        </Table.Cell>
                        <Table.Cell py="5">
                          <Text color="gray.700">
                            {user.emailAddresses[0]?.emailAddress}
                          </Text>
                        </Table.Cell>
                        <Table.Cell py="5">
                          <HStack gap="2">
                            {roles.map((role) => (
                              <Badge
                                key={role}
                                bg="brand.sand"
                                color="brand.forest"
                                borderRadius="full"
                                px="3"
                                py="1"
                                textTransform="capitalize"
                              >
                                {role}
                              </Badge>
                            ))}

                          </HStack>
                        </Table.Cell>
                        <Table.Cell py="5">
                          <HStack gap="3">
                            <AdminEditUserButton
                              user={{
                                id: user.id,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                roles,
                              }}
                            />
                            <AdminDeleteUserButton
                              userId={user.id}
                            />
                          </HStack>
                        </Table.Cell>
                      </Table.Row>
                    )
                  })}
              </Table.Body>
            </Table.Root>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}