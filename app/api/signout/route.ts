import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { initAuth } from "@/lib/auth";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session")?.value;

    if (!sessionId) {
      // No session to sign out
      return new NextResponse(null, { status: 204 });
    }

    const lucia = await initAuth();
    await lucia.invalidateSession(sessionId);

    const expiredCookie = lucia.createBlankSessionCookie();

    const res = new NextResponse(null, { status: 204 });
    res.headers.set("Set-Cookie", expiredCookie.serialize());
    return res;
  } catch (err) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
