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

    const contract = await getContractById(contractId);
    if (!contract) {
      return NextResponse.json({ error: "Contract not found." }, { status: 404 });
    }

    // Generate 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 mins

    await updateContract(contractId, { otpCode, otpExpiresAt });

    let emailDelivered = false;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; background: #050505; color: #ffffff; padding: 32px; border-radius: 20px; max-width: 500px; margin: 0 auto; border: 1px solid #222;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #06B6D4; font-size: 24px; font-weight: 800; letter-spacing: 2px; margin: 0;">PACTO</h1>
          <p style="color: #888888; font-size: 12px; margin-top: 4px;">CRYPTOGRAPHIC MICRO-CONTRACT PROTOCOL</p>
        </div>
        
        <p style="font-size: 15px; color: #e5e7eb; line-height: 1.6;">
          Use the OTP code below to approve and cryptographically seal your agreement for contract: <br/>
          <strong style="color: #06B6D4;">${contract.party1} &amp; ${contract.party2}</strong>
        </p>

        <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; background: #121215; border: 1px solid #7C3AED; padding: 20px; border-radius: 16px; text-align: center; color: #a78bfa; margin: 28px 0; box-shadow: 0 0 20px rgba(124, 58, 237, 0.2);">
          ${otpCode}
        </div>

        <p style="color: #06B6D4; font-size: 13px; font-weight: 600; text-align: center;">
          👉 Use this OTP to approve your agreement in the PACTO Vault.
        </p>

        <hr style="border: none; border-top: 1px solid #222; margin: 24px 0;" />
        <p style="color: #666666; font-size: 11px; text-align: center; margin: 0;">
          This 6-digit code will expire in 10 minutes. If you did not request this signature verification, please ignore this email.
        </p>
      </div>
    `;

    // Attempt email dispatch via Brevo API
    const brevoApiKey = process.env.BREVO_API_KEY;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (brevoApiKey) {
      try {
        const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "accept": "application/json",
            "api-key": brevoApiKey,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            sender: {
              name: "PACTO Verification",
              email: process.env.BREVO_SENDER_EMAIL || "sae.pace.official@gmail.com",
            },
            to: [{ email: session.email }],
            subject: `PACTO Deal Signature OTP: ${otpCode}`,
            htmlContent: emailHtml,
          }),
        });

        if (brevoRes.ok) {
          emailDelivered = true;
        } else {
          const errData = await brevoRes.json();
          console.warn("[Brevo Warning] Direct delivery failed:", errData);
        }
      } catch (brevoErr: any) {
        console.warn("[Brevo Warning] Request failed:", brevoErr?.message || brevoErr);
      }
    }

    // Fallback to Resend if Brevo is not configured
    if (!emailDelivered && resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: "PACTO Verification <onboarding@resend.dev>",
          to: session.email,
          subject: `PACTO Deal Signature OTP: ${otpCode}`,
          html: emailHtml,
        });
        emailDelivered = true;
      } catch (emailErr: any) {
        console.warn("[Resend Warning] Direct delivery failed:", emailErr?.message || emailErr);
      }
    }

    console.log(`\n========================================`);
    console.log(`[PACTO OTP LOG] Signature OTP for ${session.email}: [ ${otpCode} ]`);
    console.log(`========================================\n`);

    return NextResponse.json({
      success: true,
      message: emailDelivered 
        ? `Signature OTP sent to ${session.email}`
        : `Signature OTP generated for ${session.email}`,
    });
  } catch (error: any) {
    console.error("Failed to send OTP:", error);
    return NextResponse.json({ error: "Failed to generate signature OTP." }, { status: 500 });
  }
}
