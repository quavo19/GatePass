import {
  Component,
  signal,
  computed,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { VisitorService } from '../../services/visitor.service';
import { ToastService } from '../../services/toast.service';
import {
  VisitorLog,
  VisitorLogsResponse,
  TimePeriod,
} from '../../interfaces/api.interface';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { InputComponent } from '../../components/input/input.component';
import {
  SelectComponent,
  SelectOption,
} from '../../components/select/select.component';
import { IconComponent } from '../../components/icons/icons.component';
import { IconName } from '../../constants/icons';

@Component({
  selector: 'app-visitors',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PaginationComponent,
    InputComponent,
    SelectComponent,
    IconComponent,
    DatePipe,
  ],
  standalone: true,
  templateUrl: './visitors.component.html',
})
export class VisitorsComponent implements OnInit {
  protected readonly IconName = IconName;
  private readonly destroyRef = inject(DestroyRef);
  private readonly visitorService = inject(VisitorService);
  private readonly toastService = inject(ToastService);

  protected readonly visitors = signal<VisitorLog[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly currentPage = signal(1);
  protected readonly totalPages = signal(1);
  protected readonly totalCount = signal(0);
  protected readonly perPage = signal(10);

  protected readonly searchForm = new FormGroup({
    ticketNumber: new FormControl(''),
    timePeriod: new FormControl<TimePeriod | ''>(''),
  });

  protected readonly timePeriodOptions: SelectOption[] = [
    { value: '', label: 'All Time' },
    { value: TimePeriod.TODAY, label: 'Today' },
    { value: TimePeriod.THIS_WEEK, label: 'This Week' },
    { value: TimePeriod.THIS_MONTH, label: 'This Month' },
    { value: TimePeriod.THIS_YEAR, label: 'This Year' },
  ];

  ngOnInit(): void {
    this.loadVisitorLogs();

    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.currentPage.set(1);
        this.loadVisitorLogs();
      });
  }

  protected get ticketNumberControl(): FormControl {
    return this.searchForm.get('ticketNumber') as FormControl;
  }

  protected get timePeriodControl(): FormControl {
    return this.searchForm.get('timePeriod') as FormControl;
  }

  protected onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadVisitorLogs();
  }

  private loadVisitorLogs(): void {
    this.isLoading.set(true);
    const formValue = this.searchForm.value;
    const ticketNumber = formValue.ticketNumber || undefined;
    const timePeriod = formValue.timePeriod || undefined;

    this.visitorService
      .getVisitorLogs(
        this.currentPage(),
        ticketNumber,
        timePeriod as TimePeriod | undefined
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response.status.code === 200) {
            this.visitors.set(response.data);
            this.totalPages.set(response.pagination.totalPages);
            this.totalCount.set(response.pagination.totalCount);
            this.perPage.set(response.pagination.perPage);
          }
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading visitor logs:', error);
          this.toastService.error(
            'Failed to Load Logs',
            error?.error?.message || 'Could not load visitor logs'
          );
          this.isLoading.set(false);
        },
      });
  }

  protected getStatusLabel(status: string): string {
    return status === 'checked_in' ? 'Checked In' : 'Checked Out';
  }
}
