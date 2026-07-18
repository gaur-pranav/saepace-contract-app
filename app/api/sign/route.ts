import { NextResponse } from "next/server";
import { generateContractHash } from "@/lib/security/hash";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const { contractText, creatorEmail, clientEmail, timestamp } = body;

    // Validate inputs
    if (typeof contractText !== "string" || !contractText.trim()) {
      return NextResponse.json(
        { error: "Missing or invalid 'contractText' field." },
        { status: 400 }
      );
    }

    if (typeof creatorEmail !== "string" || !creatorEmail.trim()) {
      return NextResponse.json(
        { error: "Missing or invalid 'creatorEmail' field." },
        { status: 400 }
      );
    }

    if (typeof clientEmail !== "string" || !clientEmail.trim()) {
      return NextResponse.json(
        { error: "Missing or invalid 'clientEmail' field." },
        { status: 400 }
      );
    }

    if (typeof timestamp !== "string" || !timestamp.trim()) {
      return NextResponse.json(
        { error: "Missing or invalid 'timestamp' field." },
        { status: 400 }
      );
    }

    // Execute hash generation using HMAC-SHA256
    const generatedHashString = generateContractHash(contractText, clientEmail, timestamp);

    // Note: Supabase insertion and Resend email integrations will be added to this endpoint in Phase 4.
    // For Phase 2, we strictly compute and return the signature hash.
    return NextResponse.json({
      success: true,
      hash: generatedHashString,
    });

  } catch (error: any) {
    console.error("Contract Signing API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
