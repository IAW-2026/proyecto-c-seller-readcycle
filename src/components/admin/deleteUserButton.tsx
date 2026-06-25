"use client"

import { Button } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import ConfirmDialog from "../ui/confirmDialog"

interface Props {
  userId: string
}

export default function AdminDeleteUserButton({
  userId,
}: Props) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/admin/users/${userId}`,
        {
          method: "DELETE",
        }
      )

      if (response.ok) {
        router.refresh()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      setIsOpen(false)
    }
  }

  return (
    <>
      <Button
        size="sm"
        bg="brand.clay"
        color="white"
        borderRadius="lg"
        w="90px"
        onClick={() => setIsOpen(true)}
        _hover={{
          opacity: 0.9,
        }}
      >
        Eliminar
      </Button>
      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar Usuario"
        description="¿Seguro que querés eliminar este usuario?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loading}
      />
    </>
  )
}