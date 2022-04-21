import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ContractService } from '../ethereum/contract.service';
import { MetamaskService } from '../ethereum/metamask.service';
import { ContractInfo } from './type';

@Injectable({
  providedIn: 'root',
})
export class ContractsStoreService {
  contracts$ = new BehaviorSubject<ContractInfo[]>([]);

  private subscription: Subscription;

  constructor(
    private readonly metamaskService: MetamaskService,
    private readonly contractService: ContractService
  ) {}

  init() {
    const contracts = localStorage.getItem('contracts');
    if (contracts) {
      this.contracts$.next(JSON.parse(contracts));
    }

    this.subscription = this.contractService.contracts$
      .asObservable()
      .subscribe((contracts) => {
        // Update contracts$
        const current = this.contracts$.getValue();
        contracts.forEach((contract) => {
          const idx = current.findIndex(
            (val) => val.ethAddress === contract.contract
          );
          if (idx > -1) {
            // Update tokenId
            current[idx].tokenId = contract.tokenId;
          } else {
            // Fill in dummy  because not existed in Local storage
            const val: ContractInfo = {
              id: current.length + 1,
              appName: 'Awesome App',
              url: 'https://awesome.app',
              countries: contract.countries,
              passed: contract.passed,
              tokenId: contract.tokenId,
              ethAddress: contract.contract,
            };
            current.push(val);
          }
        });
        this.contracts$.next(current);
      });
  }

  // It will be called when registering new person.
  add(contract: Omit<ContractInfo, 'id'>) {
    const current = this.contracts$.getValue();
    const id = current.length + 1;
    const newVal = current.concat({ ...contract, id });
    this.contracts$.next(newVal);

    this.saveLocalStorage();
    return id;
  }

  // It wiill be called when issueing new token.
  updateEthAddress(contract: Pick<ContractInfo, 'id' | 'ethAddress'>) {
    const newVal = this.contracts$.getValue().map((val) => {
      if (val.id === contract.id) {
        val.ethAddress = contract.ethAddress;
      }
      return val;
    });
    this.contracts$.next(newVal);

    this.saveLocalStorage();
  }

  dispose() {
    this.saveLocalStorage();
    this.contracts$.next([]);
    this.subscription.unsubscribe();
  }

  private saveLocalStorage() {
    localStorage.setItem(
      'contracts',
      JSON.stringify(this.contracts$.getValue())
    );
  }
}
