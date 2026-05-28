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

import AdminDeleteUserButton from "../../../../components/admin-delete-user-button"
import CreateUserForm from "../../../../components/create-user-form"

export default async function AdminUsersPage() {
  const admin = await isAdmin()

  if (!admin) {
    redirect("/")
  }

  const { userId } = await auth()

  const client = await clerkClient()

  const users = await client.users.getUserList()

  return (
    <Container maxW="1400px" py="10">
      <VStack align="stretch" gap="8">

        <Stack gap="5">
          <Heading
            fontSize="5xl"
            color="brand.forest"
            fontWeight="800"
            lineHeight="1"
          >
            Administración de Usuarios
          </Heading>
        </Stack>

        <CreateUserForm />

        <Box
          bg="white"
          borderWidth="1px"
          borderColor="brand.sand"
          borderRadius="brand"
          overflow="hidden"
          shadow="sm"
        >
          <Table.Root>

            <Table.Header bg="brand.beige">
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

                <Table.ColumnHeader py="4">
                  Acciones
                </Table.ColumnHeader>

              </Table.Row>
            </Table.Header>

            <Table.Body>
              {users.data.filter((user) => user.id !== userId).map((user) => {
                  const roles =
                    (user.publicMetadata.roles as string[]) || []

                  return (
                    <Table.Row key={user.id}>

                      <Table.Cell>
                        <Text fontWeight="600">
                          {user.firstName} {user.lastName}
                        </Text>
                      </Table.Cell>

                      <Table.Cell>
                        {user.emailAddresses[0]?.emailAddress}
                      </Table.Cell>

                      <Table.Cell>
                        <HStack>

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

                      <Table.Cell>
                        <AdminDeleteUserButton
                          userId={user.id}
                        />
                      </Table.Cell>

                    </Table.Row>
                  )
                })}
            </Table.Body>

          </Table.Root>
        </Box>

      </VStack>
    </Container>
  )
}