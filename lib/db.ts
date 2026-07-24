import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

export type ContractStatus = "pending_review" | "pending_approval" | "approved" | "expired";

export interface ContractDocument {
  id: string;
  userId: string;
  party1: string;
  party1Email?: string;
  party2: string;
  party2Email?: string;
  mode: string;
  content: string;
  hash: string;
  createdAt: string;
  status?: ContractStatus;
  party1ApprovedAt?: string | null;
  party2ApprovedAt?: string | null;
  expirationDate?: string | null;
  otpCode?: string | null;
  otpExpiresAt?: string | null;
  editsRemaining?: number;
}

export interface UserProfile {
  userEmail: string;
  name: string;
  contactNo: string;
  signingEmail: string;
  bio: string;
  authorizedEmails: string[];
  preferences: {
    emailNotifications: boolean;
    autoFillParty1Name: boolean;
    darkTheme: boolean;
  };
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY !== "your-supabase-service-role-key"
    ? process.env.SUPABASE_SERVICE_ROLE_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseKey && !supabaseUrl.includes("your-supabase-url")
);

export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseKey) : null;

// In-Memory Fallback Caches for Local / Offline execution
let inMemoryContracts: ContractDocument[] | null = null;
let inMemoryProfiles: Record<string, UserProfile> = {};

const DB_PATH = path.join(process.cwd(), "mock-db.json");
const PROFILE_DB_PATH = path.join(process.cwd(), "mock-profiles.json");

function mapRowToContract(row: any): ContractDocument {
  return {
    id: row.id,
    userId: row.user_id || row.userId || "",
    party1: row.party1 || "Party 1",
    party1Email: row.party1_email || row.party1Email || "",
    party2: row.party2 || "Party 2",
    party2Email: row.party2_email || row.party2Email || "",
    mode: row.mode || "pro",
    content: row.content || "",
    hash: row.hash || "",
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    status: row.status || "pending_review",
    party1ApprovedAt: row.party1_approved_at || row.party1ApprovedAt || null,
    party2ApprovedAt: row.party2_approved_at || row.party2ApprovedAt || null,
    expirationDate: row.expiration_date || row.expirationDate || null,
    otpCode: row.otp_code || row.otpCode || null,
    otpExpiresAt: row.otp_expires_at || row.otpExpiresAt || null,
    editsRemaining: typeof row.edits_remaining === "number" ? row.edits_remaining : typeof row.editsRemaining === "number" ? row.editsRemaining : 3,
  };
}

function mapContractToRow(contract: ContractDocument): any {
  return {
    id: contract.id,
    user_id: contract.userId,
    party1: contract.party1,
    party1_email: contract.party1Email,
    party2: contract.party2,
    party2_email: contract.party2Email,
    mode: contract.mode,
    content: contract.content,
    hash: contract.hash,
    created_at: contract.createdAt,
    status: contract.status || "pending_review",
    party1_approved_at: contract.party1ApprovedAt,
    party2_approved_at: contract.party2ApprovedAt,
    expiration_date: contract.expirationDate,
    otp_code: contract.otpCode,
    otp_expires_at: contract.otpExpiresAt,
    edits_remaining: typeof contract.editsRemaining === "number" ? contract.editsRemaining : 3,
  };
}

// ─── CONTRACT DATABASE OPERATIONS ───

export async function getContracts(): Promise<ContractDocument[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("contracts").select("*").order("created_at", { ascending: false });
      if (!error && data) {
        return data.map(mapRowToContract);
      }
    } catch (e) {
      console.warn("Supabase fetch failed, falling back to local storage:", e);
    }
  }

  // Fallback to local memory / file DB
  if (inMemoryContracts !== null) return inMemoryContracts;
  if (fs.existsSync(DB_PATH)) {
    try {
      const data = fs.readFileSync(DB_PATH, "utf-8");
      inMemoryContracts = JSON.parse(data).map(mapRowToContract);
      return inMemoryContracts || [];
    } catch (e) {
      inMemoryContracts = [];
    }
  }
  return inMemoryContracts || [];
}

