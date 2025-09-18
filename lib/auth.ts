import { Lucia } from "lucia";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import { getCollections } from "./connect";

export const initAuth = async () => {
  const { users, sessions } = await getCollections();

  const adapter = new MongodbAdapter(sessions, users);
  const lucia = new Lucia(adapter, {
    sessionCookie: {
      name: "session",
      expires: false,
      attributes: {
        secure: process.env.NODE_ENV === "production",
      },
    },
    getUserAttributes: (user) => {
      return {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      };
    },
  });

  return lucia;
};

// Add Lucia type declaration
declare module "lucia" {
  interface Register {
    Lucia: Awaited<ReturnType<typeof initAuth>>;
    DatabaseUserAttributes: {
      firstname: string;
      lastname: string;
      email: string;
    };
  }
}
