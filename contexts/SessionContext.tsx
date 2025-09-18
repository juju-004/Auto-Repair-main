"use client";

import { createContext, useContext } from "react";

type SessionUser = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
} | null;

const SessionContext = createContext<SessionUser>(null);

export const useSession = () => useContext(SessionContext);

export function SessionProvider({
  initialUser,
  children,
}: {
  initialUser: SessionUser;
  children: React.ReactNode;
}) {
  return (
    <SessionContext.Provider value={initialUser}>
      {children}
    </SessionContext.Provider>
  );
}
