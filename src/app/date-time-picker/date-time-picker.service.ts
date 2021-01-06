import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DateTimePickerService {

    constructor() {
    }


}

export function createMissingDateImplError(provider: string) {
    return Error(
        `MdDatepicker: No provider found for ${provider}. You must import one of the following ` +
        `modules at your application root: MdNativeDateModule, or provide a custom implementation.`);
}
