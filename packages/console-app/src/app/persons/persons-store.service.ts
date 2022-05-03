import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ContractService } from '../ethereum/contract.service';
import { MetamaskService } from '../ethereum/metamask.service';
import { PersonalInfo } from './type';

@Injectable({
  providedIn: 'root',
})
export class PersonsStoreService {
  persons$ = new BehaviorSubject<PersonalInfo[]>([]);

  private subscription: Subscription;

  constructor(
    private readonly metamaskService: MetamaskService,
    private readonly contractService: ContractService
  ) {}

  async init() {
    const persons = localStorage.getItem('persons');
    if (persons) {
      this.persons$.next(JSON.parse(persons));
    }

    try {
      await this.contractService.listPersonalToken();
    } catch (error) {}

    this.subscription = this.contractService.persons$
      .asObservable()
      .subscribe((persons) => {
        // Update persons$
        const current = this.persons$.getValue();
        persons.forEach((person) => {
          const idx = current.findIndex(
            (val) => val.ethAddress === person.user
          );
          if (idx > -1) {
            // Update tokenId
            current[idx].tokenId = person.tokenId;
          } else {
            // Fill in dummy  because not existed in Local storage
            const val: PersonalInfo = {
              id: current.length + 1,
              firstName: '花子',
              familyName: '名無し',
              countries: person.countries,
              passed: person.passed,
              tokenId: person.tokenId,
              ethAddress: person.user,
            };
            current.push(val);
          }
        });
        this.persons$.next(current);
      });
  }

  // It will be called when registering new person.
  add(person: Omit<PersonalInfo, 'id'>) {
    const current = this.persons$.getValue();
    const id = current.length + 1;
    const newVal = current.concat({ ...person, id });
    this.persons$.next(newVal);

    this.saveLocalStorage();
    return id;
  }

  // It wiill be called when issueing new token.
  updateEthAddress(person: Pick<PersonalInfo, 'id' | 'ethAddress'>) {
    const newVal = this.persons$.getValue().map((val) => {
      if (val.id === person.id) {
        val.ethAddress = person.ethAddress;
      }
      return val;
    });
    this.persons$.next(newVal);

    this.saveLocalStorage();
  }

  dispose() {
    this.saveLocalStorage();
    this.persons$.next([]);
    this.subscription.unsubscribe();
  }

  private saveLocalStorage() {
    localStorage.setItem('persons', JSON.stringify(this.persons$.getValue()));
  }
}
