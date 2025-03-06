"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LogOut, Home, Book, DollarSign, Plus } from "lucide-react"
import { supabase } from "@/lib/supabase"

const routes = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "My Stories",
    href: "/my-stories",
    icon: Book,
  },
  {
    title: "Create Content",
    href: "/create-content",
    icon: Plus,
  },
  {
    title: "Pricing",
    href: "/pricing",
    icon: DollarSign,
  },
]

export function Navigation() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = React.useState<any>(null)

  React.useEffect(() => {
    // Immediately fetch the current user
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    fetchUser()

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Navigation: Auth state changed:", event, session?.user?.email)
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
      }
    )

    // Clean up subscription
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    setUser(null) // Immediately clear the user state
    await supabase.auth.signOut()
    router.push("/")
  }

  const NavItems = () => (
    <>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center space-x-2 w-full p-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
            pathname === route.href ? "bg-gray-100 dark:bg-gray-800 text-primary" : "text-muted-foreground",
          )}
        >
          <route.icon className="h-5 w-5" />
          <span>{route.title}</span>
        </Link>
      ))}
    </>
  )

  return (
    <>
      {/* Mobile Navigation */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-40">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
            <div className="flex flex-col space-y-3">
              <NavItems />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-gray-50 dark:bg-gray-900 p-4">
        <div className="flex flex-col space-y-4">
          <NavItems />
        </div>
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
          {user ? (
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium">{user.email}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="justify-start">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </>
  )
}

