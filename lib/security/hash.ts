import crypto from "crypto";

/**
 * Generates a mathematically verifiable HMAC-SHA256 cryptographic hash
 * of a contract's metadata and content.
 */
export function generateContractHash(
  contractText: string,
  clientEmail: string,
  timestamp: string
): string {
  const secret = process.env.APP_SECRET_KEY || "default_pacto_secret_hash_key_2026";

  const message = `${contractText.trim()}|${clientEmail.trim()}|${timestamp.trim()}`;

  return crypto
    .createHmac("sha256", secret)
    .update(message)
    .digest("hex");
}

/**
 * Triple-Timestamp HMAC-SHA256 Cryptographic Seal
 * Executed when both parties have verified their signature OTPs.
 */
export function generateTripleTimestampHash(
  contractText: string,
  party1Email: string,
  party2Email: string,
  createdAt: string,
  party1ApprovedAt: string,
  party2ApprovedAt: string
): string {
  const secret = process.env.APP_SECRET_KEY || "default_pacto_secret_hash_key_2026";

  const message = [
    contractText.trim(),
    party1Email.trim().toLowerCase(),
    party2Email.trim().toLowerCase(),
    createdAt.trim(),
    party1ApprovedAt.trim(),
    party2ApprovedAt.trim(),
  ].join("|");

  return crypto
    .createHmac("sha256", secret)
    .update(message)
    .digest("hex");
}
