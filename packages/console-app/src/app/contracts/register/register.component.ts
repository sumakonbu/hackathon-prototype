import { Component, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ContractService } from 'src/app/ethereum/contract.service';
import { MetamaskService } from 'src/app/ethereum/metamask.service';
import { countryList } from 'src/app/shared/constans';
import { addressValidator } from 'src/app/shared/function';
import { MessageService } from 'src/app/shared/message.service';
import { ContractsStoreService } from '../contracts-store.service';

@Component({
  selector: 'app-contracts-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class ContractsRegisterComponent {
  @Input() id = -1;
  appName = new FormControl('', [Validators.required]);
  url = new FormControl('', []);
  address = new FormControl('', [Validators.required, addressValidator]);
  countries = new FormControl('', [Validators.required]);

  countryList = countryList;

  constructor(
    private readonly messageService: MessageService,
    private readonly metamaskService: MetamaskService,
    private readonly contractService: ContractService,
    private readonly contractsStoreService: ContractsStoreService
  ) {}

  register() {
    if (this.appName.invalid || this.countries.invalid) {
      this.messageService.error('入力が正しくありません。');
      return;
    }

    this.id = this.contractsStoreService.add({
      appName: this.appName.value,
      url: this.url.value,
      countries: [...this.countries.value],
      passed: true, // initial value
      tokenId: -1, // initial value
      ethAddress: '', // initial value
    });
    this.messageService.info(`登録しました!`);
  }

  async issue() {
    if (this.id === -1) {
      this.messageService.error('先に登録してください。');
      return;
    }
    if (this.address.invalid) {
      this.messageService.error('入力が正しくありません。');
      return;
    }

    this.contractsStoreService.updateEthAddress({
      id: this.id,
      ethAddress: this.address.value,
    });

    try {
      await this.metamaskService.connectToMetaMask();
    } catch (error: any) {
      this.messageService.error(error.message);
      return;
    }

    try {
      const result = await this.contractService.registerContractToken(
        this.address.value,
        this.countries.value
      );
      this.messageService.info(
        `txを発行しました!ブロック取り込みまでしばらくお待ちください。 ${result.hash}`
      );
    } catch (error) {
      this.messageService.error(error.message);
      return;
    }
  }
}
