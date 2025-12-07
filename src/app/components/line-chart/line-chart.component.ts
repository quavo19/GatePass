import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface LineChartData {
  label: string;
  value: number;
}

@Component({
  selector: 'app-line-chart',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './line-chart.component.html',
})
export class LineChartComponent {
  public readonly data = input.required<LineChartData[]>();
  public readonly maxValue = input<number | null>(null);

  protected readonly max = computed(() => {
    const max = this.maxValue();
    if (max !== null) return max;
    const values = this.data().map((d) => d.value);
    return Math.max(...values, 1);
  });

  protected getPointPosition(index: number, value: number): { x: string; y: string } {
    const dataLength = this.data().length;
    const xPercent = dataLength > 1 ? (index / (dataLength - 1)) * 100 : 50;
    const yPercent = 100 - (value / this.max()) * 100;
    return {
      x: `${xPercent}%`,
      y: `${yPercent}%`,
    };
  }

  protected getPathD(): string {
    const points = this.data().map((item, index) => {
      const pos = this.getPointPosition(index, item.value);
      return `${pos.x},${pos.y}`;
    });
    return `M ${points.join(' L ')}`;
  }
}

