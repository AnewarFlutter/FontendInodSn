"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart"

const chartData = [
  { date: "2024-04-01", desktop: 2220000, mobile: 1500000 },
  { date: "2024-04-02", desktop: 970000, mobile: 1800000 },
  { date: "2024-04-03", desktop: 1670000, mobile: 1200000 },
  { date: "2024-04-04", desktop: 2420000, mobile: 2600000 },
  { date: "2024-04-05", desktop: 3730000, mobile: 2900000 },
  { date: "2024-04-06", desktop: 3010000, mobile: 3400000 },
  { date: "2024-04-07", desktop: 2450000, mobile: 1800000 },
  { date: "2024-04-08", desktop: 4090000, mobile: 3200000 },
  { date: "2024-04-09", desktop: 590000, mobile: 1100000 },
  { date: "2024-04-10", desktop: 2610000, mobile: 1900000 },
  { date: "2024-04-11", desktop: 3270000, mobile: 3500000 },
  { date: "2024-04-12", desktop: 2920000, mobile: 2100000 },
  { date: "2024-04-13", desktop: 3420000, mobile: 3800000 },
  { date: "2024-04-14", desktop: 1370000, mobile: 2200000 },
  { date: "2024-04-15", desktop: 1200000, mobile: 1700000 },
  { date: "2024-04-16", desktop: 1380000, mobile: 1900000 },
  { date: "2024-04-17", desktop: 4460000, mobile: 3600000 },
  { date: "2024-04-18", desktop: 3640000, mobile: 4100000 },
  { date: "2024-04-19", desktop: 2430000, mobile: 1800000 },
  { date: "2024-04-20", desktop: 890000, mobile: 1500000 },
  { date: "2024-04-21", desktop: 1370000, mobile: 2000000 },
  { date: "2024-04-22", desktop: 2240000, mobile: 1700000 },
  { date: "2024-04-23", desktop: 1380000, mobile: 2300000 },
  { date: "2024-04-24", desktop: 3870000, mobile: 2900000 },
  { date: "2024-04-25", desktop: 2150000, mobile: 2500000 },
  { date: "2024-04-26", desktop: 750000, mobile: 1300000 },
  { date: "2024-04-27", desktop: 3830000, mobile: 4200000 },
  { date: "2024-04-28", desktop: 1220000, mobile: 1800000 },
  { date: "2024-04-29", desktop: 3150000, mobile: 2400000 },
  { date: "2024-04-30", desktop: 4540000, mobile: 3800000 },
  { date: "2024-05-01", desktop: 1650000, mobile: 2200000 },
  { date: "2024-05-02", desktop: 2930000, mobile: 3100000 },
  { date: "2024-05-03", desktop: 2470000, mobile: 1900000 },
  { date: "2024-05-04", desktop: 3850000, mobile: 4200000 },
  { date: "2024-05-05", desktop: 4810000, mobile: 3900000 },
  { date: "2024-05-06", desktop: 4980000, mobile: 5200000 },
  { date: "2024-05-07", desktop: 3880000, mobile: 3000000 },
  { date: "2024-05-08", desktop: 1490000, mobile: 2100000 },
  { date: "2024-05-09", desktop: 2270000, mobile: 1800000 },
  { date: "2024-05-10", desktop: 2930000, mobile: 3300000 },
  { date: "2024-05-11", desktop: 3350000, mobile: 2700000 },
  { date: "2024-05-12", desktop: 1970000, mobile: 2400000 },
  { date: "2024-05-13", desktop: 1970000, mobile: 1600000 },
  { date: "2024-05-14", desktop: 4480000, mobile: 4900000 },
  { date: "2024-05-15", desktop: 4730000, mobile: 3800000 },
  { date: "2024-05-16", desktop: 3380000, mobile: 4000000 },
  { date: "2024-05-17", desktop: 4990000, mobile: 4200000 },
  { date: "2024-05-18", desktop: 3150000, mobile: 3500000 },
  { date: "2024-05-19", desktop: 2350000, mobile: 1800000 },
  { date: "2024-05-20", desktop: 1770000, mobile: 2300000 },
  { date: "2024-05-21", desktop: 820000, mobile: 1400000 },
  { date: "2024-05-22", desktop: 810000, mobile: 1200000 },
  { date: "2024-05-23", desktop: 2520000, mobile: 2900000 },
  { date: "2024-05-24", desktop: 2940000, mobile: 2200000 },
  { date: "2024-05-25", desktop: 2010000, mobile: 2500000 },
  { date: "2024-05-26", desktop: 2130000, mobile: 1700000 },
  { date: "2024-05-27", desktop: 4200000, mobile: 4600000 },
  { date: "2024-05-28", desktop: 2330000, mobile: 1900000 },
  { date: "2024-05-29", desktop: 780000, mobile: 1300000 },
  { date: "2024-05-30", desktop: 3400000, mobile: 2800000 },
  { date: "2024-05-31", desktop: 1780000, mobile: 2300000 },
  { date: "2024-06-01", desktop: 1780000, mobile: 2000000 },
  { date: "2024-06-02", desktop: 4700000, mobile: 4100000 },
  { date: "2024-06-03", desktop: 1030000, mobile: 1600000 },
  { date: "2024-06-04", desktop: 4390000, mobile: 3800000 },
  { date: "2024-06-05", desktop: 880000, mobile: 1400000 },
  { date: "2024-06-06", desktop: 2940000, mobile: 2500000 },
  { date: "2024-06-07", desktop: 3230000, mobile: 3700000 },
  { date: "2024-06-08", desktop: 3850000, mobile: 3200000 },
  { date: "2024-06-09", desktop: 4380000, mobile: 4800000 },
  { date: "2024-06-10", desktop: 1550000, mobile: 2000000 },
  { date: "2024-06-11", desktop: 920000, mobile: 1500000 },
  { date: "2024-06-12", desktop: 4920000, mobile: 4200000 },
  { date: "2024-06-13", desktop: 810000, mobile: 1300000 },
  { date: "2024-06-14", desktop: 4260000, mobile: 3800000 },
  { date: "2024-06-15", desktop: 3070000, mobile: 3500000 },
  { date: "2024-06-16", desktop: 3710000, mobile: 3100000 },
  { date: "2024-06-17", desktop: 4750000, mobile: 5200000 },
  { date: "2024-06-18", desktop: 1070000, mobile: 1700000 },
  { date: "2024-06-19", desktop: 3410000, mobile: 2900000 },
  { date: "2024-06-20", desktop: 4080000, mobile: 4500000 },
  { date: "2024-06-21", desktop: 1690000, mobile: 2100000 },
  { date: "2024-06-22", desktop: 3170000, mobile: 2700000 },
  { date: "2024-06-23", desktop: 4800000, mobile: 5300000 },
  { date: "2024-06-24", desktop: 1320000, mobile: 1800000 },
  { date: "2024-06-25", desktop: 1410000, mobile: 1900000 },
  { date: "2024-06-26", desktop: 4340000, mobile: 3800000 },
  { date: "2024-06-27", desktop: 4480000, mobile: 4900000 },
  { date: "2024-06-28", desktop: 1490000, mobile: 2000000 },
  { date: "2024-06-29", desktop: 1030000, mobile: 1600000 },
  { date: "2024-06-30", desktop: 4460000, mobile: 4000000 },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "#22c55e",
  },
  mobile: {
    label: "Mobile",
    color: "#22c55e",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{"Chiffre d'affaires"}</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total jours
          </span>
          <span className="@[540px]/card:hidden">Total jours</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
