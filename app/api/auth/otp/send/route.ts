import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getContractById, updateContract } from "@/lib/db";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { contractId } = await request.json();
    if (!contractId) {
      return NextResponse.json({ error: "Contract ID is required." }, { status: 400 });
    }

    const contract = getContractById(contractId);
    if (!contract) {
      return NextResponse.json({ error: "Contract not found." }, { status: 404 });
    }

    // Generate 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 mins

    updateContract(contractId, { otpCode, otpExpiresAt });

    // Attempt email dispatch via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: "PACTO Verification <noreply@pacto.dev>",
          to: session.email,
          subject: `PACTO Deal Signature OTP: ${otpCode}`,
          html: `
            <div style="font-family: sans-serif; background: #050505; color: #fff; padding: 24px; borderRadius: 16px;">
              <h2 style="color: #06B6D4;">PACTO Signature Verification</h2>
              <p>You requested to sign and seal contract <strong>${contract.party1} & ${contract.party2}</strong>.</p>
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; background: #141415; padding: 16px; border-radius: 12px; text-align: center; color: #7C3AED; margin: 24px 0;">
                ${otpCode}
              </div>
              <p style="color: #888; font-size: 12px;">This 6-digit code will expire in 10 minutes. If you did not request this code, please ignore this email.</p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.warn("Resend email delivery failed, using dev fallback log:", emailErr);
      }
    }

    // Console fallback for local testing & development
    console.log(`\n========================================`);
    console.log(`[PACTO OTP DEV LOG] Signature OTP for ${session.email}: [ ${otpCode} ]`);
    console.log(`========================================\n`);

    return NextResponse.json({
      success: true,
      message: `Signature OTP generated and sent to ${session.email}`,
      devOtp: process.env.NODE_ENV !== "production" ? otpCode : undefined
    });
  } catch (error: any) {
    console.error("Failed to send OTP:", error);
    return NextResponse.json({ error: "Failed to generate signature OTP." }, { status: 500 });
  }
}
