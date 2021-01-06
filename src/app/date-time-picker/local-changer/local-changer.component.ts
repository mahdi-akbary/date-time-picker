/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ChangeDetectionStrategy, Component, Inject, OnDestroy, Optional, ViewEncapsulation} from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material';
import {createMissingDateImplError} from '../date-time-picker.service';


/**
 * An internal component used to display a single year in the datepicker.
 * @docs-private
 */
@Component({
    moduleId: module.id,
    selector: 'npa-mat-locale-changer',
    templateUrl: 'local-changer.component.html',
    styleUrls: ['local-changer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocalChangerComponent<D> implements OnDestroy {
    any;
    lang;
    mustDestroy;

    constructor(@Optional() public dateAdapter: DateAdapter<D>,
                @Optional() @Inject(MAT_DATE_FORMATS) private dateFormats: any) {
        if (!this.dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this.dateFormats) {
            throw createMissingDateImplError('MD_DATE_FORMATS');
        }
        this.any = dateAdapter as any;
        this.mustDestroy = (dateFormats as any)._lastChanges.subscribe((v) => {
            this.lang = v;
        });
    }

    ngOnDestroy() {
        this.mustDestroy.unsubscribe();
    }

    // change locale function()
    _changeLocale() {
        this.any.changeLocale();
    }


}
