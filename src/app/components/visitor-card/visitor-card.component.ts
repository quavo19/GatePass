import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icons/icons.component';
import { IconName } from '../../constants/icons';
import { LatestCheckIn, LatestCheckOut } from '../../interfaces/api.interface';

@Component({
  selector: 'app-visitor-card',
  imports: [CommonModule, IconComponent],
  standalone: true,
  templateUrl: './visitor-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitorCardComponent {
  protected readonly IconName = IconName;
  public readonly visitor = input.required<LatestCheckIn | LatestCheckOut>();

  protected getCheckOutTime(): string | null {
    const v = this.visitor();
    return v.status === 'checked_out' && 'checkOutTime' in v
      ? v.checkOutTime
      : null;
  }
}
