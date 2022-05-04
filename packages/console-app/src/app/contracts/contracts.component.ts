import { Component } from '@angular/core';
import { ContractsStoreService, defalutValue } from './contracts-store.service';
import { ContractInfo, EditMode } from './type';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss'],
})
export class ContractsComponent {
  selectedIndex: number;
  editMode: EditMode = 'register';
  token = defalutValue;

  constructor(private readonly contractsStoreService: ContractsStoreService) {}

  ngOnInit() {
    this.contractsStoreService.init();
  }

  ngOnDestroy() {
    this.contractsStoreService.dispose();
  }

  changeTab(tabIndex: number) {
    if (tabIndex === 0) {
      // reset
      this.editMode = 'register';
      this.token = defalutValue;
    }
  }

  modificationSelected(token: ContractInfo) {
    this.selectedIndex = 1;
    this.editMode = 'edit';
    this.token = { ...token };
  }
}
