export interface ContractInfo {
  id: number;
  appName: string;
  url: string;
  countries: string[];
  passed: boolean;
  tokenId: number;
  ethAddress: string;
}

export interface ContractToken {
  tokenId: number;
  contract: string;
  countries: string[];
  passed: boolean;
}

export type EditMode = 'register' | 'edit';
