import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MostFrequentVisitor } from '../../interfaces/api.interface';
import { TOP_CARD_COLORS } from '../../constants/chart-colors';
import { VisitorData } from '../../interfaces/dashboard.interface';

@Component({
  selector: 'app-top-visitors',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './top-visitors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopVisitorsComponent {
  public readonly visitorData = input.required<MostFrequentVisitor[]>();

  public readonly visitorColors = TOP_CARD_COLORS;

  protected getProcessedData(): VisitorData[] {
    const data = this.visitorData();
    if (data.length === 0) return [];

    const maxVisits = Math.max(...data.map((visitor) => visitor.visitCount), 1);

    return data.map((visitor) => ({
      fullName: visitor.fullName,
      phone: visitor.phone,
      visitCount: visitor.visitCount,
      percentage: (visitor.visitCount / maxVisits) * 100,
    }));
  }

  protected getBarWidth(percentage: number): number {
    return percentage;
  }

  protected getVisitorColor(index: number): string {
    return (
      this.visitorColors[index] ||
      this.visitorColors[this.visitorColors.length - 1]
    );
  }
}
