import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  public readonly size = input<'sm' | 'md'>('md');
  public readonly type = input<string>('button');
  public readonly loading = input<boolean>(false);
  public readonly disabled = input<boolean>(false);
  public readonly variant = input<'primary' | 'secondary'>('primary');
  public readonly className = input<string>('');
}
