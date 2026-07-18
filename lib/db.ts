import fs from 'fs';
import path from 'path';

export interface ContractDocument {
  id: string;
  userId: string;
  party1: string;
  party2: string;
  mode: string;
  content: string;
  hash: string;
  createdAt: string;
}

const DB_PATH = path.join(process.cwd(), 'mock-db.json');

export const getContracts = (): ContractDocument[] => {
  if (!fs.existsSync(DB_PATH)) {
    return [];
  }
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

export const saveContract = (contract: ContractDocument) => {
  const contracts = getContracts();
  contracts.push(contract);
  fs.writeFileSync(DB_PATH, JSON.stringify(contracts, null, 2));
};

export const getContractsByUser = (userId: string) => {
  return getContracts().filter(c => c.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};
