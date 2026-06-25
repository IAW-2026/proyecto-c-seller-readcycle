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
  console.log("Usuario: ", userId)

  if (!userId) {
    redirect("/")
  }
  const clerkUser = await currentUser()
  console.log("Usuario2: ", clerkUser)

  if (!clerkUser) {
    redirect("/")
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  })

  if (!existingUser) {
    const email = clerkUser.emailAddresses[0]?.emailAddress || ""

    // Check if there is already a user with this email
    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      // Update their clerkUserId to the new one (migration)
      await prisma.user.update({
        where: {
          id: userWithSameEmail.id,
        },
        data: {
          clerkUserId: userId,
          name: clerkUser.firstName || userWithSameEmail.name,
          surname: clerkUser.lastName || userWithSameEmail.surname,
        },
      })
    } else {
      // Create new user
      await prisma.user.create({
        data: {
          clerkUserId: userId,
          name: clerkUser.firstName || "",
          surname: clerkUser.lastName || "",
          email,
        },
      })
    }

    const currentRoles =
      (clerkUser.publicMetadata
        ?.roles as string[]) || []

    if (currentRoles.length === 0) {
      const client = await clerkClient()

      await client.users.updateUserMetadata(
        userId,
        {
          publicMetadata: {
            roles: ["SELLER"],
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