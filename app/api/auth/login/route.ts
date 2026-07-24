import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase, getUserProfile, saveUserProfile } from "@/lib/db";

function extractErrorMessage(err: any): string {
  if (!err) return "Authentication error occurred.";
  if (typeof err === "string" && err.trim() && err !== "{}") return err;
  if (typeof err.message === "string" && err.message.trim()) return err.message;
  if (typeof err.error_description === "string" && err.error_description.trim()) return err.error_description;
  if (typeof err.msg === "string" && err.msg.trim()) return err.msg;
  try {
    const str = JSON.stringify(err);
    if (str && str !== "{}" && str !== "[]") return str;
  } catch (e) {}
  return "Error sending verification email. Please check SMTP configuration in Supabase Dashboard.";
}

export async function POST(request: Request) {
  try {
    const { email, password, name, isRegister } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Password validation rules: 8+ chars, uppercase, lowercase, special character
    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { error: "Password must contain at least one uppercase letter (A-Z)." },
        { status: 400 }
      );
    }

    if (!/[a-z]/.test(password)) {
      return NextResponse.json(
        { error: "Password must contain at least one lowercase letter (a-z)." },
        { status: 400 }
      );
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      return NextResponse.json(
        { error: "Password must contain at least one special character or symbol (!@#$%^&*)." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // ─── SUPABASE AUTH INTEGRATION ───
    if (supabase) {
      if (isRegister || (name && name.trim())) {
        const origin = request.headers.get("origin") || "https://saepace-pacto.netlify.app";
        const redirectUrl = `${origin}/auth`;

        // Sign Up with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: cleanEmail,
          password: password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              name: name?.trim() || "",
              full_name: name?.trim() || "",
            },
          },
        });

        if (authError) {
          const errMsg = extractErrorMessage(authError);
          // If already registered, proceed to check sign in
          if (!errMsg.toLowerCase().includes("already registered")) {
            return NextResponse.json({ error: errMsg }, { status: 400 });
          }
        } else if (authData.user && !authData.session) {
          // Supabase Email Verification is enabled and pending confirmation
          if (name && name.trim()) {
            const existingProfile = await getUserProfile(cleanEmail);
            await saveUserProfile({
              ...existingProfile,
              name: name.trim(),
              userEmail: cleanEmail,
              signingEmail: existingProfile.signingEmail || cleanEmail,
            });
          }

          return NextResponse.json({
            success: true,
            requiresEmailVerification: true,
            message: "Account created! Please check your email inbox to verify your account with Supabase before signing in.",
          });
        }
      } else {
        // Sign In with Supabase Auth
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });

        if (signInError) {
          const errMsg = extractErrorMessage(signInError);
          return NextResponse.json({ error: errMsg }, { status: 400 });
        }
      }
    }

    // ─── SET SESSION COOKIE ───
    const cookieStore = await cookies();
    cookieStore.set('saepace-session', JSON.stringify({ email: cleanEmail }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    // Save/update profile name if provided during registration
    if (name && typeof name === "string" && name.trim()) {
      const existingProfile = await getUserProfile(cleanEmail);
      await saveUserProfile({
        ...existingProfile,
        name: name.trim(),
        userEmail: cleanEmail,
        signingEmail: existingProfile.signingEmail || cleanEmail,
      });
    }

    return NextResponse.json({ success: true, email: cleanEmail });
  } catch (error: any) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: extractErrorMessage(error) },
      { status: 500 }
    );
  }
}
