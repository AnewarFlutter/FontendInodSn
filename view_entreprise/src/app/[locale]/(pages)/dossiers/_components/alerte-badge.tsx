"use client"

import { cn } from "@/lib/utils"
import { Clock, AlertTriangle, Zap } from "lucide-react"
import type { Alerte } from "../_lib/dossiers-data"

export function AlerteBadge({ alerte }: { alerte: Alerte }) {
  const config: Record<string, { label: string; icon: React.ElementType; cls: string }> = {
    j1:      { label: "J-1",      icon: Zap,           cls: "bg-red-500 text-white" },
    j3:      { label: "J-3",      icon: AlertTriangle, cls: "bg-orange-500 text-white" },
    j7:      { label: "J-7",      icon: Clock,         cls: "bg-amber-400 text-white" },
    depasse: { label: "EN RETARD",icon: AlertTriangle, cls: "bg-red-700 text-white" },
  }
  const c = config[alerte.niveau] ?? config.j7
  const Icon = c.icon
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold shrink-0",
      c.cls
    )}>
      <Icon className="h-2.5 w-2.5" strokeWidth={2.5} />
      {c.label}
    </span>
  )
}
