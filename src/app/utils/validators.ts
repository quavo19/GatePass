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

export const phoneValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    // Ghana phone number validation: starts with 0 or +233, followed by 9 digits
    const phoneRegex = /^(\+233|0)[0-9]{9}$/;
    const isValid = phoneRegex.test(control.value.replace(/\s/g, ''));
    return isValid
      ? null
      : { phone: { message: 'Please enter a valid Ghana phone number' } };
  };
};

export const ghanaCardValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    // Ghana Card format: GHA-XXXXXXXX-X (e.g., GHA-123456789-1)
    const ghanaCardRegex = /^GHA-\d{9}-\d{1}$/;
    const isValid = ghanaCardRegex.test(control.value.toUpperCase());
    return isValid
      ? null
      : {
          ghanaCard: {
            message: 'Please enter a valid Ghana Card number (GHA-XXXXXXXX-X)',
          },
        };
  };
};

export const otpValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    // OTP should be 4-6 digits
    const otpRegex = /^\d{4,6}$/;
    const isValid = otpRegex.test(control.value);
    return isValid ? null : { otp: { message: 'OTP must be 4-6 digits' } };
  };
};

export const getErrorMessage = (
  control: AbstractControl,
  fieldName: string
): string => {
  // Only show errors if the control has been touched
  if (!control.touched) {
    return '';
  }
  if (control.hasError('required')) {
    return `${fieldName} is required`;
  }
  if (control.hasError('email')) {
    return (
      control.getError('email')?.message || 'Please enter a valid email address'
    );
  }
  if (control.hasError('phone')) {
    return (
      control.getError('phone')?.message || 'Please enter a valid phone number'
    );
  }
  if (control.hasError('ghanaCard')) {
    return (
      control.getError('ghanaCard')?.message ||
      'Please enter a valid Ghana Card number'
    );
  }
  if (control.hasError('otp')) {
    return control.getError('otp')?.message || 'Please enter a valid OTP';
  }
  return '';
};
