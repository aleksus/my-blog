import { AbstractControl, ValidationErrors } from "@angular/forms";

export function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if(newPassword?.value !== confirmPassword?.value){
        return { passwordsMismatch: true};
    }

    return null;
}