import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserProfile, saveUserProfile, UserProfile } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await getUserProfile(session.email);
    return NextResponse.json({ profile });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const existing = await getUserProfile(session.email);

    const updatedProfile: UserProfile = {
      userEmail: session.email,
      name: typeof body.name === "string" ? body.name : existing.name,
      contactNo: typeof body.contactNo === "string" ? body.contactNo : existing.contactNo,
      signingEmail: typeof body.signingEmail === "string" ? body.signingEmail : existing.signingEmail,
      bio: typeof body.bio === "string" ? body.bio : existing.bio,
      authorizedEmails: Array.isArray(body.authorizedEmails) ? body.authorizedEmails : existing.authorizedEmails,
      preferences: body.preferences ? { ...existing.preferences, ...body.preferences } : existing.preferences,
    };

    const saved = await saveUserProfile(updatedProfile);

    return NextResponse.json({
      success: true,
      message: "Profile and authorized emails updated successfully.",
      profile: saved,
    });
  } catch (error: any) {
    console.error("Failed to save profile:", error);
    return NextResponse.json({ error: "Failed to save profile changes." }, { status: 500 });
  }
}
