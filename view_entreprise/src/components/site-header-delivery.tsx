'use client';

import { useState } from "react"
import { Sun, Moon, User, Settings, LogOut, Bell, CheckCircle2, AlertCircle, Package, DollarSign, CheckCheck } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { APP_ROUTES } from "@/shared/constants/routes"

// Mock notifications data
const notifications = [
  {
    id: 1,
    type: 'success',
    icon: CheckCircle2,
    iconColor: 'text-green-600',
    title: 'Commande terminée',
    message: 'Livraison #12345 complétée avec succès',
    time: 'Il y a 5 minutes'
  },
  {
    id: 2,
    type: 'info',
    icon: Package,
    iconColor: 'text-blue-600',
    title: 'Nouvelle mission',
    message: 'Une nouvelle mission de livraison vous a été attribuée',
    time: 'Il y a 15 minutes'
  },
  {
    id: 3,
    type: 'warning',
    icon: AlertCircle,
    iconColor: 'text-amber-600',
    title: 'Alerte: Retard signalé',
    message: 'La livraison #12340 accuse un retard',
    time: 'Il y a 1 heure'
  },
  {
    id: 4,
    type: 'success',
    icon: DollarSign,
    iconColor: 'text-green-600',
    title: 'Paiement reçu',
    message: 'Vous avez reçu 15 000 FCFA',
    time: 'Il y a 2 heures'
  },
  {
    id: 5,
    type: 'warning',
    icon: AlertCircle,
    iconColor: 'text-red-600',
    title: 'Commande urgente',
    message: 'Commande #12350 nécessite une intervention immédiate',
    time: 'Il y a 3 heures'
  },
];

export function SiteHeader() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [unreadNotifications, setUnreadNotifications] = useState(notifications);
  const notificationCount = unreadNotifications.length;

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const markAllAsRead = () => {
    setUnreadNotifications([]);
  };

  const handleNavigation = (url: string) => {
    router.push(url);
  };

  const handleLogout = () => {
    router.push((APP_ROUTES as any).deliveryAuth.logout);
  };
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="ml-auto flex items-center gap-2">
          {/* Notification Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-semibold text-white animate-pulse">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {notificationCount > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {notificationCount} {notificationCount === 1 ? 'nouvelle' : 'nouvelles'}
                  </span>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[400px] overflow-y-auto">
                {unreadNotifications.length > 0 ? (
                  unreadNotifications.map((notification) => {
                    const IconComponent = notification.icon;
                    return (
                      <DropdownMenuItem key={notification.id} className="cursor-pointer p-3">
                        <div className="flex gap-3 w-full">
                          <div className="flex-shrink-0 mt-0.5">
                            <IconComponent className={`h-5 w-5 ${notification.iconColor}`} />
                          </div>
                          <div className="flex flex-col gap-1 flex-1 min-w-0">
                            <p className="text-sm font-medium leading-none">{notification.title}</p>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">{notification.time}</p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-muted-foreground">
                    Aucune nouvelle notification
                  </div>
                )}
              </div>
              {unreadNotifications.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-center justify-center font-medium gap-2"
                    onClick={markAllAsRead}
                  >
                    <CheckCheck className="h-4 w-4" />
                    Marquer tout comme lu
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <Sun className="h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User Avatar with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  SN
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Jean Dupont</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    jean@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleNavigation((APP_ROUTES as any).profileDelivery.profile)}>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigation((APP_ROUTES as any).profileDelivery.settings)}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigation((APP_ROUTES as any).profileDelivery.notifications)}>
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
