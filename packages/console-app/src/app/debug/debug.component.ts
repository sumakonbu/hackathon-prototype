import { Component } from '@angular/core';
import { MetamaskService } from '../ethereum/metamask.service';
import { MessageService } from '../shared/message.service';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss'],
})
export class DebugComponent {
  constructor(
    private messageService: MessageService,
    private metamaskService: MetamaskService
  ) {}

  async purge() {
    try {
      await this.metamaskService.connectToMetaMask();
    } catch (error: any) {
      this.messageService.error(error.message);
      return;
    }

    try {
      const result = await this.metamaskService.purge();
      this.messageService.info(`txを発行しました! ${result.hash}`);
    } catch (error) {
      this.messageService.error(error.message);
    }
  }
}
