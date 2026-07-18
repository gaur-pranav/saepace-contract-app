import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Mock Authentication for john@gmail.com
    if (email === "john@gmail.com" && password === "poiuytr") {
      const cookieStore = await cookies();
      
      // Set session cookie
      cookieStore.set('saepace-session', JSON.stringify({ email: "john@gmail.com" }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Invalid credentials. Please use john@gmail.com / poiuytr" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
