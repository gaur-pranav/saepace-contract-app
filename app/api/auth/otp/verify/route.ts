import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getContractById, updateContract } from "@/lib/db";
import { generateTripleTimestampHash } from "@/lib/security/hash";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { contractId, otpCode } = await request.json();
    if (!contractId || !otpCode) {
      return NextResponse.json({ error: "Contract ID and OTP code are required." }, { status: 400 });
    }

    const contract = await getContractById(contractId);
    if (!contract) {
      return NextResponse.json({ error: "Contract not found." }, { status: 404 });
    }

    if (!contract.otpCode || contract.otpCode !== otpCode.trim()) {
      return NextResponse.json({ error: "Invalid 6-digit OTP code." }, { status: 400 });
    }

    if (!contract.otpExpiresAt || new Date() > new Date(contract.otpExpiresAt)) {
      return NextResponse.json({ error: "OTP code has expired. Please request a new one." }, { status: 400 });
    }

    const now = new Date().toISOString();
    const userEmail = session.email.toLowerCase();
    const p1Email = (contract.party1Email || contract.userId || "").toLowerCase();
    const p2Email = (contract.party2Email || "").toLowerCase();

    let party1ApprovedAt = contract.party1ApprovedAt || null;
    let party2ApprovedAt = contract.party2ApprovedAt || null;

    if (userEmail === p2Email || (!p2Email && userEmail !== p1Email)) {
      party2ApprovedAt = now;
    } else if (userEmail === p1Email) {
      party1ApprovedAt = now;
    } else {
      // Default to approving for whichever party position fits
      party2ApprovedAt = now;
    }

    let finalStatus = contract.status || 'pending_review';
    let finalHash = contract.hash || '';

    // Check if both parties have approved -> Execute Triple-Timestamp Cryptographic Seal
    if (party1ApprovedAt && party2ApprovedAt) {
      finalStatus = 'approved';
      finalHash = generateTripleTimestampHash(
        contract.content,
        contract.party1Email || contract.party1,
        contract.party2Email || contract.party2,
        contract.createdAt,
        party1ApprovedAt,
        party2ApprovedAt
      );
    }

    const updatedContract = await updateContract(contractId, {
      party1ApprovedAt,
      party2ApprovedAt,
      status: finalStatus,
      hash: finalHash,
      otpCode: null,
      otpExpiresAt: null,
    });

    return NextResponse.json({
      success: true,
      message: finalStatus === 'approved' ? 'Pact mathematically sealed by both parties!' : 'Signature approved.',
      contract: updatedContract,
    });
  } catch (error: any) {
    console.error("Failed to verify OTP:", error);
    return NextResponse.json({ error: "Failed to verify signature OTP." }, { status: 500 });
  }
}
