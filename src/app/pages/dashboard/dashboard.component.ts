import { Component, signal, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { VisitorService } from '../../services/visitor.service';
import { ToastService } from '../../services/toast.service';
import { IconName } from '../../constants/icons';
import {
  AnalyticsResponse,
  DepartmentVisit,
  MonthlyVisit,
  MostVisitedStaff,
  MostFrequentVisitor,
} from '../../interfaces/api.interface';
import { BarChartComponent } from '../../components/bar-chart/bar-chart.component';
import { TopStaffComponent } from '../../components/top-staff/top-staff.component';
import { TopVisitorsComponent } from '../../components/top-visitors/top-visitors.component';
import { TopDepartmentsComponent } from '../../components/top-departments/top-departments.component';
import { BarChartData } from '../../interfaces/charts.intercae';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    BarChartComponent,
    TopStaffComponent,
    TopVisitorsComponent,
    TopDepartmentsComponent,
  ],
  standalone: true,
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  protected readonly IconName = IconName;
  private readonly destroyRef = inject(DestroyRef);
  private readonly visitorService = inject(VisitorService);
  private readonly toastService = inject(ToastService);

  protected readonly isLoading = signal(false);
  protected readonly departmentVisits = signal<DepartmentVisit[]>([]);
  protected readonly monthlyVisits = signal<MonthlyVisit[]>([]);
  protected readonly mostVisitedStaff = signal<MostVisitedStaff[]>([]);
  protected readonly mostFrequentVisitors = signal<MostFrequentVisitor[]>([]);

  protected readonly monthlyChartData = signal<BarChartData[]>([]);

  ngOnInit(): void {
    this.loadAnalytics();
  }

  private loadAnalytics(): void {
    this.isLoading.set(true);
    this.visitorService
      .getAnalytics()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response.status.code === 200) {
            this.departmentVisits.set(response.data.departmentVisits);
            this.monthlyVisits.set(response.data.monthlyVisits);
            this.mostVisitedStaff.set(response.data.mostVisitedStaff);
            this.mostFrequentVisitors.set(response.data.mostFrequentVisitors);

            this.updateCharts(response.data);
          }
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading analytics:', error);
          this.toastService.error(
            'Failed to Load Analytics',
            error?.error?.message || 'Could not load analytics data'
          );
          this.isLoading.set(false);
        },
      });
  }

  private updateCharts(data: AnalyticsResponse['data']): void {
    this.monthlyChartData.set(
      data.monthlyVisits.map((m) => ({
        label: m.monthName,
        value: m.count,
      }))
    );
  }
}
