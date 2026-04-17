"use client"

import { BreadcrumbDemo } from "../_components/Breadcrumb"

export default function GlobalStatisticsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center gap-4 mb-4">
        <BreadcrumbDemo />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <h1 className="text-5xl font-bold text-foreground">Tableau de bord Cabinet</h1>
      </div>
    </div>
  )
}
