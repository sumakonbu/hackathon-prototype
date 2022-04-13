import { Injectable } from '@angular/core';
import { ethers, providers, Signer } from 'ethers';
import { PersonalToken } from '../persons/type';
import OracleAbis from './abis/Oracle.json';
import { OracleAddress } from './constants';
import { Oracle } from './types/Oracle';

declare global {
  interface Window {
    ethereum?: providers.ExternalProvider;
  }
}

@Injectable({
  providedIn: 'root',
})
export class MetamaskService {
  isEthereumReady = false;
  currentNetwork = ''; // chainId
  accounts: string[] = [];
  currentAccount = ''; // address

  private contract: Oracle;

  constructor() {}

  async connectToMetaMask(): Promise<void> {
    const ethereum = window.ethereum;

    if (!ethereum) {
      throw new Error('MetaMask is not installed!');
    }
    if (!ethereum.isMetaMask) {
      throw new Error('It is not MetaMask!');
    }

    try {
      this.accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log('accounts', this.accounts);
    } catch (error) {
      throw new Error('Failed to get MetaMask Accounts!');
    }
    if (this.accounts === undefined || this.accounts.length === 0) {
      throw new Error('MetaMask does not have any accounts!');
    }

    try {
      this.currentAccount = (ethereum as any).selectedAddress;
      console.log('currentAccount', this.currentAccount);
    } catch (error) {
      throw new Error('Failed to select MetaMask 1st Account!');
    }

    this.currentNetwork = (ethereum as any).networkVersion;
    if (!(this.currentNetwork === '81' || this.currentNetwork === '4369')) {
      throw new Error('Change to Shibuya network!');
    }

    // It's OK
    this.isEthereumReady = true;
    this.setOracle();
  }

  registerPersonalToken(userAddress: string, countries: string[]) {
    if (!this.isEthereumReady) {
      throw new Error('Ethereum not ready!');
    }
    return this.contract.createPersonalToken(
      userAddress,
      JSON.stringify(countries),
      true
    );
  }

  async listPersonalToken() {
    if (!this.isEthereumReady) {
      throw new Error('Ethereum not ready!');
    }

    // parse
    const data = await this.contract.listPersonalToken();
    const decode = ethers.utils.defaultAbiCoder.decode(
      ['tuple(uint256 tokenId, address user, string countries, bool passed)[]'],
      data
    );

    // map
    const list: PersonalToken[] = decode[0].map((token) => {
      return {
        tokenId: token[0].toNumber(),
        user: token[1],
        countries: JSON.parse(token[2]),
        passed: token[3],
      };
    });
    return list;
  }

  private setOracle() {
    if (!this.isEthereumReady) {
      throw new Error('Ethereum not ready!');
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    this.contract = new ethers.Contract(
      this.currentNetwork === '81'
        ? OracleAddress.shibuya
        : OracleAddress.local,
      OracleAbis,
      signer
    ) as Oracle;
  }
}
