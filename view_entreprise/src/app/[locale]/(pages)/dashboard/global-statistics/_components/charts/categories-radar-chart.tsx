"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
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

const chartData: { categorie: string; ventes: number }[] = []

const chartConfig = {
  ventes: {
    label: "Ventes",
    color: "#a855f7",
  },
} satisfies ChartConfig

export function CategoriesRadarChart() {
  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Performance par catégorie</CardTitle>
        <CardDescription>
          Nombre de commandes par catégorie de plat
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="categorie" />
            <PolarGrid />
            <Radar
              dataKey="ventes"
              fill="var(--color-ventes)"
              fillOpacity={0.6}
              stroke="var(--color-ventes)"
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          Meilleure catégorie: <span className="font-medium text-foreground">Plats</span>
        </div>
      </CardFooter>
    </Card>
  )
}
