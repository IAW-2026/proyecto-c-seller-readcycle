"use client"

import { Box, VStack, HStack, Center, Icon, Text } from "@chakra-ui/react"
import { LuCamera, LuTag, LuDollarSign } from "react-icons/lu"

export const SellingTipsPanel = () => {
  const tips = [
    { icon: LuCamera, title: "Toma buenas fotos", desc: "Fotos claras y bien iluminadas aumentan las ventas" },
    { icon: LuTag, title: "Describe el estado", desc: "Sé honesto sobre el estado del libro" },
    { icon: LuDollarSign, title: "Precio competitivo", desc: "Revisa precios similares en la plataforma" }
  ]

  return (
    <Box p={6} borderRadius="brand" border="1px solid" borderColor="gray.200" bg="white">
      <VStack align="stretch" gap={6}>
        <Text fontWeight="bold" color="brand.forest">Consejos para vender más</Text>
        {tips.map((tip, i) => (
          <HStack key={i} align="start" gap={3}>
            <Center boxSize="40px" bg="brand.beige" borderRadius="md" flexShrink={0}>
              <Icon as={tip.icon} color="brand.sage" />
            </Center>
            <VStack align="start" gap={0}>
              <Text fontSize="sm" fontWeight="bold">{tip.title}</Text>
              <Text fontSize="xs" color="gray.600">{tip.desc}</Text>
            </VStack>
          </HStack>
        ))}
      </VStack>
    </Box>
  )
}