export async function saveContract(contract: ContractDocument): Promise<ContractDocument> {
  const current = await getContracts();
  inMemoryContracts = [contract, ...current.filter((c) => c.id !== contract.id)];

  // Automatically ensure profile exists for the contract creator/user
  const creatorEmail = (contract.party1Email || contract.userId || "").toLowerCase();
  if (creatorEmail) {
    try {
      const existingProfile = await getUserProfile(creatorEmail);
      if (!existingProfile.name && contract.party1) {
        await saveUserProfile({
          ...existingProfile,
          name: contract.party1,
          userEmail: creatorEmail,
          signingEmail: existingProfile.signingEmail || creatorEmail,
        });
      }
    } catch (e) {}
  }

  if (supabase) {
    try {
      const row = mapContractToRow(contract);
      const { error } = await supabase.from("contracts").upsert(row);
      if (error) console.error("Supabase contract upsert error:", error);
    } catch (e) {
      console.error("Supabase contract save failed:", e);
    }
  }

  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(inMemoryContracts, null, 2));
  } catch (e) {}

  return contract;
}

export async function getContractById(id: string): Promise<ContractDocument | undefined> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("contracts").select("*").eq("id", id).single();
      if (!error && data) {
        return mapRowToContract(data);
      }
    } catch (e) {}
  }

  const contracts = await getContracts();
  return contracts.find((c) => c.id === id);
}

export async function updateContract(id: string, updates: Partial<ContractDocument>): Promise<ContractDocument | undefined> {
  const existing = await getContractById(id);
  if (!existing) return undefined;

  const updated: ContractDocument = { ...existing, ...updates };

  if (supabase) {
    try {
      const row = mapContractToRow(updated);
      await supabase.from("contracts").update(row).eq("id", id);
    } catch (e) {
      console.error("Supabase contract update failed:", e);
    }
  }

  const current = await getContracts();
  inMemoryContracts = current.map((c) => (c.id === id ? updated : c));

  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(inMemoryContracts, null, 2));
  } catch (e) {}

  return updated;
}

export async function getContractsByUser(userEmail: string): Promise<ContractDocument[]> {
  const emailLower = (userEmail || "").toLowerCase();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("contracts")
        .select("*")
        .or(`user_id.ilike.${emailLower},party1_email.ilike.${emailLower},party2_email.ilike.${emailLower}`)
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data.map(mapRowToContract);
      }
    } catch (e) {
      console.warn("Supabase user contracts query error:", e);
    }
  }

  const all = await getContracts();
  return all.filter((c) => {
    const uEmail = (c.userId || "").toLowerCase();
    const p1Email = (c.party1Email || "").toLowerCase();
    const p2Email = (c.party2Email || "").toLowerCase();
    return uEmail === emailLower || p1Email === emailLower || p2Email === emailLower;
  });
}

// ─── USER PROFILE OPERATIONS ───

export async function getUserProfile(userEmail: string): Promise<UserProfile> {
  const emailLower = (userEmail || "").toLowerCase();

  if (supabase) {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("user_email", emailLower).single();
      if (!error && data) {
        return {
          userEmail: data.user_email,
          name: data.name || "",
          contactNo: data.contact_no || "",
          signingEmail: data.signing_email || emailLower,
          bio: data.bio || "",
          authorizedEmails: data.authorized_emails || [emailLower],
          preferences: data.preferences || { emailNotifications: true, autoFillParty1Name: true, darkTheme: true },
        };
      }
    } catch (e) {}
  }

  if (inMemoryProfiles[emailLower]) return inMemoryProfiles[emailLower];
  return {
    userEmail: emailLower,
    name: "",
    contactNo: "",
    signingEmail: emailLower,
    bio: "",
    authorizedEmails: [emailLower],
    preferences: { emailNotifications: true, autoFillParty1Name: true, darkTheme: true },
  };
}

export async function saveUserProfile(profile: UserProfile): Promise<UserProfile> {
  const emailLower = profile.userEmail.toLowerCase();
  inMemoryProfiles[emailLower] = { ...profile, userEmail: emailLower };

  if (supabase) {
    try {
      await supabase.from("profiles").upsert({
        user_email: emailLower,
        name: profile.name,
        contact_no: profile.contactNo,
        signing_email: profile.signingEmail,
        bio: profile.bio,
        authorized_emails: profile.authorizedEmails,
        preferences: profile.preferences,
      });
    } catch (e) {}
  }

  try {
    fs.writeFileSync(PROFILE_DB_PATH, JSON.stringify(inMemoryProfiles, null, 2));
  } catch (e) {}

  return profile;
}
