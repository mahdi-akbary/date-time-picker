# NPA Material DatePicker for Angular Shamsi version

## Angular Dari datepicker with awesome features!

This is a fork of @angular-persian/material-date-picker and I have upgrade it and it's angular decencies from 5.2.0 to 7.2.0 and the Persian month names to Dari names. link: https://github.com/kordeviant/mat-datepciker-module-persian
# 
### Prerequisites
You should have @angular/material, @angular/cdk and moment-jalaali installed to your app

### Install
```bash
npm i --save npa-mat-datepicker
```
### Add Module
```typescript
import {NpaMatDatepickerModule} from 'npa-mat-datepicker';
```

### Example
```html
<npa-mat-datepicker type="wide" #picker (selectedChanged)="setDateReturn($event);"></npa-mat-datepicker>
<mat-form-field>
  <input required matInput (mouseup)="dpickerFocus(picker)" [(ngModel)]="today" (focus)="dpickerFocus(picker)" readonly
         [matDatepicker]="picker" placeholder="تاریخ">

</mat-form-field>
```



### Contribute
```bash
npm install --save 
```

development:
```bash
yarn install
yarn build:lib
ng serve
```
