import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { saveContract, ContractDocument } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { party1, party1Email, party2, party2Email, mode, content, expirationDate } = body;

    if (!content) {
      return NextResponse.json({ error: "Missing contract content" }, { status: 400 });
    }

    const timestamp = new Date().toISOString();
    const p1Email = (party1Email || session.email).trim();
    const p2Email = (party2Email || "").trim();

    const contractDoc: ContractDocument = {
      id: crypto.randomUUID(),
      userId: session.email,
      party1: party1 || "Party 1",
      party1Email: p1Email,
      party2: party2 || "Party 2",
      party2Email: p2Email,
      mode: mode || "pro",
      content,
      hash: "", // Final seal generated upon dual OTP verification
      createdAt: timestamp,
      status: "pending_review",
      party1ApprovedAt: timestamp, // Creator approves upon creation
      party2ApprovedAt: null,
      expirationDate: expirationDate || null,
      editsRemaining: 3,
    };

    saveContract(contractDoc);

    return NextResponse.json({ success: true, contractId: contractDoc.id });
  } catch (error: any) {
    console.error("Failed to save contract:", error);
    return NextResponse.json({ error: "Failed to save contract to vault." }, { status: 500 });
  }
}
