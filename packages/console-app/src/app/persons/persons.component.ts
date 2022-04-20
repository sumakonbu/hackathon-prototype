import { Component } from '@angular/core';
import { MetamaskService } from '../ethereum/metamask.service';
import { PersonsStoreService } from './persons-store.service';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss'],
})
export class PersonsComponent {
  constructor(
    private readonly metamaskService: MetamaskService,
    private readonly personsStoreService: PersonsStoreService
  ) {}

  ngOnInit() {
    this.personsStoreService.init();
  }

  ngOnDestroy() {
    this.personsStoreService.dispose();
  }

  changeTab(index: number) {
    if (index === 0) {
      this.metamaskService.listPersonalToken();
    }
  }
}
