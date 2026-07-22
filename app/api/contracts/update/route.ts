import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getContractById, updateContract } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { contractId, content, party1, party2 } = await request.json();

    if (!contractId || !content) {
      return NextResponse.json({ error: "Contract ID and content are required." }, { status: 400 });
    }

    const contract = getContractById(contractId);
    if (!contract) {
      return NextResponse.json({ error: "Contract not found." }, { status: 404 });
    }

    if (contract.status === "approved") {
      return NextResponse.json(
        { error: "This pact is cryptographically sealed and can no longer be edited." },
        { status: 403 }
      );
    }

    const currentEdits = typeof contract.editsRemaining === "number" ? contract.editsRemaining : 3;
    if (currentEdits <= 0) {
      return NextResponse.json(
        { error: "Free Plan Limit Reached: You have used all 3 allowed edits/recreations for this contract." },
        { status: 403 }
      );
    }

    const updated = updateContract(contractId, {
      content,
      party1: party1 || contract.party1,
      party2: party2 || contract.party2,
      editsRemaining: currentEdits - 1,
      hash: "", // Reset hash if draft updated before final dual approval
    });

    return NextResponse.json({
      success: true,
      contract: updated,
      editsRemaining: currentEdits - 1,
      message: `Document updated successfully. ${currentEdits - 1} edits remaining on Free Plan.`,
    });
  } catch (error: any) {
    console.error("Failed to update contract:", error);
    return NextResponse.json({ error: "Failed to update contract." }, { status: 500 });
  }
}
