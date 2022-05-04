import { Component, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ContractService } from 'src/app/ethereum/contract.service';
import { MetamaskService } from 'src/app/ethereum/metamask.service';
import { countryList } from 'src/app/shared/constans';
import { addressValidator } from 'src/app/shared/function';
import { MessageService } from 'src/app/shared/message.service';
import { PersonsStoreService } from '../persons-store.service';

@Component({
  selector: 'app-persons-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class PersonsRegisterComponent {
  @Input() id = -1;
  firstName = new FormControl('', [Validators.required]);
  familyName = new FormControl('', [Validators.required]);
  address = new FormControl('', [Validators.required, addressValidator]);
  countries = new FormControl('', [Validators.required]);

  countryList = countryList;

  constructor(
    private readonly messageService: MessageService,
    private readonly metamaskService: MetamaskService,
    private readonly contractService: ContractService,
    private readonly personsStoreService: PersonsStoreService
  ) {}

  register() {
    if (
      this.firstName.invalid ||
      this.familyName.invalid ||
      this.countries.invalid
    ) {
      this.messageService.error('入力が正しくありません。');
      return;
    }

    this.id = this.personsStoreService.add({
      firstName: this.firstName.value,
      familyName: this.familyName.value,
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

    this.personsStoreService.updateEthAddress({
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
      const result = await this.contractService.registerPersonalToken(
        this.address.value,
        this.countries.value
      );
      this.messageService.info(
        `txを発行しました!ブロック取り込みまでしばらくお待ちください。 ${result.hash}`
      );

      // reset
      this.id = -1;
      this.firstName.reset();
      this.familyName.reset();
      this.address.reset();
      this.countries.reset();
    } catch (error) {
      this.messageService.error(error.message);
      return;
    }
  }
}
