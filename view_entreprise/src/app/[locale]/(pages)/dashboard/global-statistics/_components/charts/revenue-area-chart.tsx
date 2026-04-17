"use client"

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

const chartData: { month: string; revenus: number; depenses: number }[] = []

const chartConfig = {
  revenus: {
    label: "Revenus",
    color: "#22c55e",
  },
  depenses: {
    label: "Dépenses",
    color: "#FF4545",
  },
} satisfies ChartConfig

export function RevenueAreaChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenus vs Dépenses</CardTitle>
        <CardDescription>
          Évolution sur les 6 derniers mois
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="depenses"
              type="natural"
              fill="var(--color-depenses)"
              fillOpacity={0.3}
              stroke="var(--color-depenses)"
              strokeWidth={2}
            />
            <Area
              dataKey="revenus"
              type="natural"
              fill="var(--color-revenus)"
              fillOpacity={0.3}
              stroke="var(--color-revenus)"
              strokeWidth={2}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
