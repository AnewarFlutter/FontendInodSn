"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { APP_ROUTES } from "@/shared/constants/routes";

const pageNames: Record<string, string> = {
 "global-statistics": "Statistiques Globales",
 "kitchen-statistics": "Statistiques de la Cuisine",
 "orders-statistics": "Statistiques des Commandes",
};

export function BreadcrumbDemo() {
  const pathname = usePathname();

  // Extract the page name from the pathname
  const pathParts = pathname.split("/").filter(Boolean);
  const currentPage = pathParts[pathParts.length - 1] || "dashboard";
  const pageName = pageNames[currentPage] || currentPage;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={APP_ROUTES.dashboard.main}>Tableau de bord</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{pageName}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
