"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData: { jour: string; commandes: number; livrees: number }[] = []

const chartConfig = {
  commandes: {
    label: "Commandes",
    color: "#3b82f6",
  },
  livrees: {
    label: "Livrées",
    color: "#10b981",
  },
} satisfies ChartConfig

export function OrdersBarChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Commandes par jour</CardTitle>
        <CardDescription>
          Semaine en cours
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="jour"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="commandes" fill="var(--color-commandes)" radius={4} />
            <Bar dataKey="livrees" fill="var(--color-livrees)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
