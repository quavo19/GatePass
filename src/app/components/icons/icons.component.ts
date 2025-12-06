import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconName, IconNameType } from '../../constants/icons';

@Component({
  selector: 'app-icon',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './icons.component.html',
})
export class IconComponent {
  protected readonly iconNames = IconName;
  public readonly name = input.required<IconNameType>();
  public readonly className = input<string>('w-5 h-5');
}
