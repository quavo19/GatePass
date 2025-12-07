import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BarChartData {
  label: string;
  value: number;
}

@Component({
  selector: 'app-bar-chart',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './bar-chart.component.html',
})
export class BarChartComponent {
  public readonly data = input.required<BarChartData[]>();
  public readonly maxValue = input<number | null>(null);
  public readonly vertical = input<boolean>(false);

  protected get max(): number {
    const max = this.maxValue();
    if (max !== null) return max;
    const values = this.data().map((d) => d.value);
    return Math.max(...values, 1);
  }

  protected getBarHeight(value: number): string {
    return `${(value / this.max) * 100}%`;
  }

  protected getBarWidth(value: number): string {
    return `${(value / this.max) * 100}%`;
  }
}

