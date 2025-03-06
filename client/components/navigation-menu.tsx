"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LogOut } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

const routes = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "My Stories",
    href: "/my-stories",
  },
]

export function NavigationMenu() {
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
        console.log("Auth state changed:", event, session?.user?.email)
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
    setUser(null)
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <div className="flex justify-between items-center">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
            <div className="flex flex-col space-y-3">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === route.href ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {route.title}
                </Link>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
      <nav className="hidden md:block">
        <ul className="flex space-x-4">
          {routes.map((route) => (
            <li key={route.href}>
              <Link
                href={route.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === route.href ? "text-primary" : "text-muted-foreground",
                )}
              >
                {route.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div>
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}

