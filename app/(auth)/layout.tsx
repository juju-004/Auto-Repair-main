import type React from "react";
import { redirect } from "next/navigation";
import { initAuth } from "@/lib/auth";
import { cookies } from "next/headers";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lucia = await initAuth();
  const cookie = (await cookies()).get("session")?.value ?? "";
  const { user } = await lucia.validateSession(cookie ?? "");

  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-muted">
      {children}
    </div>
  );
}
