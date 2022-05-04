import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ContractService } from 'src/app/ethereum/contract.service';
import { MetamaskService } from 'src/app/ethereum/metamask.service';
import { countryList } from 'src/app/shared/constans';
import { addressValidator } from 'src/app/shared/function';
import { MessageService } from 'src/app/shared/message.service';
import { ContractsStoreService, defalutValue } from '../contracts-store.service';
import { EditMode } from '../type';

@Component({
  selector: 'app-contracts-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class ContractsRegisterComponent implements OnChanges {
  @Input() mode: EditMode = 'register';
  @Input() token = defalutValue;
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mode'].currentValue === 'register') {
      this.appName.reset();
      this.url.reset();
      this.address.reset();
      this.countries.reset();
    } else if (changes['mode'].currentValue === 'edit') {
      this.appName.setValue(this.token.appName);
      this.url.setValue(this.token.url);
      this.address.setValue(this.token.ethAddress);
      this.countries.setValue(this.token.countries);
    }
  }

  register() {
    if (this.appName.invalid || this.countries.invalid) {
      this.messageService.error('入力が正しくありません。');
      return;
    }

    this.token.id = this.contractsStoreService.add({
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
    if (this.token.id === -1) {
      this.messageService.error('先に登録してください。');
      return;
    }
    if (this.mode === 'register' && this.address.invalid) {
      this.messageService.error('入力が正しくありません。');
      return;
    }

    this.contractsStoreService.updateToken({
      id: this.token.id,
      appName: this.appName.value,
      url: this.url.value,
      countries: this.countries.value,
      passed: true,
      tokenId: this.mode === 'register' ? undefined : this.token.id,
      ethAddress: this.address.value,
    });

    try {
      await this.metamaskService.connectToMetaMask();
    } catch (error: any) {
      this.messageService.error(error.message);
      return;
    }

    try {
      const result =
        this.mode === 'register'
          ? await this.contractService.registerContractToken(
              this.address.value,
              this.countries.value
            )
          : await this.contractService.modifyContractToken(
              this.token.id,
              this.address.value,
              this.countries.value
            );
      this.messageService.info(
        `txを発行しました!ブロック取り込みまでしばらくお待ちください。 ${result.hash}`
      );

      // reset
      this.token = defalutValue;
      this.appName.reset();
      this.url.reset();
      this.address.reset();
      this.countries.reset();
    } catch (error) {
      this.messageService.error(error.message);
      return;
    }
  }
}
