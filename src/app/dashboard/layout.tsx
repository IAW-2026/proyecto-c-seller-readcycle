import { Navbar } from "../../components/navbar" 
import { Provider } from "../../components/ui/provider"
import { ClerkProvider } from "@clerk/nextjs"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-full flex flex-col" suppressHydrationWarning>
          <Provider>
            <Navbar />
            {children}
          </Provider>
    </main>
  )
}