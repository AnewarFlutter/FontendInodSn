"use client"

import * as React from "react"
import { Label, Pie, PieChart, Cell } from "recharts"
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

const chartData: { zone: string; tables: number; occupees: number }[] = []

const colors = [
  "hsl(221, 83%, 53%)",
  "hsl(142, 76%, 36%)",
  "hsl(24, 95%, 53%)",
  "hsl(280, 65%, 60%)",
]

const chartConfig = {
  occupees: {
    label: "Tables occupées",
  },
} satisfies ChartConfig

export function TablesOccupancyChart() {
  const totalTables = chartData.reduce((acc, curr) => acc + curr.tables, 0)
  const totalOccupees = chartData.reduce((acc, curr) => acc + curr.occupees, 0)
  const occupancyRate = Math.round((totalOccupees / totalTables) * 100)

  const pieData = chartData.map((item, index) => ({
    ...item,
    fill: colors[index],
  }))

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Occupation des tables</CardTitle>
        <CardDescription>Taux d'occupation par zone</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="zone" />}
            />
            <Pie
              data={pieData}
              dataKey="occupees"
              nameKey="zone"
              innerRadius={60}
              strokeWidth={5}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
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
                          {occupancyRate}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Occupées
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
          {pieData.map((item) => (
            <div key={item.zone} className="flex items-center gap-1">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-muted-foreground">{item.zone}</span>
              <span className="font-medium">
                {item.occupees}/{item.tables}
              </span>
            </div>
          ))}
        </div>
        <div className="leading-none text-muted-foreground text-center">
          {totalOccupees} tables occupées sur {totalTables}
        </div>
      </CardFooter>
    </Card>
  )
}
