import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { saveContract, ContractDocument, getUserProfile } from "@/lib/db";
import { generateContractHash } from "@/lib/security/hash";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { party1, party2, party2Email, mode, content, expirationDate } = body;

    if (!content) {
      return NextResponse.json({ error: "Missing contract content" }, { status: 400 });
    }

    const timestamp = new Date().toISOString();
    const userEmailLower = session.email.trim().toLowerCase();
    const p2EmailLower = (party2Email || "").trim().toLowerCase();
    const isFunMode = mode === "fun";

    // For FUN Mode: Bypasses 2nd party verification & generates instant cryptographic hash seal
    const initialStatus = isFunMode ? "approved" : "pending_review";
    const initialParty2ApprovedAt = isFunMode ? timestamp : null;
    const initialHash = isFunMode ? generateContractHash(content, userEmailLower, timestamp) : "";

    const contractDoc: ContractDocument = {
      id: crypto.randomUUID(),
      userId: userEmailLower,
      party1: party1 || "Party 1",
      party1Email: userEmailLower, // Strictly map to logged-in user's authenticated email
      party2: party2 || "Party 2",
      party2Email: p2EmailLower,
      mode: mode || "pro",
      content,
      hash: initialHash,
      createdAt: timestamp,
      status: initialStatus,
      party1ApprovedAt: timestamp, // Creator approves upon creation
      party2ApprovedAt: initialParty2ApprovedAt,
      expirationDate: expirationDate || null,
      editsRemaining: 3,
    };

    await saveContract(contractDoc);

    let invitationSent = false;

    // PRO MODE Onboarding Invitation Funnel: If counterparty email is provided and not registered
    if (!isFunMode && p2EmailLower && p2EmailLower !== userEmailLower) {
      try {
        const p2Profile = await getUserProfile(p2EmailLower);
        const isRegistered = Boolean(p2Profile && p2Profile.name);

        if (!isRegistered) {
          const brevoApiKey = process.env.BREVO_API_KEY;
          const origin = request.headers.get("origin") || "https://saepace-pacto.netlify.app";

          if (brevoApiKey) {
            const emailHtml = `
              <div style="font-family: Arial, sans-serif; background: #050505; color: #ffffff; padding: 36px; border-radius: 20px; max-width: 520px; margin: 0 auto; border: 1px solid #222;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <div style="display: inline-block; background: linear-gradient(135deg, #7C3AED, #06B6D4); padding: 10px 24px; border-radius: 14px;">
                    <span style="font-family: monospace; color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: 4px;">PACTo</span>
                  </div>
                  <p style="color: #888888; font-size: 11px; margin-top: 6px; letter-spacing: 2px; font-weight: 700;">CRYPTOGRAPHIC MICRO-CONTRACT PROTOCOL</p>
                </div>

                <h2 style="color: #ffffff; font-size: 20px; font-weight: 700; text-align: center; margin-bottom: 16px;">
                  Contract Signature Requested! 📄
                </h2>

                <p style="font-size: 14px; color: #e5e7eb; line-height: 1.6; text-align: center;">
                  <strong style="color: #06B6D4;">${party1 || "Party 1"}</strong> (${userEmailLower}) has created a professional contract with you on <strong>PACTo</strong> and requested your signature.
                </p>

                <div style="background: #121215; border: 1px solid #7C3AED; padding: 20px; border-radius: 16px; margin: 24px 0; text-align: center;">
                  <p style="color: #a78bfa; font-size: 13px; font-weight: 600; margin: 0 0 6px 0;">Contract Participants:</p>
                  <p style="color: #ffffff; font-size: 16px; font-weight: 800; margin: 0 0 16px 0;">${party1 || "Party 1"} &amp; ${party2 || "Party 2"}</p>
                  
                  <a href="${origin}/auth" style="background: linear-gradient(135deg, #06B6D4, #22d3ee); color: #000000; font-weight: 800; text-decoration: none; padding: 12px 28px; border-radius: 12px; display: inline-block; font-size: 14px; box-shadow: 0 0 15px rgba(6,182,212,0.3);">
                    Create Account &amp; Review Pact
                  </a>
                </div>

                <p style="color: #9ca3af; font-size: 12px; line-height: 1.5; text-align: center;">
                  Creating a PACTo account takes only 30 seconds. Once logged in, your contract will automatically appear in your Dashboard under <strong>Pending Review</strong>.
                </p>

                <hr style="border: none; border-top: 1px solid #222; margin: 24px 0;" />
                <p style="color: #666666; font-size: 11px; text-align: center; margin: 0;">
                  PACTo by SAE PACE — Cryptographic Micro-Contract Protocol
                </p>
              </div>
            `;

            await fetch("https://api.brevo.com/v3/smtp/email", {
              method: "POST",
              headers: {
                "accept": "application/json",
                "api-key": brevoApiKey,
                "content-type": "application/json",
              },
              body: JSON.stringify({
                sender: { name: "PACTo Verification", email: process.env.BREVO_SENDER_EMAIL || "sae.pace.official@gmail.com" },
                to: [{ email: p2EmailLower }],
                subject: `${party1 || "First Party"} invited you to approve a contract on PACTo`,
                htmlContent: emailHtml,
              }),
            });

            invitationSent = true;
          }
        }
      } catch (invErr) {
        console.warn("[Onboarding Warning] Failed to send counterparty invitation email:", invErr);
      }
    }

    return NextResponse.json({
      success: true,
      contractId: contractDoc.id,
      hash: contractDoc.hash,
      invitationSent,
      message: isFunMode
        ? "Fun pact sealed & hashed instantly! You can now print/export PDF."
        : invitationSent
        ? `Pact saved to vault! Invitation email sent to ${p2EmailLower} to join PACTo and sign.`
        : "Pact saved to vault!",
    });
  } catch (error: any) {
    console.error("Failed to save contract:", error);
    return NextResponse.json({ error: "Failed to save contract to vault." }, { status: 500 });
  }
}
