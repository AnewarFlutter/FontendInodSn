"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  IconCurrencyDollar,
  IconShoppingCart,
  IconUsers,
  IconTrendingUp,
  IconTrendingDown,
} from "@tabler/icons-react"

interface StatCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
}

function StatCard({ title, value, description, icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {trend && (
            <span
              className={`flex items-center gap-0.5 ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend.isPositive ? (
                <IconTrendingUp className="h-3 w-3" />
              ) : (
                <IconTrendingDown className="h-3 w-3" />
              )}
              {trend.value}%
            </span>
          )}
          <span>{description}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function SummaryCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Chiffre d'affaires"
        value="2.540.000 FCFA"
        description="vs mois dernier"
        icon={<IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />}
        trend={{ value: 12.5, isPositive: true }}
      />
      <StatCard
        title="Commandes"
        value="307"
        description="vs mois dernier"
        icon={<IconShoppingCart className="h-4 w-4 text-muted-foreground" />}
        trend={{ value: 8.2, isPositive: true }}
      />
      <StatCard
        title="Clients actifs"
        value="1.245"
        description="vs mois dernier"
        icon={<IconUsers className="h-4 w-4 text-muted-foreground" />}
        trend={{ value: 3.1, isPositive: true }}
      />
      <StatCard
        title="Ticket moyen"
        value="8.270 FCFA"
        description="vs mois dernier"
        icon={<IconTrendingUp className="h-4 w-4 text-muted-foreground" />}
        trend={{ value: 2.4, isPositive: false }}
      />
    </div>
  )
}
