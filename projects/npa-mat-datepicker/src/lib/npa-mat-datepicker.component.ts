import {
    ChangeDetectionStrategy,
    Component,
    ComponentRef,
    EventEmitter,
    Inject,
    InjectionToken,
    Input,
    NgZone,
    OnDestroy,
    Optional,
    Output,
    ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {Overlay, OverlayConfig, OverlayRef, PositionStrategy, RepositionScrollStrategy, ScrollStrategy} from '@angular/cdk/overlay';
import {DateAdapter, MatDialog, MatDialogRef} from '@angular/material';
import {ComponentPortal} from '@angular/cdk/portal';
import {Subscription} from 'rxjs/internal/Subscription';
import {Directionality} from '@angular/cdk/bidi';
import {DOCUMENT} from '@angular/platform-browser';
import {first} from 'rxjs/operators';
import {MatDatepickerDialogComponent} from './mat-datepicker-dialog/mat-datepicker-dialog.component';
import {createMissingDateImplError} from './npa-mat-datepicker.service';
import {DatepickerInputDirective} from './directives/datepicker-input.directive';

export const MD_DATEPICKER_SCROLL_STRATEGY = new InjectionToken<() => ScrollStrategy>('mat-datepicker-scroll-strategy');

/** @docs-private */
export function MD_DATEPICKER_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay: Overlay): () => RepositionScrollStrategy {
    return () => overlay.scrollStrategies.reposition();
}

/** @docs-private */
export const MD_DATEPICKER_SCROLL_STRATEGY_PROVIDER = {
    provide: MD_DATEPICKER_SCROLL_STRATEGY, deps: [Overlay], useFactory: MD_DATEPICKER_SCROLL_STRATEGY_PROVIDER_FACTORY,
};
let datepickerUid = 0;

@Component({
    selector: 'npa-mat-datepicker',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,

})
export class NpaMatDatepickerComponent<D> implements OnDestroy {
    /** The currently selected date. */
    @Input() get subed(): D | null {
        return this.privateValidSubed;
    }

    set subed(value: D | null) {
        this.privateValidSubed = value;
    }

    /** The date to open the calendar to initially. */
    @Input() get startAt(): D | null {
        // If an explicit startAt is set we start there, otherwise we start at whatever the currently
        // selected value is.
        return this.privateStartAt || (this.privateDatepickerInput ? this.privateDatepickerInput.value : null);
    }

    set startAt(date: D | null) {
        this.privateStartAt = date;
    }

    private privateStartAt: D | null;

    /** The view that the calendar should start in. */
    @Input() startView: 'month' | 'year' = 'month';
    @Input() type: 'normal' | 'wide' = 'normal';

    /**
     * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
     * than a popup and elements have more padding to allow for bigger touch targets.
     */
    @Input() touchUi = false;

    /** Whether the datepicker pop-up should be disabled. */
    @Input() get disabled() {
        return this.privateDisabled === undefined ? this.privateDatepickerInput.disabled : this.privateDisabled;
    }

    set disabled(value: any) {
        this.privateDisabled = coerceBooleanProperty(value);
    }

    private privateDisabled: boolean;

    /**
     * Emits new selected date when selected date changes.
     * @deprecated Switch to the `dateChange` and `dateInput` binding on the input element.
     */
    @Output() selectedChanged = new EventEmitter<D>();

    /** Whether the calendar is open. */
    opened = false;

    /** The id for the datepicker calendar. */
    id = `npa-mat-datepicker-${datepickerUid++}`;

    /** The currently selected date. */
    get _selected(): D | null {
        return this.privateValidSelected;
    }

    set _selected(value: D | null) {
        this.privateValidSelected = value;
    }


    private privateValidSelected: D | null = null;
    private privateValidSubed: D | null = null;

    /** The minimum selectable date. */
    get _minDate(): D | null {
        return this.privateDatepickerInput && this.privateDatepickerInput.min;
    }

    /** The maximum selectable date. */
    get _maxDate(): D | null {
        return this.privateDatepickerInput && this.privateDatepickerInput.max;
    }

    get _dateFilter(): (date: D | null) => boolean {
        return this.privateDatepickerInput && this.privateDatepickerInput._dateFilter;
    }

    /** A reference to the overlay when the calendar is opened as a popup. */
    private privatePopupRef: OverlayRef;

    /** A reference to the dialog when the calendar is opened as a dialog. */
    private PrivateDialogRef: MatDialogRef<any> | null;

    /** A portal containing the calendar for this datepicker. */
    private privateCalendarPortal: ComponentPortal<MatDatepickerDialogComponent<D>>;

    /** The input element this datepicker is associated with. */
    private privateDatepickerInput: DatepickerInputDirective<D>;

    /** The element that was focused before the datepicker was opened. */
    private privateFocusedElementBeforeOpen: HTMLElement | null = null;

    private privateInputSubscription: Subscription;

