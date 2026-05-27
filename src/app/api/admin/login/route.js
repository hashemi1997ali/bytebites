import { NextResponse } from "next/server";
import { signToken } from "@/lib/adminAuth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body || {};
    const adminUser = process.env.ADMIN_USER;
    const adminPass = process.env.ADMIN_PASS;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 },
      );
    }

    if (username !== adminUser || password !== adminPass) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = signToken({ user: username });
    return NextResponse.json({ token });
  } catch (e) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
