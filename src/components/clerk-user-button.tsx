"use client"

import { UserButton } from "@clerk/nextjs"

export default function UserMenu() {
  return (
    <UserButton>
      <UserButton.MenuItems>
        <UserButton.Link
          label="Mi Direccion"
          href="/dashboard/address"
          labelIcon="👤"
        />
      </UserButton.MenuItems>
    </UserButton>
  )
}