    constructor(private privateDialog: MatDialog,
                private privateOverlay: Overlay,
                private PrivateNgZone: NgZone,
                private PrivateViewContainerRef: ViewContainerRef,
                @Inject(MD_DATEPICKER_SCROLL_STRATEGY) private privateScrollStrategy,
                @Optional() private privateDateAdapter: DateAdapter<D>,
                @Optional() private privateDir: Directionality,
                @Optional() @Inject(DOCUMENT) private PrivateDocument: any) {
        if (!this.privateDateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }

    }

    ngOnDestroy() {
        this.close();
        if (this.privatePopupRef) {
            this.privatePopupRef.dispose();
        }
        if (this.privateInputSubscription) {
            this.privateInputSubscription.unsubscribe();
        }
    }

    /** Selects the given date */
    _select(date: D): void {
        const oldValue = this._selected;
        if ((date as any)._d) {
            this._selected = (date as any)._d;

        } else {
            this._selected = date;
        }
        this.selectedChanged.emit(this._selected);
    }

    /**
     * Register an input with this datepicker.
     * @param input The datepicker input to register with this datepicker.
     */
    _registerInput(input: DatepickerInputDirective<D>): void {
        if (this.privateDatepickerInput) {
            throw Error('An MdDatepicker can only be associated with a single input.');
        }
        this.privateDatepickerInput = input;
        this.privateInputSubscription = this.privateDatepickerInput._valueChange.subscribe((value: D | null) => this._selected = value);
    }

    /** Open the calendar. */
    open(): void {
        if (this.opened || this.disabled) {
            return;
        }
        if (!this.privateDatepickerInput) {
            throw Error('Attempted to open an MdDatepicker with no associated input.');
        }
        if (this.PrivateDocument) {
            this.privateFocusedElementBeforeOpen = this.PrivateDocument.activeElement;
        }

        this.touchUi ? this._openAsDialog() : this._openAsPopup();
        this.opened = true;
    }

    /** Close the calendar. */
    close(): void {
        if (!this.opened) {
            return;
        }
        if (this.privatePopupRef && this.privatePopupRef.hasAttached()) {
            this.privatePopupRef.detach();
        }
        if (this.PrivateDialogRef) {
            this.PrivateDialogRef.close();
            this.PrivateDialogRef = null;
        }
        if (this.privateCalendarPortal && this.privateCalendarPortal.isAttached) {
            this.privateCalendarPortal.detach();
        }
        if (this.privateFocusedElementBeforeOpen && typeof this.privateFocusedElementBeforeOpen.focus === 'function') {

            this.privateFocusedElementBeforeOpen.focus();
            this.privateFocusedElementBeforeOpen = null;
        }

        this.opened = false;
    }

    /** Open the calendar as a dialog. */
    private _openAsDialog(): void {
        this.PrivateDialogRef = this.privateDialog.open(MatDatepickerDialogComponent, {
            direction: this.privateDir ? this.privateDir.value : 'ltr', viewContainerRef: this.PrivateViewContainerRef,
        });
        this.PrivateDialogRef.afterClosed().subscribe(() => this.close());
        this.PrivateDialogRef.componentInstance.datepicker = this;
    }

    /** Open the calendar as a popup. */
    private _openAsPopup(): void {
        if (!this.privateCalendarPortal) {
            this.privateCalendarPortal = new ComponentPortal(MatDatepickerDialogComponent, this.PrivateViewContainerRef) as any;
        }

        if (!this.privatePopupRef) {
            this._createPopup();
        }

        if (!this.privatePopupRef.hasAttached()) {
            const componentRef: ComponentRef<MatDatepickerDialogComponent<D>> = this.privatePopupRef.attach(this.privateCalendarPortal) as any;
            componentRef.instance.datepicker = this as any;

            // Update the position once the calendar has rendered.
            this.PrivateNgZone.onStable.pipe(first()).subscribe(() => this.privatePopupRef.updatePosition());
        }

        this.privatePopupRef.backdropClick().subscribe(() => this.close());
    }

    /** Create the popup. */
    private _createPopup(): void {
        const overlayState = new OverlayConfig();
        overlayState.positionStrategy = this._createPopupPositionStrategy();
        overlayState.hasBackdrop = true;
        overlayState.backdropClass = 'mat-overlay-transparent-backdrop';
        overlayState.direction = this.privateDir ? this.privateDir.value : 'ltr';
        overlayState.scrollStrategy = this.privateScrollStrategy();

        this.privatePopupRef = this.privateOverlay.create(overlayState);
    }

    /** Create the popup PositionStrategy. */
    private _createPopupPositionStrategy(): PositionStrategy {
        return this.privateOverlay.position()
            .connectedTo(this.privateDatepickerInput.getPopupConnectionElementRef(), {
                originX: 'start', originY: 'bottom'
            }, {overlayX: 'start', overlayY: 'top'})
            .withFallbackPosition({originX: 'start', originY: 'top'}, {overlayX: 'start', overlayY: 'bottom'})
            .withFallbackPosition({originX: 'end', originY: 'bottom'}, {overlayX: 'end', overlayY: 'top'})
            .withFallbackPosition({originX: 'end', originY: 'top'}, {overlayX: 'end', overlayY: 'bottom'});
    }
}


