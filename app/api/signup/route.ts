import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { initAuth } from "@/lib/auth";
import { getCollections } from "@/lib/connect";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const { firstname, lastname, email, password } = await req.json();

    if (!firstname || !lastname || !email || !password) {
      return NextResponse.json(
        { error: "Please enter valid inputs" },
        { status: 400 },
      );
    }

    const { users } = await getCollections();

    const existing = await users.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "This user already exists" },
        { status: 400 },
      );
    }

    const hashed_password = await bcrypt.hash(password, 10);
    const userId = new ObjectId().toString();

    await users.insertOne({
      _id: userId,
      firstname,
      lastname,
      email,
      hashed_password,
    });

    const lucia = await initAuth();
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    // set cookie via NextResponse
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
