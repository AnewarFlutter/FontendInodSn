"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { IconChevronUp, IconChevronDown, IconRefresh } from "@tabler/icons-react"

interface StatsSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  onRefresh?: () => void
  filter?: React.ReactNode
}

export function StatsSection({
  title,
  children,
  defaultOpen = true,
  onRefresh,
  filter,
}: StatsSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
      <div className="flex items-center justify-between bg-muted/50 rounded-lg px-4 py-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex items-center gap-2">
          {filter}
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8">
              {isOpen ? (
                <IconChevronUp className="h-4 w-4" />
              ) : (
                <IconChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              Rafraîchir
              <IconRefresh className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <CollapsibleContent className="space-y-4 border border-dashed border-muted-foreground/30 rounded-lg p-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}
