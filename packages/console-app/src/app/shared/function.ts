import { AbstractControl } from '@angular/forms';
import { ethers } from 'ethers';
import { countryList } from './constans';

export function addressValidator(control: AbstractControl) {
  // disable to make debug easy with TESTNET.
  // if (this.metamaskService.currentNetwork !== '336') {
  //   return null;
  // }

  const isAddress = ethers.utils.isAddress(control.value);
  return !isAddress ? { invalidAddress: { value: control.value } } : null;
}

export function resolveCountries(countries: string[]) {
  return countries
    .map((country) => countryList.find((val) => val.code === country).name)
    .join(' ');
}
