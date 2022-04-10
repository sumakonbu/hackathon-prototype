import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private _snackBar: MatSnackBar) {}

  info(message: string) {
    return this._snackBar.open(message, undefined, {
      verticalPosition: 'top',
    });
  }

  error(message: string) {
    return this._snackBar.open(message, undefined, {
      verticalPosition: 'top',
      duration: 5000,
    });
  }
}
