/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
    ChangeDetectionStrategy,
    Component,
    Input,
    ViewEncapsulation,
    OnDestroy,
    ChangeDetectorRef,
} from '@angular/core';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {Subscription} from 'rxjs/internal/Subscription';
import {DateTimePickerComponent} from '../date-time-picker.component';
import {DatepickerIntlService} from '../services/datepicker-intl.service';


@Component({
    selector: 'npa-mat-datepicker-toggle',
    template: '',
    host: {
        'class': 'mat-datepicker-toggle',
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerToggleComponent<D> implements OnDestroy {
    private _intlChanges: Subscription;

    /** Datepicker instance that the button will toggle. */
    @Input('for') datepicker: DateTimePickerComponent<D>;

    /** Whether the toggle button is disabled. */
    @Input()
    get disabled() {
        return this._disabled === undefined ? this.datepicker.disabled : this._disabled;
    }

    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
    }

    private _disabled: boolean;

    constructor(public _intl: DatepickerIntlService, changeDetectorRef: ChangeDetectorRef) {
        this._intlChanges = _intl.changes.subscribe(() => changeDetectorRef.markForCheck());
    }

    ngOnDestroy() {
        this._intlChanges.unsubscribe();
    }

    _open(event: Event): void {
        if (this.datepicker && !this.disabled) {
            this.datepicker.open();
            event.stopPropagation();
        }
    }
}
