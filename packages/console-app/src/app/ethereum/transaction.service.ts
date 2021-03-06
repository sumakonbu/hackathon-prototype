import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ethers } from 'ethers';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  loading$ = new BehaviorSubject<boolean>(false);

  private hashes: string[] = [];

  constructor(private _snackBar: MatSnackBar) {}

  addTx(hash: string) {
    this.hashes.push(hash);

    this.watch();
  }

  private watch() {
    this.loading$.next(true);

    const timeId = setInterval(async () => {
      if (!window.ethereum) {
        return;
      }

      // Call tx to ethereum
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const txs = this.hashes.map((hash) =>
        provider.getTransactionReceipt(hash)
      );
      const receipts = await Promise.all(txs);

      // Check whether to complete.
      receipts.forEach((receipt) => {
        // Block completed if having receipt.
        if (receipt) {
          this.hashes = this.hashes.filter(
            (hash) => hash !== receipt.transactionHash
          );
          this._snackBar.open(
            `txが完了しました! ${receipt.transactionHash}`,
            'ok',
            {
              horizontalPosition: 'right',
              verticalPosition: 'top',
            }
          );
        }
      });

      // Judge end
      if (this.hashes.length === 0) {
        this.loading$.next(false);
        clearInterval(timeId);
      }
    }, 1000);
  }
}
