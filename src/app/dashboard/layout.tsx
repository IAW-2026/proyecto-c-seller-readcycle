import { auth, currentUser, clerkClient } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import prisma from "../../lib/prisma"
import { Navbar } from "../../components/navbar"
import { Provider } from "../../components/ui/provider"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/")
  }
  const clerkUser = await currentUser()

  if (!clerkUser) {
    redirect("/")
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  })

if (!existingUser) {
  await prisma.user.create({
    data: {
      clerkUserId: userId,
      name:
        clerkUser.firstName || "",
      surname:
        clerkUser.lastName || "",
      email:
        clerkUser.emailAddresses[0]
          ?.emailAddress || "",
    },
  })

  const currentRoles =
    (clerkUser.publicMetadata
      ?.roles as string[]) || []

  if (currentRoles.length === 0) {
    const client = await clerkClient()

    await client.users.updateUserMetadata(
      userId,
      {
        publicMetadata: {
          roles: ["seller"],
        },
      }
    )
  }
}
  return (
    <main className="min-h-full flex flex-col" suppressHydrationWarning>
      <Provider>
        <Navbar />
        {children}
      </Provider>
    </main>
  )
}