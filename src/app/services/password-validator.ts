import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.value;
  if (!password) {
    return null;
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumeric = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const valid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;
  if (!valid) {
    return { passwordStrength: 'Password must contain uppercase, lowercase, number, and special character' };
  }
  return null;
}
