import { FormGroup, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { Principal } from '@dfinity/principal';

export class PrincipalValidator {

    static mustBeValid(control: FormGroup): ValidationErrors | null {

        const principal: string = control.value;
        
        try {

            Principal.fromText(principal);
        
        } catch(e) {

            return { 'invalid_principal': true } as ValidationErrors;
        }

        return null;
    }
}