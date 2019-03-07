import {AfterContentInit, ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation} from '@angular/core';
import {ESCAPE} from '@angular/cdk/keycodes';
import {NpaMatDatepickerComponent} from '../npa-mat-datepicker.component';
import {CalendarComponent} from '../calendar/calendar.component';

@Component({
    selector: 'npa-mat-datepicker-content',
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
export class MatDatepickerDialogComponent<D> implements AfterContentInit {
    datepicker: NpaMatDatepickerComponent<D>;
    @ViewChild(CalendarComponent) calendar: CalendarComponent<D>;


    ngAfterContentInit() {

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
