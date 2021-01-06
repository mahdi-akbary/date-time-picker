import {NgModule} from '@angular/core';
import {MD_DATEPICKER_SCROLL_STRATEGY_PROVIDER, DateTimePickerComponent} from './date-time-picker.component';
import {CalendarComponent} from './calendar/calendar.component';
import {MatDatepickerDialogComponent} from './mat-datepicker-dialog/mat-datepicker-dialog.component';
import {LocalChangerComponent} from './local-changer/local-changer.component';
import {MonthViewComponent} from './month-view/month-view.component';
import {YearViewComponent} from './year-view/year-view.component';
import {CalendarBodyComponent} from './calendar-body/calendar-body.component';
import {DatepickerInputDirective} from './directives/datepicker-input.directive';
import {DatepickerToggleComponent} from './datepicker-toggle/datepicker-toggle.component';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule
} from '@angular/material';
import {dateFormat, NativeDateAdapter} from './services/moment-date-adapter';
import {CommonModule} from '@angular/common';
import {OverlayModule} from '@angular/cdk/overlay';
import {A11yModule} from '@angular/cdk/a11y';
import {DatepickerIntlService} from './services/datepicker-intl.service';

export * from './calendar/calendar.component';
export * from './calendar-body/calendar-body.component';
export * from './date-time-picker.component';
export * from './directives/datepicker-input.directive';
export * from './services/datepicker-intl.service';
export * from './services/helper.service';
export * from './datepicker-toggle/datepicker-toggle.component';
export * from './month-view/month-view.component';
export * from './year-view/year-view.component';


@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatDialogModule,
        MatIconModule,
        OverlayModule,
        MatOptionModule,
        MatSelectModule,
        A11yModule,
    ],
    declarations: [
        DateTimePickerComponent,
        CalendarComponent,
        MatDatepickerDialogComponent,
        LocalChangerComponent,
        MonthViewComponent,
        YearViewComponent,
        CalendarBodyComponent,
        DatepickerInputDirective,
        DatepickerToggleComponent
    ],
    entryComponents: [
        MatDatepickerDialogComponent
    ],
    // exports: [
    //     MdCalendar,
    //     MdCalendarBody,
    //     MdDatepicker,
    //     MatButtonToggleModule,
    //     MdDatepickerInput,
    //     MdDatepickerToggle,
    //     MdMonthView,
    //     MdYearView,
    // ],
    providers: [
        MD_DATEPICKER_SCROLL_STRATEGY_PROVIDER,
        DatepickerIntlService,
        {provide: DateAdapter, useClass: NativeDateAdapter}, {
            provide: MAT_DATE_FORMATS,
            useClass: dateFormat,
            deps: [DateAdapter]
        }
    ],
    exports: [
        DateTimePickerComponent,
        MatDatepickerDialogComponent,
        CalendarComponent,
        CalendarBodyComponent,
        MatButtonToggleModule,
        MonthViewComponent,
        YearViewComponent,
        DatepickerToggleComponent,
        DatepickerInputDirective,


    ]
})
export class DateTimePickerModule {
}
