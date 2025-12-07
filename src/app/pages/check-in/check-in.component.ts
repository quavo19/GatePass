import {
  Component,
  signal,
  computed,
  DestroyRef,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';
import { InputComponent } from '../../components/input/input.component';
import {
  SelectComponent,
  SelectOption,
} from '../../components/select/select.component';
import { IconComponent } from '../../components/icons/icons.component';
import { VisitorCardComponent } from '../../components/visitor-card/visitor-card.component';
import { ReceiptComponent } from '../../components/receipt/receipt.component';
import { IconName } from '../../constants/icons';
import {
  phoneValidator,
  ghanaCardValidator,
  otpValidator,
  getErrorMessage,
} from '../../utils/validators';
import { VisitorService } from '../../services/visitor.service';
import { ToastService } from '../../services/toast.service';
import { VISIT_PURPOSES } from '../../constants/visitors';
import {
  CheckInResponse,
  StaffMember,
  LatestCheckIn,
} from '../../interfaces/api.interface';
import { CheckInStep, FormStep } from '../../types/check-in.types';

@Component({
  selector: 'app-check-in',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    IconComponent,
    VisitorCardComponent,
    ReceiptComponent,
  ],
  templateUrl: './check-in.component.html',
})
export class CheckInComponent {
  protected readonly IconName = IconName;
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly visitorService = inject(VisitorService);
  private readonly toastService = inject(ToastService);

  private readonly STORAGE_KEY = 'checkInFormData';

  protected readonly currentStep = signal<CheckInStep>('form');
  protected readonly currentFormStep = signal<FormStep>(1);
  protected readonly isRequestingOtp = signal(false);
  protected readonly isVerifyingOtp = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly otpSent = signal(false);
  protected readonly otpVerified = signal(false);
  protected readonly checkInData = signal<CheckInResponse['data'] | null>(null);

  protected readonly isFormInvalid = signal(true);
  protected readonly isOtpStepInvalid = signal(true);
  protected readonly recentVisitors = signal<LatestCheckIn[]>([]);
  protected readonly isLoadingRecentVisitors = signal(true);

