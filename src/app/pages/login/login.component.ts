import {
  Component,
  signal,
  computed,
  effect,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../../components/button/button.component';
import { InputComponent } from '../../components/input/input.component';
import { emailValidator, getErrorMessage } from '../../utils/validators';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isLoggingIn = signal(false);
  protected readonly isFormInvalid = signal(true);

  protected readonly isButtonDisabled = computed(
    () => this.isLoggingIn() || this.isFormInvalid()
  );

  protected readonly loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, emailValidator()]),
    password: new FormControl('', [Validators.required]),
  });

  constructor() {
    this.loginForm.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.isFormInvalid.set(this.loginForm.invalid);
      });

    this.isFormInvalid.set(this.loginForm.invalid);
  }

  protected get emailControl(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  protected get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  protected getEmailErrorMessage(): string {
    return getErrorMessage(this.emailControl, 'Email');
  }

  protected getPasswordErrorMessage(): string {
    return getErrorMessage(this.passwordControl, 'Password');
  }

  protected onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoggingIn.set(true);
      // Simulate API call
      setTimeout(() => {
        console.log('Login attempt:', this.loginForm.value);
        this.isLoggingIn.set(false);
      }, 2000);
    } else {
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }
}
