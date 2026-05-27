"use client"

import { Button } from "@chakra-ui/react"
import { useRouter } from "next/navigation"

interface Props {
  productId: string
}

export default function AdminDeleteProductButton({
  productId,
}: Props) {
  const router = useRouter()

  async function handleDelete() {
    const confirmed = window.confirm(
      "¿Seguro que querés eliminar este producto?"
    )

    if (!confirmed) return

    const response = await fetch(
      `/api/admin/products/${productId}`,
      {
        method: "DELETE",
      }
    )

    if (response.ok) {
      router.refresh()
    }
  }

  return (
    <Button
      colorPalette="red"
      size="sm"
      onClick={handleDelete}
    >
      Eliminar
    </Button>
  )
}