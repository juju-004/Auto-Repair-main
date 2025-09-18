import type React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import DashboardNav from "@/components/dashboard-nav";
import { initAuth } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SessionProvider } from "@/contexts/SessionContext";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lucia = await initAuth();
  const cookie = (await cookies()).get("session")?.value ?? "";
  const { user } = await lucia.validateSession(cookie ?? "");

  if (!user) redirect("/login");

  return (
    <SessionProvider initialUser={user}>
      <SidebarProvider>
        <AppSidebar />

        <main className="relative flex gap-5 w-full items-center flex-col">
          <div className="px-2 sticky flex  w-full justify-between items-center  top-0 z-50 bg-background border-b border-b-foreground/10 h-16">
            <SidebarTrigger />
            <DashboardNav />
          </div>
          <div className="px-8 py-2 flex gap-5 w-full items-center  ">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </SessionProvider>
  );
}
