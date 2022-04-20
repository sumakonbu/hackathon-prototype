export interface PersonalInfo {
  id: number;
  firstName: string;
  familyName: string;
  countries: string[];
  passed: boolean;
  tokenId: number;
  ethAddress: string;
}

export interface PersonalToken {
  tokenId: number;
  user: string;
  countries: string[];
  passed: boolean;
}
