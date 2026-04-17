"use client"

import * as React from "react"
import { PolarAngleAxis, PolarGrid, RadialBar, RadialBarChart } from "recharts"
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
import { IconTrendingUp } from "@tabler/icons-react"

const chartData: { role: string; count: number; fill: string }[] = []

const chartConfig = {
  count: {
    label: "Utilisateurs",
  },
  serveurs: {
    label: "Serveurs",
    color: "hsl(142, 76%, 36%)",
  },
  cuisiniers: {
    label: "Cuisiniers",
    color: "hsl(221, 83%, 53%)",
  },
  gerants: {
    label: "Gérants",
    color: "hsl(24, 95%, 53%)",
  },
  admins: {
    label: "Admins",
    color: "hsl(45, 93%, 47%)",
  },
  caissiers: {
    label: "Caissiers",
    color: "hsl(280, 65%, 60%)",
  },
} satisfies ChartConfig

export function UsersRolePieChart() {
  const totalUsers = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0)
  }, [])

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle>Répartition par rôle</CardTitle>
        <CardDescription>Répartition globale</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            innerRadius={30}
            outerRadius={110}
          >
            <PolarGrid gridType="circle" />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="role" />}
            />
            <RadialBar
              dataKey="count"
              background
              cornerRadius={10}
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-3 text-sm">
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 w-full">
          {chartData.map((item) => {
            const config = chartConfig[item.role as keyof typeof chartConfig]
            const percentage = Math.round((item.count / totalUsers) * 100)
            return (
              <div key={item.role} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: (config as { color?: string })?.color }}
                  />
                  <span className="text-muted-foreground">{config?.label}</span>
                </div>
                <span className="font-medium">
                  {item.count} <span className="text-muted-foreground">({percentage}%)</span>
                </span>
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          Distribution des utilisateurs
          <IconTrendingUp className="h-4 w-4" />
        </div>
        <div className="text-xs text-muted-foreground">
          Toutes périodes confondues
        </div>
      </CardFooter>
    </Card>
  )
}
