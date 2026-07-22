import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getContractsByUser, updateContract, ContractDocument } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.email.toLowerCase();
    const rawContracts = getContractsByUser(userEmail);

    const contracts: ContractDocument[] = rawContracts.map((c) => {
      let updatedStatus = c.status || 'pending_review';
      const now = new Date();

      // Check Expiration
      if (c.expirationDate && new Date(c.expirationDate) < now && updatedStatus !== 'approved') {
        updatedStatus = 'expired';
      } else if (c.party1ApprovedAt && c.party2ApprovedAt) {
        updatedStatus = 'approved';
      } else if (c.party2Email && c.party2Email.toLowerCase() === userEmail && !c.party2ApprovedAt) {
        updatedStatus = 'pending_review';
      } else if (c.party1Email && c.party1Email.toLowerCase() === userEmail && !c.party2ApprovedAt) {
        updatedStatus = 'pending_approval';
      }

      if (updatedStatus !== c.status) {
        updateContract(c.id, { status: updatedStatus });
        return { ...c, status: updatedStatus };
      }

      return { ...c, status: updatedStatus };
    });

    return NextResponse.json({ contracts, userEmail });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch contracts." }, { status: 500 });
  }
}
