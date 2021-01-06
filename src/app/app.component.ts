import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
   <br>
   <br>
   <br>
   <br>
   <br>
   <br>
   <br>
   <br>
   <br>
   <br>
   <br>
   <!--<mat-form-field>-->
     <!--<input matInput [matDatepicker]="picker" placeholder="Choose a date">-->
     <!--<mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>-->
     <!--<mat-datepicker #picker></mat-datepicker>-->
   <!--</mat-form-field>-->
    <npa-mat-datepicker [type]="type ? 'wide' : 'normal'" #picker></npa-mat-datepicker>
    <npa-mat-datepicker [type]="type ? 'wide' : 'normal'" #picker2 [subed]="firstDate"></npa-mat-datepicker>
    <mat-form-field class="centered">
      <input required matInput (mouseup)="dpickerFocus(picker)" [(ngModel)]="firstDate"  readonly
             [matDatepicker]="picker" placeholder="تاریخ اول">

    </mat-form-field>
    <mat-form-field class="centered">
      <input required matInput (mouseup)="dpickerFocus(picker2)" [(ngModel)]="secondDate" readonly
             [matDatepicker]="picker2" placeholder="تاریخ دوم">

    </mat-form-field>
    <div class="centered">
      <mat-checkbox matInput [(ngModel)]="type">wide</mat-checkbox>
    </div>


    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  firstDate = new Date(new Date().getTime() + 80000000);
  secondDate = new Date(new Date().getTime() + 240000000);
  @ViewChild('picker', {static: false}) picker;
  type = true;

  constructor() {
  }

  ngOnInit() {
    setTimeout(() => {
      this.dpickerFocus(this.picker);
    },500);
  }

  setDateReturn(e) {
    console.log(e);
  }

  dpickerFocus(picker) {
    picker.open();
  }
}
