import crypto from "crypto";

/**
 * Generates a mathematically verifiable HMAC-SHA256 cryptographic hash
 * of a contract's metadata and content.
 * 
 * @param contractText The text content of the contract
 * @param clientEmail The email address of the client/signee
 * @param timestamp The timestamp associated with the contract creation/signature
 * @returns Hex string representation of the HMAC-SHA256 hash
 */
export function generateContractHash(
  contractText: string,
  clientEmail: string,
  timestamp: string
): string {
  const secret = process.env.APP_SECRET_KEY;
  if (!secret) {
    throw new Error("APP_SECRET_KEY environment variable is not defined.");
  }

  // Concatenate input fields with a delimiter to prevent collision vulnerabilities
  const message = `${contractText.trim()}|${clientEmail.trim()}|${timestamp.trim()}`;

  return crypto
    .createHmac("sha256", secret)
    .update(message)
    .digest("hex");
}
