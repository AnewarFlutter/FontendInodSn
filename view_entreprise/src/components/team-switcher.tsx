"use client"

import * as React from "react"
import Image from "next/image"
import { APP_IMAGES } from "@/shared/constants/images"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

type ConnectionStatus = "online" | "weak" | "offline"

const WEAK_THRESHOLD_MS = 1500

async function checkInternet(): Promise<ConnectionStatus> {
  try {
    const start = Date.now()
    await fetch("https://www.google.com/favicon.ico", {
      mode: "no-cors",
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    })
    const duration = Date.now() - start
    return duration > WEAK_THRESHOLD_MS ? "weak" : "online"
  } catch {
    return "offline"
  }
}

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  const [status, setStatus] = React.useState<ConnectionStatus>("online")

  React.useEffect(() => {
    let cancelled = false

    const check = async () => {
      const result = await checkInternet()
      if (!cancelled) setStatus(result)
    }

    check()
    const interval = setInterval(check, 10_000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="hover:bg-transparent cursor-default">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden bg-white shrink-0">
            <Image src={APP_IMAGES.logo.main} alt="NotaDesk" width={32} height={32} className="object-contain" />
          </div>
          {!isCollapsed && (
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-bold tracking-tight">NotaDesk</span>
              <div className="inline-flex w-fit items-center gap-1 mt-0.5 px-1.5 py-0.5 rounded-md border border-dashed border-muted-foreground/30">
                <span className={`size-2 rounded-full ${
                  status === "online" ? "bg-green-500 animate-pulse" :
                  status === "weak" ? "bg-yellow-400 animate-pulse" :
                  "bg-red-500"
                }`} />
                <span className={`text-xs italic ${
                  status === "online" ? "text-green-500" :
                  status === "weak"   ? "text-yellow-400" :
                  "text-red-500"
                }`}>
                  {status === "online" ? "Forte connexion" :
                   status === "weak" ? "Connexion faible" :
                   "Hors Ligne"}
                </span>
              </div>
            </div>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
