import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icons/icons.component';
import { IconName } from '../../constants/icons';
import { CheckInResponse } from '../../interfaces/api.interface';

@Component({
  selector: 'app-receipt',
  imports: [CommonModule, ButtonComponent, IconComponent],
  standalone: true,
  templateUrl: './receipt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceiptComponent {
  protected readonly IconName = IconName;
  public readonly checkInData = input.required<CheckInResponse['data']>();
  public readonly onNewCheckIn = input<() => void>();

  protected handleNewCheckIn(): void {
    const callback = this.onNewCheckIn();
    if (callback) {
      callback();
    }
  }
}