  protected readonly checkInForm = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, phoneValidator()]),
    otp: new FormControl('', [Validators.required, otpValidator()]),
    ghanaCardNumber: new FormControl('', [
      Validators.required,
      ghanaCardValidator(),
    ]),
    staffMemberId: new FormControl('', [Validators.required]),
    purpose: new FormControl('', [Validators.required]),
  });

  protected readonly formChangeTrigger = signal(0);

  protected readonly isRequestOtpDisabled = computed(() => {
    this.formChangeTrigger();
    const fullName = this.fullNameControl.value;
    const phone = this.phoneControl.value;
    return this.isRequestingOtp() || !fullName || !phone;
  });

  protected readonly isVerifyOtpDisabled = computed(() => {
    this.formChangeTrigger();
    return (
      this.isVerifyingOtp() || !this.otpControl.valid || !this.otpControl.value
    );
  });

  protected readonly isSubmitDisabled = computed(
    () => this.isSubmitting() || this.isFormInvalid() || !this.otpVerified()
  );

  protected readonly canGoToStep2 = computed(() => {
    this.formChangeTrigger();
    const otpVerified = this.otpVerified();
    const fullNameValid = this.fullNameControl.valid;
    const phoneValid = this.phoneControl.valid;
    return fullNameValid && phoneValid && otpVerified;
  });

  protected readonly canGoToStep3 = computed(() => {
    this.formChangeTrigger();
    return this.ghanaCardControl.valid;
  });

  protected readonly canSubmit = computed(() => {
    this.formChangeTrigger();
    return this.staffMemberIdControl.valid && this.purposeControl.valid;
  });

  protected readonly progressPercentage = computed(() => {
    if (this.currentFormStep() === 1) return 33;
    if (this.currentFormStep() === 2) return 66;
    return 100;
  });

  protected readonly staffMembers = signal<StaffMember[]>([]);
  protected readonly staffOptions = computed<SelectOption[]>(() => {
    return this.staffMembers().map((staff) => ({
      value: staff.id,
      label: `${staff.name} - ${staff.department}`,
    }));
  });

  protected getStaffMemberName(id: string | number | null | undefined): string {
    if (!id) return '';
    const staff = this.staffMembers().find((s) => s.id === Number(id));
    return staff ? `${staff.name} - ${staff.department}` : String(id);
  }

  protected readonly purposeOptions: SelectOption[] = VISIT_PURPOSES.map(
    (purpose) => ({
      value: purpose,
      label: purpose,
    })
  );

  constructor() {
    this.loadStaffMembers();

    this.loadLatestCheckIns();

    this.restoreFormData();

    const initialParams = this.route.snapshot.queryParams;
    const step = initialParams['step'];
    if (step && ['1', '2', '3'].includes(step)) {
      const stepNum = Number(step) as FormStep;
      this.currentFormStep.set(stepNum);
      this.enableFieldsForStep(stepNum);
    } else {
      this.currentFormStep.set(1);
      this.updateUrlStep(1);
    }

    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const stepParam = params['step'];
        if (stepParam && ['1', '2', '3'].includes(stepParam)) {
          const stepNum = Number(stepParam) as FormStep;
          this.currentFormStep.set(stepNum);
          this.enableFieldsForStep(stepNum);
          this.formChangeTrigger.update((v) => v + 1);
          this.cdr.detectChanges();
        } else if (!stepParam && this.currentFormStep() !== 1) {
          this.currentFormStep.set(1);
          this.enableFieldsForStep(1);
          this.formChangeTrigger.update((v) => v + 1);
          this.cdr.detectChanges();
        }
      });

    this.checkInForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.formChangeTrigger.update((v) => v + 1);
        this.saveFormData();
      });

    this.checkInForm.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.isFormInvalid.set(this.checkInForm.invalid);
        this.formChangeTrigger.update((v) => v + 1);
      });

    this.otpControl.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.isOtpStepInvalid.set(this.otpControl.invalid);
      });

    this.isFormInvalid.set(this.checkInForm.invalid);
    this.isOtpStepInvalid.set(this.otpControl.invalid);

    this.otpControl.disable();
    this.ghanaCardControl.disable();
    this.staffMemberIdControl.disable();
    this.purposeControl.disable();
  }

  private saveFormData(): void {
    try {
      const formData = {
        fullName: this.fullNameControl.value || '',
        phone: this.phoneControl.value || '',
        otp: this.otpControl.value || '',
        ghanaCardNumber: this.ghanaCardControl.value || '',
        staffMemberId: this.staffMemberIdControl.value || '',
        purpose: this.purposeControl.value || '',
        otpSent: this.otpSent(),
        otpVerified: this.otpVerified(),
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(formData));
    } catch (error) {
      console.error('Error saving form data to localStorage:', error);
    }
  }

  private restoreFormData(): void {
    try {
      const savedData = localStorage.getItem(this.STORAGE_KEY);
      if (savedData) {
        const formData = JSON.parse(savedData);

        if (formData.fullName) this.fullNameControl.setValue(formData.fullName);
        if (formData.phone) this.phoneControl.setValue(formData.phone);
        if (formData.otp) this.otpControl.setValue(formData.otp);
        if (formData.ghanaCardNumber)
          this.ghanaCardControl.setValue(formData.ghanaCardNumber);
        if (formData.staffMemberId)
          this.staffMemberIdControl.setValue(formData.staffMemberId);
        if (formData.purpose) this.purposeControl.setValue(formData.purpose);

        if (formData.otpSent) {
          this.otpSent.set(true);
          this.otpControl.enable();
        }
        if (formData.otpVerified) {
          this.otpVerified.set(true);
          this.ghanaCardControl.enable();
          this.staffMemberIdControl.enable();
          this.purposeControl.enable();
        }
      }
    } catch (error) {
      console.error('Error restoring form data from localStorage:', error);
    }
  }

  private updateUrlStep(step: FormStep): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { step: step.toString() },
      queryParamsHandling: 'merge',
      replaceUrl: false,
    });
  }

  private enableFieldsForStep(step: FormStep): void {
    if (step >= 1) {
    }
    if (step >= 2 && this.otpVerified()) {
      this.ghanaCardControl.enable();
    }
    if (step >= 3 && this.otpVerified()) {
      this.staffMemberIdControl.enable();
      this.purposeControl.enable();
    }
  }

  protected get fullNameControl(): FormControl {
    return this.checkInForm.get('fullName') as FormControl;
  }

  protected get phoneControl(): FormControl {
    return this.checkInForm.get('phone') as FormControl;
  }

  protected get otpControl(): FormControl {
    return this.checkInForm.get('otp') as FormControl;
  }

  protected get ghanaCardControl(): FormControl {
    return this.checkInForm.get('ghanaCardNumber') as FormControl;
  }

  protected get staffMemberIdControl(): FormControl {
    return this.checkInForm.get('staffMemberId') as FormControl;
  }

  protected get purposeControl(): FormControl {
    return this.checkInForm.get('purpose') as FormControl;
  }

  protected getFullNameErrorMessage(): string {
    return getErrorMessage(this.fullNameControl, 'Full Name');
  }

  protected getPhoneErrorMessage(): string {
    return getErrorMessage(this.phoneControl, 'Phone Number');
  }

  protected getOtpErrorMessage(): string {
    return getErrorMessage(this.otpControl, 'OTP');
  }

  protected getGhanaCardErrorMessage(): string {
    return getErrorMessage(this.ghanaCardControl, 'Ghana Card Number');
  }

  protected getStaffMemberErrorMessage(): string {
    return getErrorMessage(this.staffMemberIdControl, 'Staff Member');
  }

  protected getPurposeErrorMessage(): string {
    return getErrorMessage(this.purposeControl, 'Purpose of Visit');
  }

  protected onRequestOtp(): void {
    if (this.phoneControl.valid && this.phoneControl.value) {
      this.isRequestingOtp.set(true);
      this.visitorService
        .requestOtp({ phone: this.phoneControl.value })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            if (response.status.code === 200) {
              this.otpSent.set(true);
              this.otpControl.enable();
              this.toastService.success('OTP Sent', response.data.message);
            }
            this.isRequestingOtp.set(false);
          },
          error: (error) => {
            this.toastService.error(
              'OTP Request Failed',
              error?.error?.message || 'Failed to send OTP'
            );
            this.isRequestingOtp.set(false);
          },
        });
    } else {
      this.phoneControl.markAsTouched();
    }
  }

  protected onVerifyOtp(): void {
    if (
      this.otpControl.valid &&
      this.otpControl.value &&
      this.phoneControl.value
    ) {
      this.isVerifyingOtp.set(true);
      this.visitorService
        .verifyOtp({
          phone: this.phoneControl.value,
          otp: this.otpControl.value,
        })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            if (response.status.code === 200 && response.data.verified) {
              this.otpVerified.set(true);
              this.ghanaCardControl.enable();
              this.staffMemberIdControl.enable();
              this.purposeControl.enable();
              // Update formChangeTrigger to ensure computed signals recompute
              // This triggers recomputation of canGoToStep2 which reads otpVerified
              this.formChangeTrigger.update((v) => v + 1);
              this.toastService.success(
                'OTP Verified',
                'OTP verified successfully. Please continue with the form.'
              );
              // Auto-advance to next step after OTP verification
              // Update URL immediately - URL is source of truth, step will sync from URL
              if (this.currentFormStep() === 1 && this.otpVerified()) {
                this.updateUrlStep(2);
              }
            } else {
              this.toastService.error(
                'OTP Verification Failed',
                response.status.message || 'Invalid OTP'
              );
            }
            this.isVerifyingOtp.set(false);
          },
          error: (error) => {
            this.toastService.error(
              'OTP Verification Failed',
              error?.error?.message || 'Failed to verify OTP'
            );
            this.isVerifyingOtp.set(false);
          },
        });
    } else {
      this.otpControl.markAsTouched();
    }
  }

  protected onResetOtp(): void {
    // Reset OTP-related fields and state
    this.otpControl.reset();
    this.otpControl.disable();
    this.otpSent.set(false);
    this.otpVerified.set(false);
    // Clear phone field to allow new entry
    this.phoneControl.reset();
    this.phoneControl.enable();
    // Disable subsequent fields
    this.ghanaCardControl.disable();
    this.staffMemberIdControl.disable();
    this.purposeControl.disable();
  }

  protected nextStep(): void {
    if (this.currentFormStep() === 1) {
      if (this.otpVerified()) {
        this.updateUrlStep(2);
      }
    } else if (this.currentFormStep() === 2 && this.canGoToStep3()) {
      this.updateUrlStep(3);
      if (this.staffMemberIdControl.value) {
        this.staffMemberIdControl.markAsTouched();
      }
      if (this.purposeControl.value) {
        this.purposeControl.markAsTouched();
      }
    }
  }

  protected previousStep(): void {
    if (this.currentFormStep() === 3) {
      // Update URL - URL is source of truth, step will sync from URL via subscription
      this.updateUrlStep(2);
    } else if (this.currentFormStep() === 2) {
      // Update URL - URL is source of truth, step will sync from URL via subscription
      this.updateUrlStep(1);
    }
  }

  protected onSubmit(): void {
    if (this.checkInForm.valid && this.otpVerified()) {
      this.isSubmitting.set(true);
      const formValue = this.checkInForm.getRawValue();

      this.visitorService
        .checkIn({
          fullName: formValue.fullName || '',
          phone: formValue.phone || '',
          ghanaCardNumber: formValue.ghanaCardNumber || '',
          staffMemberId: formValue.staffMemberId || '',
          purpose: formValue.purpose || '',
        })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            if (response.status.code === 200) {
              this.checkInData.set(response.data);
              this.currentStep.set('confirmation');

              const newCheckIn: LatestCheckIn = {
                id: response.data.ticketNumber,
                fullName: response.data.visitor.fullName,
                phone: response.data.visitor.phone,
                staffMember: response.data.visitor.staffMember,
                purpose: response.data.visitor.purpose,
                ticketNumber: response.data.ticketNumber,
                checkInTime: response.data.visitor.checkInTime,
                status: response.data.visitor.status,
              };

              this.recentVisitors.update((visitors) => [
                newCheckIn,
                ...visitors,
              ]);

              localStorage.removeItem(this.STORAGE_KEY);
              this.router.navigate([], {
                relativeTo: this.route,
                queryParams: {},
                queryParamsHandling: 'merge',
              });
              this.toastService.success(
                'Check-In Successful',
                `Ticket Number: ${response.data.ticketNumber}`
              );
            }
            this.isSubmitting.set(false);
          },
          error: (error) => {
            this.toastService.error(
              'Check-In Failed',
              error?.error?.message || 'Failed to complete check-in'
            );
            this.isSubmitting.set(false);
          },
        });
    } else {
      Object.keys(this.checkInForm.controls).forEach((key) => {
        this.checkInForm.get(key)?.markAsTouched();
      });
    }
  }

  protected onClearForm(): void {
    // Clear form and localStorage
    this.checkInForm.reset();
    this.otpSent.set(false);
    this.otpVerified.set(false);
    this.checkInData.set(null);
    this.currentStep.set('form');
    this.currentFormStep.set(1);
    this.updateUrlStep(1);
    localStorage.removeItem(this.STORAGE_KEY);
    this.otpControl.disable();
    this.ghanaCardControl.disable();
    this.staffMemberIdControl.disable();
    this.purposeControl.disable();
    this.toastService.success(
      'Form Cleared',
      'All form data has been cleared.'
    );
  }

  protected onNewCheckIn(): void {
    this.checkInForm.reset();
    this.otpSent.set(false);
    this.otpVerified.set(false);
    this.checkInData.set(null);
    this.currentStep.set('form');
    this.currentFormStep.set(1);
    this.updateUrlStep(1);
    // Clear localStorage
    localStorage.removeItem(this.STORAGE_KEY);
    this.otpControl.disable();
    this.ghanaCardControl.disable();
    this.staffMemberIdControl.disable();
    this.purposeControl.disable();
  }

  private loadStaffMembers(): void {
    this.visitorService
      .getStaffMembers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response.status.code === 200) {
            this.staffMembers.set(response.data);
          }
        },
        error: (error) => {
          console.error('Error loading staff members:', error);
          this.toastService.error(
            'Failed to Load Staff Members',
            error?.error?.message || 'Could not load staff members'
          );
        },
      });
  }

  private loadLatestCheckIns(): void {
    this.isLoadingRecentVisitors.set(true);
    this.visitorService
      .getLatestCheckIns(5)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response.status.code === 200) {
            this.recentVisitors.set(response.data);
          }
          this.isLoadingRecentVisitors.set(false);
        },
        error: (error) => {
          console.error('Error loading latest check-ins:', error);
          this.isLoadingRecentVisitors.set(false);
        },
      });
  }
}
