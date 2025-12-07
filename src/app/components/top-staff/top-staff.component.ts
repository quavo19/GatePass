import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MostVisitedStaff } from '../../interfaces/api.interface';
import { TOP_CARD_COLORS } from '../../constants/chart-colors';
import { StaffData } from '../../interfaces/dashboard.interface';

@Component({
  selector: 'app-top-staff',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './top-staff.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopStaffComponent {
  public readonly staffData = input.required<MostVisitedStaff[]>();

  public readonly staffColors = TOP_CARD_COLORS;

  protected getProcessedData(): StaffData[] {
    const data = this.staffData();
    if (data.length === 0) return [];

    const maxVisits = Math.max(...data.map((staff) => staff.visitCount), 1);

    return data.map((staff) => ({
      name: staff.name,
      department: staff.department,
      visitCount: staff.visitCount,
      percentage: (staff.visitCount / maxVisits) * 100,
    }));
  }

  protected getBarWidth(percentage: number): number {
    return percentage;
  }

  protected getStaffColor(index: number): string {
    return (
      this.staffColors[index] || this.staffColors[this.staffColors.length - 1]
    );
  }
}
