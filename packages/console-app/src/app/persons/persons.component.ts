import { Component } from '@angular/core';
import { PersonsStoreService } from './persons-store.service';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss'],
})
export class PersonsComponent {
  constructor(private readonly personsStoreService: PersonsStoreService) {}

  ngOnInit() {
    this.personsStoreService.init();
  }

  ngOnDestroy() {
    this.personsStoreService.dispose();
  }
}
