import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!password || password.length < 3) {
      return NextResponse.json(
        { error: "Password must be at least 3 characters long." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cookieStore = await cookies();

    // Set session cookie dynamically for user email
    cookieStore.set('saepace-session', JSON.stringify({ email: cleanEmail }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return NextResponse.json({ success: true, email: cleanEmail });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
