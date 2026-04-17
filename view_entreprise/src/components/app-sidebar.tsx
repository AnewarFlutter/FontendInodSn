"use client";

import * as React from "react";
import {
  AudioWaveform,
  Command,
  FolderOpen,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal,
  Users,
  ShoppingBag,
  SearchIcon,
  Archive,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { APP_ROUTES } from "@/shared/constants/routes";

const data = {
  teams: [
    { name: "Administration", logo: GalleryVerticalEnd, plan: "Restaurant" },
    { name: "Acme Corp.", logo: AudioWaveform, plan: "Startup" },
    { name: "Evil Corp.", logo: Command, plan: "Free" },
  ],

  navGroups: [
    {
      label: "Principal",
      items: [
        {
          title: "Dashboard",
          url: APP_ROUTES.dashboard.globalStatistics,
          icon: SquareTerminal,
        },
      ],
    },
    {
      label: "Espace Notarial",
      items: [
        {
          title: "Dossiers Notariaux",
          url: APP_ROUTES.dossiers.root,
          icon: FolderOpen,
        },
        {
          title: "Recherche Globale",
          url: APP_ROUTES.recherche.root,
          icon: SearchIcon,
        },
        {
          title: "Archives",
          url: APP_ROUTES.archives.root,
          icon: Archive,
        },
      ],
    },
    {
      label: "Administration",
      items: [
        {
          title: "Utilisateurs",
          url: APP_ROUTES.userManagement.root,
          icon: Users,
        },
        {
          title: "Modules",
          url: APP_ROUTES.modules.root,
          icon: ShoppingBag,
          isActive: false,
          items: [
            { title: "Shop des modules", url: APP_ROUTES.modules.shop },
            { title: "Historique des paiements", url: APP_ROUTES.modules.historique },
          ],
        },
        {
          title: "Paramètres",
          url: APP_ROUTES.settings.root,
          icon: Settings2,
        },
      ],
    },
  ],
};

const MOCK_USER = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: null,
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain groups={data.navGroups} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={MOCK_USER} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
