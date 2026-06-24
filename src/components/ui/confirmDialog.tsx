"use client"

import {
  Button,
  Dialog,
  HStack,
  Portal,
  Text,
} from "@chakra-ui/react"

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar acción",
  description = "¿Estás seguro de realizar esta acción?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(details) => !details.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            borderRadius="2xl"
            maxW="400px"
            w="full"
            p="6"
            bg="white"
          >
            <Dialog.Header p="0" mb="4">
              <Dialog.Title
                fontSize="xl"
                fontWeight="800"
                color="brand.forest"
              >
                {title}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body p="0" mb="6">
              <Text color="gray.600">
                {description}
              </Text>
            </Dialog.Body>
            <Dialog.Footer p="0">
              <HStack w="full" gap="3">
                <Button
                  variant="outline"
                  borderRadius="xl"
                  flex="1"
                  onClick={onClose}
                  disabled={loading}
                >
                  {cancelText}
                </Button>
                <Button
                  onClick={async () => {
                    await onConfirm()
                  }}
                  loading={loading}
                  bg="brand.clay"
                  color="brand.beige"
                  borderRadius="xl"
                  flex="1"
                  _hover={{
                    bg: "brand.sage",
                  }}
                >
                  {confirmText}
                </Button>
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
