import { Injectable } from '@angular/core';
import { ethers, providers, Signer } from 'ethers';
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

  registerPersonalToken(userAddress, countries) {
    if (!this.isEthereumReady) {
      throw new Error('Ethereum not ready!');
    }
    return this.contract.createPersonalToken(userAddress, countries, true);
  }

  private setOracle() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(this.currentAccount);
    this.contract = new ethers.Contract(
      this.currentNetwork === '81'
        ? OracleAddress.shibuya
        : OracleAddress.local,
      OracleAbis,
      signer
    ) as Oracle;
  }
}
