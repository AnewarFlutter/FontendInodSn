"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
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

type Period = "30" | "90" | "180" | "365"

function generateData(days: number) {
  const data = []
  const now = new Date()
  let total = 4

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const newUsers = Math.floor(Math.random() * 3)
    total += newUsers
    const label = date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
    data.push({ date: label, total, nouveaux: newUsers })
  }

  return data
}

const chartConfig = {
  total: {
    label: "Utilisateurs totaux",
    color: "#60a5fa",
  },
  nouveaux: {
    label: "Nouvelles inscriptions",
    color: "#d946ef",
  },
} satisfies ChartConfig

const periodLabels: Record<Period, string> = {
  "30": "30 jours",
  "90": "90 jours",
  "180": "6 mois",
  "365": "1 an",
}

export function UserGrowthChart() {
  const [period, setPeriod] = React.useState<Period>("90")

  const data = React.useMemo(() => generateData(Number(period)), [period])

  // N'afficher qu'un tick sur N points pour éviter le chevauchement
  const tickStep = Number(period) <= 30 ? 5 : Number(period) <= 90 ? 10 : 30
  const ticks = data.filter((_, i) => i % tickStep === 0).map((d) => d.date)

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-base font-semibold">
            Croissance des utilisateurs
          </CardTitle>
          <CardDescription>
            Évolution du nombre total d&apos;inscrits – {periodLabels[period]}
          </CardDescription>
        </div>
        <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
          <SelectTrigger className="w-[110px] h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">30 jours</SelectItem>
            <SelectItem value="90">90 jours</SelectItem>
            <SelectItem value="180">6 mois</SelectItem>
            <SelectItem value="365">1 an</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2">
        <ChartContainer config={chartConfig} className="h-[220px] w-full">
          <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillNouveaux" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d946ef" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#d946ef" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              ticks={ticks}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
            />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={28} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#60a5fa"
              strokeWidth={2}
              fill="url(#fillTotal)"
            />
            <Area
              type="monotone"
              dataKey="nouveaux"
              stroke="#d946ef"
              strokeWidth={2}
              fill="url(#fillNouveaux)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
