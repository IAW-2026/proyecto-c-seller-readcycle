"use client"

import { Button } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import ConfirmDialog from "../ui/confirmDialog"

interface Props {
  productId: string
}

export default function AdminDeleteProductButton({
  productId,
}: Props) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/admin/products/${productId}`,
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
        flex="1"
        bg="brand.clay"
        color="brand.beige"
        borderRadius="xl"
        fontWeight="600"
        onClick={() => setIsOpen(true)}
      >
        Eliminar
      </Button>
      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar Producto"
        description="¿Seguro que querés eliminar este producto?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loading}
      />
    </>
  )
}