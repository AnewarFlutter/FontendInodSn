"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData: { statut: string; count: number; fill: string }[] = []

const chartConfig = {
  count: {
    label: "Commandes",
  },
  livrees: {
    label: "Livrées",
    color: "hsl(142, 76%, 36%)",
  },
  enCours: {
    label: "En cours",
    color: "hsl(221, 83%, 53%)",
  },
  enAttente: {
    label: "En attente",
    color: "hsl(45, 93%, 47%)",
  },
  annulees: {
    label: "Annulées",
    color: "hsl(0, 84%, 60%)",
  },
} satisfies ChartConfig

export function OrdersStatusPieChart() {
  const totalOrders = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0)
  }, [])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Statut des commandes</CardTitle>
        <CardDescription>Ce mois-ci</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="statut"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalOrders}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Commandes
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {chartData.map((item) => (
            <div key={item.statut} className="flex items-center gap-1">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-muted-foreground">
                {chartConfig[item.statut as keyof typeof chartConfig]?.label}
              </span>
              <span className="font-medium">
                {item.count} ({Math.round((item.count / totalOrders) * 100)}%)
              </span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}
