import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ContractService } from 'src/app/ethereum/contract.service';
import { MetamaskService } from 'src/app/ethereum/metamask.service';
import { resolveCountries } from 'src/app/shared/function';
import { MessageService } from 'src/app/shared/message.service';
import { ContractsStoreService } from '../contracts-store.service';
import { ContractInfo } from '../type';

@Component({
  selector: 'app-contracts-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ContractsListComponent implements OnInit {
  contracts$ = this.contractsStoreService.contracts$.asObservable();

  @Output()
  private modificationSelected = new EventEmitter<ContractInfo>();

  constructor(
    private readonly messageService: MessageService,
    private readonly metamaskService: MetamaskService,
    private readonly contractService: ContractService,
    private readonly contractsStoreService: ContractsStoreService
  ) {}

  async ngOnInit() {
    try {
      await this.metamaskService.connectToMetaMask();
    } catch (error: any) {
      this.messageService.error(error.message);
      return;
    }
    this.contractService.listContractToken();
  }

  modifiy(contractInfo: ContractInfo) {
    this.modificationSelected.emit(contractInfo);
  }

  translate(countries: string[]) {
    return resolveCountries(countries);
  }
}
