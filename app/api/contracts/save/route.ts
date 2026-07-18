import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { generateContractHash } from "@/lib/security/hash";
import { saveContract, ContractDocument } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { party1, party2, mode, content } = body;

    if (!content) {
      return NextResponse.json({ error: "Missing contract content" }, { status: 400 });
    }

    const timestamp = new Date().toISOString();
    
    // Generate Cryptographic Hash (Immutable Fingerprint)
    const hash = generateContractHash(content, session.email, timestamp);

    const contractDoc: ContractDocument = {
      id: crypto.randomUUID(),
      userId: session.email, // using email as userId for mock
      party1,
      party2,
      mode,
      content,
      hash,
      createdAt: timestamp
    };

    saveContract(contractDoc);

    return NextResponse.json({ success: true, contractId: contractDoc.id, hash });
  } catch (error: any) {
    console.error("Failed to save contract:", error);
    return NextResponse.json({ error: "Failed to save contract to studio." }, { status: 500 });
  }
}
