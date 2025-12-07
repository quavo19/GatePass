import { Component, signal, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../components/button/button.component';
import { InputComponent } from '../../components/input/input.component';
import { IconComponent } from '../../components/icons/icons.component';
import { VisitorCardComponent } from '../../components/visitor-card/visitor-card.component';
import { IconName } from '../../constants/icons';
import { VisitorService } from '../../services/visitor.service';
import { ToastService } from '../../services/toast.service';
import { ticketNumberValidator } from '../../utils/validators';
import {
  VisitorByTicketResponse,
  VisitorByTicketData,
  CheckOutResponse,
  LatestCheckOut,
} from '../../interfaces/api.interface';

type CheckOutStep = 'search' | 'details' | 'confirmation';

@Component({
  selector: 'app-check-out',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    IconComponent,
    VisitorCardComponent,
  ],
  standalone: true,
  templateUrl: './check-out.component.html',
})
export class CheckOutComponent {
  protected readonly IconName = IconName;
  private readonly destroyRef = inject(DestroyRef);
  private readonly visitorService = inject(VisitorService);
  private readonly toastService = inject(ToastService);

  protected readonly currentStep = signal<CheckOutStep>('search');
  protected readonly isSearching = signal(false);
  protected readonly isCheckingOut = signal(false);
  protected readonly visitorData = signal<VisitorByTicketData | null>(null);
  protected readonly checkOutData = signal<CheckOutResponse['data'] | null>(
    null
  );
  protected readonly recentCheckOuts = signal<LatestCheckOut[]>([]);
  protected readonly isLoadingRecentCheckOuts = signal(true);

  protected readonly checkoutForm = new FormGroup({
    ticketNumber: new FormControl('', [
      Validators.required,
      ticketNumberValidator(),
    ]),
  });

  constructor() {
    this.loadLatestCheckOuts();
  }

  protected get ticketNumberControl(): FormControl {
    return this.checkoutForm.get('ticketNumber') as FormControl;
  }

  protected getTicketNumberErrorMessage(): string {
    if (!this.ticketNumberControl.touched) {
      return '';
    }
    if (this.ticketNumberControl.hasError('required')) {
      return 'Ticket Number is required';
    }
    if (this.ticketNumberControl.hasError('ticketNumber')) {
      return (
        this.ticketNumberControl.getError('ticketNumber')?.message ||
        'Please enter a valid ticket number'
      );
    }
    return '';
  }

  protected onSearch(): void {
    if (this.ticketNumberControl.valid && this.ticketNumberControl.value) {
      this.isSearching.set(true);
      this.visitorService
        .getVisitorByTicketNumber(this.ticketNumberControl.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            if (response.status.code === 200 && response.data.length > 0) {
              const visitor = response.data[0];
              if (visitor.status === 'checked_out') {
                this.toastService.error(
                  'Already Checked Out',
                  'This visitor has already been checked out.'
                );
                this.visitorData.set(null);
              } else {
                this.visitorData.set(visitor);
                this.currentStep.set('details');
              }
            } else {
              this.toastService.error(
                'Visitor Not Found',
                'No visitor found with this ticket number'
              );
              this.visitorData.set(null);
            }
            this.isSearching.set(false);
          },
          error: (error) => {
            this.toastService.error(
              'Visitor Not Found',
              error?.error?.message ||
                'Could not find visitor with this ticket number'
            );
            this.visitorData.set(null);
            this.isSearching.set(false);
          },
        });
    } else {
      this.ticketNumberControl.markAsTouched();
    }
  }

  protected onCheckOut(): void {
    if (this.visitorData() && this.ticketNumberControl.value) {
      this.isCheckingOut.set(true);
      this.visitorService
        .checkOut({
          ticketNumber: this.ticketNumberControl.value,
        })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            if (response.status.code === 200) {
              this.checkOutData.set(response.data);
              this.currentStep.set('confirmation');

              const newCheckOut: LatestCheckOut = {
                id: response.data.ticketNumber,
                fullName: response.data.visitor.fullName,
                phone: response.data.visitor.phone,
                staffMember: response.data.visitor.staffMember,
                purpose: response.data.visitor.purpose,
                ticketNumber: response.data.ticketNumber,
                checkInTime: response.data.visitor.checkInTime,
                checkOutTime: response.data.visitor.checkOutTime,
                status: 'checked_out',
              };

              this.recentCheckOuts.update((checkOuts) => [
                newCheckOut,
                ...checkOuts,
              ]);

              this.checkoutForm.reset();
              this.visitorData.set(null);
              this.toastService.success(
                'Check-Out Successful',
                `Visitor ${response.data.visitor.fullName} has been checked out.`
              );
            }
            this.isCheckingOut.set(false);
          },
          error: (error) => {
            this.toastService.error(
              'Check-Out Failed',
              error?.error?.status?.message || 'Failed to complete check-out'
            );
            this.isCheckingOut.set(false);
          },
        });
    }
  }

  protected onNewCheckOut(): void {
    this.checkoutForm.reset();
    this.visitorData.set(null);
    this.checkOutData.set(null);
    this.currentStep.set('search');
  }

  private loadLatestCheckOuts(): void {
    this.isLoadingRecentCheckOuts.set(true);
    this.visitorService
      .getLatestCheckOuts(5)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response.status.code === 200) {
            this.recentCheckOuts.set(response.data);
          }
          this.isLoadingRecentCheckOuts.set(false);
        },
        error: (error) => {
          console.error('Error loading latest check-outs:', error);
          this.isLoadingRecentCheckOuts.set(false);
        },
      });
  }
}
