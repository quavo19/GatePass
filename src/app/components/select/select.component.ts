import { CommonModule } from '@angular/common';
import {
  Component,
  input,
  output,
  effect,
  signal,
  HostListener,
  DestroyRef,
  inject,
  computed,
  Signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from '../icons/icons.component';
import { IconName } from '../../constants/icons';

export interface SelectOption {
  value: string | number;
  label: string;
}

@Component({
  selector: 'app-select',
  imports: [ReactiveFormsModule, CommonModule, IconComponent],
  standalone: true,
  templateUrl: './select.component.html',
})
export class SelectComponent {
  protected readonly IconName = IconName;
  public readonly label = input<string>();
  public readonly className = input<string>('');
  public readonly placeholder = input<string>('Select an option');
  public readonly control = input.required<FormControl>();
  public readonly errorMessage = input<string>('');
  public readonly required = input<boolean>(false);
  public readonly isDisabled = input<boolean>(false);
  public readonly id = input.required<string>();
  public readonly options = input.required<SelectOption[] | Signal<SelectOption[]>>();
  public readonly size = input<'sm' | 'md' | 'lg' | 'xl'>('md');

  protected readonly resolvedOptions = computed<SelectOption[]>(() => {
    const opts = this.options();
    return typeof opts === 'function' ? opts() : opts;
  });

  public readonly inputBlur = output<FocusEvent>();

  protected readonly isOpen = signal(false);
  protected readonly selectedOption = signal<SelectOption | null>(null);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      const control = this.control();
      const disabled = this.isDisabled();
      if (control) {
        if (disabled && !control.disabled) {
          control.disable({ emitEvent: false });
        } else if (!disabled && control.disabled) {
          control.enable({ emitEvent: false });
        }
      }
    });

    // Watch control value changes to update selected option
    effect(() => {
      const control = this.control();
      const options = this.resolvedOptions();

      if (control && options.length > 0) {
        this.updateSelectedOption(control, options);

        // Subscribe to value changes - takeUntilDestroyed handles cleanup
        control.valueChanges
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.updateSelectedOption(control, options);
          });
      }
    });
  }

  private updateSelectedOption(
    control: FormControl,
    options: SelectOption[]
  ): void {
    const value = control.value;
    if (value !== null && value !== undefined && value !== '') {
      const option = options.find((opt) => opt.value === value);
      this.selectedOption.set(option || null);
    } else {
      this.selectedOption.set(null);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest(`#select-${this.id()}`)) {
      this.isOpen.set(false);
    }
  }

  public sizeClasses(): string {
    const size = this.size();
    if (size === 'sm') return 'h-10 text-sm px-3';
    if (size === 'lg') return 'h-14 text-lg px-4';
    if (size === 'xl') return 'h-16 text-lg px-4';
    return 'h-12 text-base px-3';
  }

  public combinedClasses(): string {
    const base = `flex items-center w-full rounded-xl bg-white border text-gray-700 outline-none cursor-pointer ${this.sizeClasses()}`;
    const borderClass = this.isDisabled()
      ? 'border-gray-200'
      : this.errorMessage()
      ? 'border-red-400'
      : 'border-gray-300';
    const disabledClass = this.isDisabled()
      ? 'bg-gray-100 cursor-not-allowed opacity-50'
      : 'bg-white';
    return `${base} ${borderClass} ${disabledClass}`.trim();
  }

  protected toggleDropdown(): void {
    if (!this.isDisabled()) {
      this.isOpen.update((value) => !value);
    }
  }

  protected selectOption(option: SelectOption): void {
    if (!this.isDisabled()) {
      this.control().setValue(option.value);
      this.selectedOption.set(option);
      this.isOpen.set(false);
      this.control().markAsTouched();
    }
  }

  protected getDisplayText(): string {
    if (this.selectedOption()) {
      return this.selectedOption()!.label;
    }
    return this.placeholder();
  }
}
