import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const emailValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(control.value);
    return isValid
      ? null
      : { email: { message: 'Please enter a valid email address' } };
  };
};

export const getErrorMessage = (
  control: AbstractControl,
  fieldName: string
): string => {
  if (control.hasError('required')) {
    return `${fieldName} is required`;
  }
  if (control.hasError('email')) {
    return (
      control.getError('email')?.message || 'Please enter a valid email address'
    );
  }
  return '';
};
