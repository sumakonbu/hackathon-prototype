import { Component } from '@angular/core';
import { ContractsStoreService } from './contracts-store.service';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss'],
})
export class ContractsComponent {
  constructor(private readonly contractsStoreService: ContractsStoreService) {}

  ngOnInit() {
    this.contractsStoreService.init();
  }

  ngOnDestroy() {
    this.contractsStoreService.dispose();
  }
}
