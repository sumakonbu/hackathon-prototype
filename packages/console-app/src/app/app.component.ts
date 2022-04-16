import { Component } from '@angular/core';
import { TransactionService } from './ethereum/transaction.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'console-app';
  loading$ = this.transactionService.loading$.asObservable();

  constructor(private transactionService: TransactionService) {}
}
