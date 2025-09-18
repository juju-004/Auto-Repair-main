"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Car,
  ClipboardList,
  Home,
  Settings,
  Users,
  BarChart4,
  Sparkles,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSession } from "@/contexts/SessionContext";
import { useTransition } from "react";
import axios from "axios";
import { toast } from "sonner";
import { filterError } from "@/lib/helpers";

const routes = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Customers",
    icon: Users,
    href: "/dashboard/customers",
    color: "text-violet-500",
  },
  {
    label: "Vehicles",
    icon: Car,
    href: "/dashboard/vehicles",
    color: "text-pink-700",
  },
  {
    label: "Analytics",
    icon: BarChart4,
    href: "/dashboard/analytics",
    color: "text-purple-500",
  },
  {
    label: "Reports",
    icon: ClipboardList,
    href: "/dashboard/reports",
    color: "text-red-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    color: "text-gray-500",
  },
];

export function AppSidebar() {
  const user = useSession();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const signOut = () => {
    startTransition(async () => {
      try {
        await axios.post("/api/signout");
        toast.success("Signout successful");
        router.replace("/login");
      } catch (error) {
        toast.error(filterError(error));
      }
      return;
    });
  };

  return (
    <Sidebar className="!bg-black">
      <SidebarHeader className="pb-0  mt-3">
        <Link href="/" className="flex items-center px-3 py-2">
          <Sparkles className="h-6 w-6 text-primary mr-2 " />
          <h1 className="text-xl font-bold">
            Auto<span className="text-primary">Diagnostics</span>
          </h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map((route) => (
                <SidebarMenuItem key={route.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === route.href}
                    tooltip={route.label}
                  >
                    <Link href={route.href}>
                      <route.icon className={cn("h-5 w-5", route.color)} />
                      <span>{route.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <div className="mt-4 mb-4 border-t pt-4 mx-2">
            <div className="flex items-center justify-between mb-2 px-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>
                    {getInitials(`${user.firstname} ${user.lastname}`)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                  <p className="text-sm font-medium">
                    {user.firstname} {user.lastname}
                  </p>
                  <p className="text-xs font-medium opacity-30">{user.email}</p>
                </div>
              </div>
            </div>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Logout" onClick={signOut}>
                  <LogOut className="h-5 w-5 text-gray-500" />
                  <span>{isPending ? "Logging out..." : "Logout"}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
