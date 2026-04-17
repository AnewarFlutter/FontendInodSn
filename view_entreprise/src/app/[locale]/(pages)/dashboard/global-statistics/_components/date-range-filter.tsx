"use client"

import * as React from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { IconCalendar } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface DateRangeFilterProps {
  dateFrom?: Date | undefined
  dateTo?: Date | undefined
  onDateChange?: (dateFrom: Date | undefined, dateTo: Date | undefined) => void
}

export function DateRangeFilter({
  dateFrom: controlledDateFrom,
  dateTo: controlledDateTo,
  onDateChange
}: DateRangeFilterProps) {
  const [internalDateFrom, setInternalDateFrom] = React.useState<Date | undefined>(undefined)
  const [internalDateTo, setInternalDateTo] = React.useState<Date | undefined>(undefined)

  // Use controlled values if provided, otherwise use internal state
  const dateFrom = controlledDateFrom !== undefined ? controlledDateFrom : internalDateFrom
  const dateTo = controlledDateTo !== undefined ? controlledDateTo : internalDateTo

  const setDateFrom = (date: Date | undefined) => {
    setInternalDateFrom(date)
    onDateChange?.(date, dateTo)
  }

  const setDateTo = (date: Date | undefined) => {
    setInternalDateTo(date)
    onDateChange?.(dateFrom, date)
  }

  // Sync internal state with controlled values
  React.useEffect(() => {
    if (controlledDateFrom !== undefined) {
      setInternalDateFrom(controlledDateFrom)
    }
    if (controlledDateTo !== undefined) {
      setInternalDateTo(controlledDateTo)
    }
  }, [controlledDateFrom, controlledDateTo])

  return (
    <div className="flex items-center gap-2">
      {/* Date début */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "justify-start text-left font-normal w-[160px]",
              !dateFrom && "text-muted-foreground"
            )}
          >
            <IconCalendar className="mr-2 h-4 w-4" />
            {dateFrom ? (
              format(dateFrom, "dd MMM yyyy", { locale: fr })
            ) : (
              <span>Date début</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateFrom}
            onSelect={setDateFrom}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <span className="text-muted-foreground">-</span>

      {/* Date fin */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "justify-start text-left font-normal w-[160px]",
              !dateTo && "text-muted-foreground"
            )}
          >
            <IconCalendar className="mr-2 h-4 w-4" />
            {dateTo ? (
              format(dateTo, "dd MMM yyyy", { locale: fr })
            ) : (
              <span>Date fin</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateTo}
            onSelect={setDateTo}
            disabled={(date) => dateFrom ? date < dateFrom : false}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Bouton reset */}
      {(dateFrom || dateTo) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setInternalDateFrom(undefined)
            setInternalDateTo(undefined)
            onDateChange?.(undefined, undefined)
          }}
        >
          Réinitialiser
        </Button>
      )}
    </div>
  )
}
