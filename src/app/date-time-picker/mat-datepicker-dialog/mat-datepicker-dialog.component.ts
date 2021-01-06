import {AfterContentInit, ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation, ContentChild, AfterViewInit} from '@angular/core';
import {ESCAPE} from '@angular/cdk/keycodes';
import {DateTimePickerComponent} from '../date-time-picker.component';
import {CalendarComponent} from '../calendar/calendar.component';

@Component({
    selector: 'date-time-picker-content',
    templateUrl: 'mat-datepicker-dialog.component.html',
    styleUrls: ['mat-datepicker-dialog.component.scss'],
    host: {
        class: 'mat-datepicker-content',
        '[class.mat-datepicker-content-touch]': 'datepicker.touchUi',
        '(keydown)': '_handleKeydown($event)',
        '[class.gregorian]': 'false',
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatDatepickerDialogComponent<D> implements  AfterViewInit {
    datepicker: DateTimePickerComponent<D>;
    @ViewChild(CalendarComponent, {static: false}) calendar: CalendarComponent<D>;


    ngAfterViewInit(){
        this.calendar._focusActiveCell();
    }

    /**
     * Handles keydown event on datepicker content.
     * @param event The event.
     */
    _handleKeydown(event: KeyboardEvent): void {
        if (event.key === 'Escape' || event.key === 'escape' || event.key === 'ESCAPE') {
            this.datepicker.close();
            event.preventDefault();
            event.stopPropagation();
        }
    }
}
