import { Component } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { ethers } from 'ethers';
import { explorerUrl } from 'src/app/ethereum/constants';
import { MetamaskService } from 'src/app/ethereum/metamask.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  address = new FormControl('', [Validators.required, this.addressValidator]);
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
      this.messageService.info(`txを発行しました! ${explorerUrl.shibuya}/tx/${result.hash}`);
    } catch (error) {
      this.messageService.error(error.message);
      return;
    }
  }

  private addressValidator(control: AbstractControl) {
    const isAddress = ethers.utils.isAddress(control.value);
    return !isAddress ? { invalidAddress: { value: control.value } } : null;
  }
}
