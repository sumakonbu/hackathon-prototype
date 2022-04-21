import { Injectable } from '@angular/core';
import { providers } from 'ethers';
import { ContractService } from './contract.service';

declare global {
  interface Window {
    ethereum?: providers.ExternalProvider;
  }
}

@Injectable({
  providedIn: 'root',
})
export class MetamaskService {
  // status
  isEthereumReady = false;
  currentNetwork = ''; // chainId
  accounts: string[] = [];
  currentAccount = ''; // address

  constructor(private contractService: ContractService) {}

  async connectToMetaMask(): Promise<void> {
    const ethereum = window.ethereum;

    if (!ethereum) {
      throw new Error('MetaMaskをインストールしてください');
    }
    if (!ethereum.isMetaMask) {
      throw new Error('MetaMaskをインストールしてください');
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
      throw new Error('ネットワークをShibuyaに変えてください');
    }

    // It's OK
    this.isEthereumReady = true;
    this.contractService.setOracle(this.currentNetwork);
  }
}
