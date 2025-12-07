import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { IconComponent } from '../icons/icons.component';
import { IconName } from '../../constants/icons';

@Component({
  selector: 'app-toast',
  imports: [CommonModule, IconComponent],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  protected readonly IconName = IconName;
  protected readonly toastService = inject(ToastService);
  protected readonly toasts = this.toastService.getToasts();

  protected removeToast(id: string): void {
    this.toastService.remove(id);
  }
}
