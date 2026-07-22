import fs from 'fs';
import path from 'path';

export type ContractStatus = 'pending_review' | 'pending_approval' | 'approved' | 'expired';

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

const DB_PATH = path.join(process.cwd(), 'mock-db.json');

export const getContracts = (): ContractDocument[] => {
  if (!fs.existsSync(DB_PATH)) {
    return [];
  }
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    return parsed.map((c: any) => ({
      ...c,
      editsRemaining: typeof c.editsRemaining === 'number' ? c.editsRemaining : 3
    }));
  } catch (e) {
    return [];
  }
};

export const saveContract = (contract: ContractDocument) => {
  const contracts = getContracts();
  contracts.push(contract);
  fs.writeFileSync(DB_PATH, JSON.stringify(contracts, null, 2));
};

export const getContractById = (id: string): ContractDocument | undefined => {
  return getContracts().find(c => c.id === id);
};

export const updateContract = (id: string, updates: Partial<ContractDocument>): ContractDocument | undefined => {
  const contracts = getContracts();
  const index = contracts.findIndex(c => c.id === id);
  if (index === -1) return undefined;
  
  contracts[index] = { ...contracts[index], ...updates };
  fs.writeFileSync(DB_PATH, JSON.stringify(contracts, null, 2));
  return contracts[index];
};

export const getContractsByUser = (userEmail: string) => {
  const emailLower = (userEmail || '').toLowerCase();
  return getContracts()
    .filter(c => {
      const uEmail = (c.userId || '').toLowerCase();
      const p1Email = (c.party1Email || '').toLowerCase();
      const p2Email = (c.party2Email || '').toLowerCase();
      return uEmail === emailLower || p1Email === emailLower || p2Email === emailLower;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};
