import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MetamaskService } from 'src/app/ethereum/metamask.service';
import { addressValidator } from 'src/app/shared/function';
import { MessageService } from 'src/app/shared/message.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  address = new FormControl('', [Validators.required, addressValidator]);
  countries = new FormControl('', [Validators.required]);

  countryList = [
    { code: 'JPN', name: '日本' },
    { code: 'KOR', name: '韓国' },
    { code: 'PRK', name: '北朝鮮' },
    { code: 'TWN', name: '台湾' },
    { code: 'CHN', name: '中国' },
    { code: 'USA', name: 'アメリカ合衆国' },
    { code: 'RUS', name: 'ロシア' },
  ];

  constructor(
    private readonly messageService: MessageService,
    private readonly metamaskService: MetamaskService
  ) {}

  async issue() {
    if (this.address.invalid || this.countries.invalid) {
      this.messageService.error('入力が正しくありません。');
      return;
    }

    try {
      await this.metamaskService.connectToMetaMask();
    } catch (error: any) {
      this.messageService.error(error.message);
      return;
    }

    try {
      const result = await this.metamaskService.registerPersonalToken(
        this.address.value,
        this.countries.value
      );
      this.messageService.info(`txを発行しました! ${result.hash}`);
    } catch (error) {
      this.messageService.error(error.message);
      return;
    }
  }
}
