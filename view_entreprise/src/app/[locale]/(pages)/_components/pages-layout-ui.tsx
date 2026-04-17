"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Settings, LogOut, User, SquareTerminal, Sun, Moon } from "lucide-react"
import { useState, useEffect } from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { APP_ROUTES } from "@/shared/constants/routes"
import { useRouter } from "next/navigation"
import { logoutAction } from "@/actions/auth/session/session_actions"
import { NotificationSheet } from "@/components/notification-sheet"
import { ActionToaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/contexts/auth/auth_context"

// ─── Mock connected user ─────────────────────────────────────────────────────
const MOCK_CONNECTED_USER = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: null as string | null,
  initials: "JD",
}

export function PagesLayoutUI({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PagesLayoutContent>{children}</PagesLayoutContent>
    </AuthProvider>
  );
}

function PagesLayoutContent({ children }: { children: React.ReactNode }) {
  const connectedUser = MOCK_CONNECTED_USER

  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null
    const initialTheme = savedTheme || 'system'
    setTheme(initialTheme)
    applyTheme(initialTheme)
  }, [])

  const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      document.documentElement.classList.toggle('dark', systemTheme === 'dark')
    } else {
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
    }
  }

  const changeTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
    applyTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const navigateTo = (url: string) => {
    setOpen(false)
    router.push(url)
  }

  const handleLogout = async () => {
    await logoutAction()
    router.push(APP_ROUTES.home.root)
  }

  if (!mounted) {
    return null
  }

  return (
    <SidebarProvider>
      <ActionToaster />
      <AppSidebar />
      <SidebarInset className="min-w-0 overflow-x-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>

          <div className="flex-1 flex justify-center px-4">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="pl-8 pr-12 cursor-pointer"
                onClick={() => setOpen(true)}
                readOnly
              />
              <kbd className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4">
            <NotificationSheet />
            <Button variant="ghost" size="icon" onClick={() => changeTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

<DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    {connectedUser.avatar && (
                      <AvatarImage src={connectedUser.avatar} alt={connectedUser.name} />
                    )}
                    <AvatarFallback className="text-xs">{connectedUser.initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  {/* Affiche les infos de l'utilisateur connecté */}
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{connectedUser.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {connectedUser.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigateTo(`${APP_ROUTES.settings.root}?section=profile`)}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo(APP_ROUTES.settings.root)}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </div>
      </SidebarInset>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Rechercher une commande..." />
        <CommandList>
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => navigateTo(APP_ROUTES.dashboard.globalStatistics)}>
              <SquareTerminal className="mr-2 h-4 w-4" />
              <span>Statistiques globales</span>
            </CommandItem>
            <CommandItem onSelect={() => navigateTo(APP_ROUTES.userManagement.root)}>
              <SquareTerminal className="mr-2 h-4 w-4" />
              <span>Gestion des utilisateurs</span>
            </CommandItem>
            <CommandItem onSelect={() => navigateTo(APP_ROUTES.settings.root)}>
              <SquareTerminal className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </SidebarProvider>
  )
}
