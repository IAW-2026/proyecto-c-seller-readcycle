import {
  Badge,
  Card,
  Flex,
  Heading,
  HStack,
  Image,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react"

type Order = {
  id: string

  createdAt: string

  total: number
  shippingCost: number

  status: string
  shippingStatus: string

  buyerId: string

  items: {
    id: string

    quantity: number
    price: number
    subtotal: number

    product: {
      id: string
      title: string
      description: string
      stock: number

      category: {
        name: string
      }

      images: {
        id: string
        url: string
        isPrimary: boolean
      }[]
    }
  }[]
}

interface OrdersListProps {
  orders: Order[]
}

export function OrdersList({
  orders,
}: OrdersListProps) {
  return (
    <VStack
      gap={6}
      align="stretch"
    >
      {orders.map((order) => (
        <Card.Root
          key={order.id}
          bg="white"
          borderRadius="brand"
          overflow="hidden"
          border="1px solid"
          borderColor="brand.sand"
          shadow="sm"
        >
          <Card.Header>
            <Flex
              justify="space-between"
              align={{
                base: "start",
                md: "center",
              }}
              direction={{
                base: "column",
                md: "row",
              }}
              gap={4}
            >
              <VStack
                align="start"
                gap={1}
              >
                <Heading
                  size="md"
                  color="brand.forest"
                >
                  Orden #{order.id}
                </Heading>
                <Text
                  color="gray.500"
                  fontSize="sm"
                >
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString()}
                </Text>
              </VStack>
              <HStack wrap="wrap">
                <Badge
                  px={3}
                  py={1}
                  borderRadius="full"
                  bg="brand.sage"
                  color="white"
                >
                  {order.status}
                </Badge>
                <Badge
                  px={3}
                  py={1}
                  borderRadius="full"
                  bg="brand.clay"
                  color="white"
                >
                  {order.shippingStatus}
                </Badge>
              </HStack>
            </Flex>
          </Card.Header>
          <Card.Body>
            <VStack
              align="stretch"
              gap={6}
            >
              <BoxInfo
                label="Buyer ID"
                value={order.buyerId}
              />
              <SimpleGrid
                columns={{
                  base: 1,
                  lg: 2,
                }}
                gap={4}
              >
                {order.items.map((item) => {
                  const primaryImage =
                    item.product.images.find(
                      (image) => image.isPrimary
                    )?.url ?? item.product.images[0]?.url ??"https://placehold.co/120x160"
                  return (
                    <Card.Root
                      key={item.id}
                      bg="brand.beige"
                      borderRadius="brand"
                    >
                      <Card.Body>
                        <HStack
                          align="start"
                          gap={4}
                        >
                          <Image
                            src={primaryImage}
                            alt={item.product.title}
                            w="90px"
                            h="120px"
                            objectFit="cover"
                            borderRadius="lg"
                          />
                          <Stack flex={1}>
                            <Heading
                              size="sm"
                              color="brand.forest"
                            >
                              {item.product.title}
                            </Heading>
                            <Text
                              fontSize="sm"
                              color="gray.600"
                              lineClamp={3}
                            >
                              {item.product.description}
                            </Text>
                            <Badge
                              w="fit-content"
                              bg="brand.sand"
                              color="brand.forest"
                            >
                              {item.product.category.name}
                            </Badge>
                            <HStack
                              justify="space-between"
                              mt={2}
                            >
                              <Text
                                fontWeight="bold"
                                color="brand.sage"
                              >
                                $
                                {item.subtotal}
                              </Text>
                              <Text
                                fontSize="sm"
                                color="gray.500"
                              >
                                x
                                {item.quantity}
                              </Text>
                            </HStack>
                          </Stack>
                        </HStack>
                      </Card.Body>
                    </Card.Root>
                  )
                })}
              </SimpleGrid>
              <Flex
                justify="space-between"
                align="center"
                pt={4}
                borderTop="1px solid"
                borderColor="brand.sand"
              >
                <VStack
                  align="start"
                  gap={0}
                >
                  <Text
                    color="gray.500"
                    fontSize="sm"
                  >
                    Envío
                  </Text>

                  <Text
                    fontWeight="semibold"
                    color="brand.forest"
                  >
                    ${order.shippingCost}
                  </Text>
                </VStack>
                <VStack
                  align="end"
                  gap={0}
                >
                  <Text
                    color="gray.500"
                    fontSize="sm"
                  >
                    Total
                  </Text>
                  <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    color="brand.sage"
                  >
                    ${order.total}
                  </Text>
                </VStack>
              </Flex>
            </VStack>
          </Card.Body>
        </Card.Root>
      ))}
    </VStack>
  )
}

function BoxInfo({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <VStack
      align="start"
      gap={1}
    >
      <Text
        fontWeight="bold"
        color="brand.forest"
      >
        {label}
      </Text>
      <Text color="gray.700">
        {value}
      </Text>
    </VStack>
  )
}