import { Component, OnInit } from '@angular/core';
import { ContractService } from 'src/app/ethereum/contract.service';
import { MetamaskService } from 'src/app/ethereum/metamask.service';
import { countryList } from 'src/app/shared/constans';
import { MessageService } from 'src/app/shared/message.service';
import { PersonsStoreService } from '../persons-store.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  persons$ = this.personsStoreService.persons$.asObservable();

  constructor(
    private readonly messageService: MessageService,
    private readonly metamaskService: MetamaskService,
    private readonly contractService: ContractService,
    private readonly personsStoreService: PersonsStoreService
  ) {}

  async ngOnInit() {
    try {
      await this.metamaskService.connectToMetaMask();
    } catch (error: any) {
      this.messageService.error(error.message);
      return;
    }
    this.contractService.listPersonalToken();
  }

  translate(countries: string[]) {
    return countries
      .map((country) => countryList.find((val) => val.code === country).name)
      .join(' ');
  }
}
