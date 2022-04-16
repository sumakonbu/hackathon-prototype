import { Component, OnInit } from '@angular/core';
import { MetamaskService } from 'src/app/ethereum/metamask.service';
import { MessageService } from 'src/app/shared/message.service';
import { PersonalToken } from '../type';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  persons$ = this.metamaskService.persons$.asObservable();

  constructor(
    private readonly messageService: MessageService,
    private readonly metamaskService: MetamaskService
  ) {}

  async ngOnInit() {
    try {
      await this.metamaskService.connectToMetaMask();
    } catch (error: any) {
      this.messageService.error(error.message);
      return;
    }
    this.metamaskService.listPersonalToken();
  }
}
