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

const pageNames: Record<string, string> = {
  "profile": "Profil",
  "security": "Sécurité",
  "notifications": "Notifications",
  "account": "Compte",
};

export function BreadcrumbDemo() {
  const pathname = usePathname();

  // Extract the page name from the pathname
  const pathParts = pathname.split("/").filter(Boolean);
  const currentPage = pathParts[pathParts.length - 1] || "settings";
  const pageName = pageNames[currentPage] || currentPage;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="#">Paramètres</Link>
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
