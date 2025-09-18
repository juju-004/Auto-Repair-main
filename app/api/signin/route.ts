import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { initAuth } from "@/lib/auth";
import { getCollections } from "@/lib/connect";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Please enter valid inputs" },
        { status: 400 },
      );
    }

    const { users } = await getCollections();

    const user = await users.findOne({ email });

    if (
      !user ||
      !(await bcrypt.compare(password, user.hashed_password as string))
    ) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 },
      );
    }

    const lucia = await initAuth();
    const session = await lucia.createSession(user._id.toString(), {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    // set cookie using NextResponse
    const res = NextResponse.json({ success: true });
    res.headers.set("Set-Cookie", sessionCookie.serialize());
    return res;
  } catch (err) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
