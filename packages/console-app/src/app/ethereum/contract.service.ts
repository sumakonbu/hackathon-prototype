import { Injectable } from '@angular/core';
import { ethers, providers } from 'ethers';
import { solidityKeccak256 } from 'ethers/lib/utils';
import { BehaviorSubject } from 'rxjs';
import { ContractToken } from '../contracts/type';
import { PersonalToken } from '../persons/type';
import OracleAbis from './abis/Oracle.json';
import { OracleAddress } from './constants';
import { TransactionService } from './transaction.service';
import { Oracle } from './types/Oracle';

declare global {
  interface Window {
    ethereum?: providers.ExternalProvider;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  // status
  isEthereumReady = false;

  // contract states
  persons$ = new BehaviorSubject<PersonalToken[]>([]);
  contracts$ = new BehaviorSubject<ContractToken[]>([]);

  private contract: Oracle;

  constructor(private transactionService: TransactionService) {}

  setOracle(currentNetwork: string) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    this.contract = new ethers.Contract(
      currentNetwork === '81' ? OracleAddress.shibuya : OracleAddress.local,
      OracleAbis,
      signer
    ) as Oracle;

    this.isEthereumReady = true;
  }

  /**
   * Personal Token
   */
  registerPersonalToken(
    userAddress: string,
    countries: [string, string, string]
  ) {
    if (!this.isEthereumReady) {
      throw new Error('Ethereum not ready!');
    }

    return this.contract
      .createPersonalToken(
        userAddress,
        this.transformFixedLengthArray(countries),
        true
      )
      .then(this.handleTx)
      .catch(this.handleError);
  }

  async listPersonalToken() {
    if (!this.isEthereumReady) {
      throw new Error('Ethereum not ready!');
    }

    // parse
    const data = await this.contract.listPersonalToken();
    const decode = ethers.utils.defaultAbiCoder.decode(
      [
        'tuple(uint256 tokenId, address user, array(string, string, string), bool passed)[]',
      ],
      data
    );

    // map
    const list: PersonalToken[] = decode[0].map((token) => {
      return {
        tokenId: token[0].toNumber(),
        user: token[1],
        countries: token[2].filter((val) => val),
        passed: token[3],
      };
    });
    this.persons$.next(list);
  }

  /**
   * Contract Token
   */
  registerContractToken(
    contractAddress: string,
    countries: [string, string, string]
  ) {
    if (!this.isEthereumReady) {
      throw new Error('Ethereum not ready!');
    }

    return this.contract
      .createContractToken(
        contractAddress,
        this.transformFixedLengthArray(countries),
        true
      )
      .then(this.handleTx)
      .catch(this.handleError);
  }

  async listContractToken() {
    if (!this.isEthereumReady) {
      throw new Error('Ethereum not ready!');
    }

    // parse
    const data = await this.contract.listContractToken();
    const decode = ethers.utils.defaultAbiCoder.decode(
      [
        'tuple(uint256 tokenId, address contract, array(string, string, string), bool passed)[]',
      ],
      data
    );

    // map
    const list: ContractToken[] = decode[0].map((token) => {
      return {
        tokenId: token[0].toNumber(),
        contract: token[1],
        countries: token[2].filter((val) => val),
        passed: token[3],
      };
    });
    this.contracts$.next(list);
  }

  /**
   * Others
   */
  grantRole(address: string) {
    if (!this.isEthereumReady) {
      throw new Error('Ethereum not ready!');
    }

    return this.contract
      .grantRole(solidityKeccak256(['string'], ['MODERATOR_ROLE']), address)
      .then(this.handleTx)
      .catch(this.handleError);
  }

  purge() {
    if (!this.isEthereumReady) {
      throw new Error('Ethereum not ready!');
    }

    return this.contract.purge().then(this.handleTx).catch(this.handleError);
  }

  private handleTx = (
    tx: ethers.ContractTransaction
  ): ethers.ContractTransaction => {
    this.transactionService.addTx(tx.hash);
    return tx;
  };

  private handleError(error: any): never {
    if (
      error.message.includes(
        'MetaMask Tx Signature: User denied transaction signature'
      )
    ) {
      throw new Error('取り止めました。');
    }
    if (!error.data || !error.data.message) {
      throw new Error('不明なエラーが発生しました。。');
    }

    const message: string = error.data.message;
    if (message.includes('User already exist!')) {
      throw new Error('そのアドレスはすでに登録されています。');
    } else if (message.includes('Contract already exist!')) {
      throw new Error('そのアドレスはすでに登録されています。');
    } else if (message.includes('AccessControl: account')) {
      throw new Error('権限がありません。');
    }

    throw new Error('不明なエラーが発生しました。。');
  }

  private transformFixedLengthArray(countries: [string, string, string]) {
    const filledCountries: [string, string, string] = [...countries];
    while (filledCountries.length < 3) {
      filledCountries.push('');
    }
    return filledCountries;
  }
}
