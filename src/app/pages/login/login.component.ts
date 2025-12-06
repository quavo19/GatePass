import { Component, signal, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';
import { InputComponent } from '../../components/input/input.component';
import { IconComponent } from '../../components/icons/icons.component';
import { IconName } from '../../constants/icons';
import { emailValidator, getErrorMessage } from '../../utils/validators';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../interfaces/api.interface';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    IconComponent,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  protected readonly IconName = IconName;
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

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
      const credentials: LoginRequest = {
        user: {
          email: this.loginForm.value.email || '',
          password: this.loginForm.value.password || '',
        },
      };

      this.authService
        .login(credentials)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            if (response.status.code === 200) {
              this.toastService.success(
                'Login Successful',
                response.status.message
              );
              // Navigate to check-in page after successful login
              this.router.navigate(['/check-in']);
            }
            this.isLoggingIn.set(false);
          },
          error: (error) => {
            this.toastService.error('Login Failed', error?.error?.message);
            this.isLoggingIn.set(false);
          },
        });
    } else {
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }
}
