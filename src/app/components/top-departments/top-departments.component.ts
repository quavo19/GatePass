import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentVisit } from '../../interfaces/api.interface';
import { TOP_CARD_COLORS } from '../../constants/chart-colors';

interface DepartmentData {
  readonly department: string;
  readonly count: number;
  readonly percentage: number;
}

@Component({
  selector: 'app-top-departments',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './top-departments.component.html',
})
export class TopDepartmentsComponent {
  public readonly departmentData = input.required<DepartmentVisit[]>();

  public readonly departmentColors = TOP_CARD_COLORS;

  protected getProcessedData(): DepartmentData[] {
    const data = this.departmentData();
    if (data.length === 0) return [];

    const maxCount = Math.max(...data.map((dept) => dept.count), 1);

    return data.map((dept) => ({
      department: dept.department,
      count: dept.count,
      percentage: (dept.count / maxCount) * 100,
    }));
  }

  protected getBarWidth(percentage: number): number {
    return percentage;
  }

  protected getDepartmentColor(index: number): string {
    return (
      this.departmentColors[index] ||
      this.departmentColors[this.departmentColors.length - 1]
    );
  }
}
