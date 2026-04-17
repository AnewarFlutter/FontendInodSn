"use client"

import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts"
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { IconTrendingUp } from "@tabler/icons-react"

const chartData: { date: string; cetteAnnee: number; anneeDerniere: number }[] = []

const chartConfig = {
  cetteAnnee: {
    label: "Cette année",
    color: "hsl(142, 76%, 36%)",
  },
  anneeDerniere: {
    label: "Année dernière",
    color: "hsl(220, 14%, 46%)",
  },
} satisfies ChartConfig

export function SalesLineChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Tendance des ventes</CardTitle>
        <CardDescription>
          Comparaison avec l'année précédente
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey="cetteAnnee"
              type="monotone"
              stroke="var(--color-cetteAnnee)"
              strokeWidth={2}
              dot={{ fill: "var(--color-cetteAnnee)", r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              dataKey="anneeDerniere"
              type="monotone"
              stroke="var(--color-anneeDerniere)"
              strokeWidth={2}
              dot={{ fill: "var(--color-anneeDerniere)", r: 4 }}
              activeDot={{ r: 6 }}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Augmentation de 12.5% ce mois <IconTrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Affichage des ventes sur les 30 derniers jours
        </div>
      </CardFooter>
    </Card>
  )
}
