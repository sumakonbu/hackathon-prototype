import { AbstractControl } from '@angular/forms';
import { ethers } from 'ethers';

export function addressValidator(control: AbstractControl) {
  // disable to make debug easy with TESTNET.
  // if (this.metamaskService.currentNetwork !== '336') {
  //   return null;
  // }

  const isAddress = ethers.utils.isAddress(control.value);
  return !isAddress ? { invalidAddress: { value: control.value } } : null;
}
