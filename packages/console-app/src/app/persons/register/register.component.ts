import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  address = new FormControl();
  countries = new FormControl();

  countryList = [
    { code: 'JPN', name: '日本' },
    { code: 'KOR', name: '韓国' },
    { code: 'PRK', name: '北朝鮮' },
    { code: 'TWN', name: '台湾' },
    { code: 'CHN', name: '中国' },
    { code: 'USA', name: 'アメリカ合衆国' },
    { code: 'RUS', name: 'ロシア' },
  ];

  constructor() {}

  ngOnInit(): void {}
}
