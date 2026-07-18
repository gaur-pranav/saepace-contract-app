import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getContractsByUser } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contracts = getContractsByUser(session.email);

    return NextResponse.json({ contracts });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch contracts." }, { status: 500 });
  }
}
