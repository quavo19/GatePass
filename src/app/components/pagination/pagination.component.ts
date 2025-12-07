import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icons/icons.component';
import { IconName } from '../../constants/icons';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule, IconComponent],
  standalone: true,
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  protected readonly IconName = IconName;
  public readonly currentPage = input.required<number>();
  public readonly totalPages = input.required<number>();
  public readonly totalCount = input<number>(0);
  public readonly perPage = input<number>(10);

  public readonly pageChange = output<number>();

  protected get pages(): number[] {
    return this.computePages();
  }

  private computePages(): number[] {
    const current = this.currentPage();
    const total = this.totalPages();
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push(-1);
        pages.push(total);
      } else if (current >= total - 2) {
        pages.push(1);
        pages.push(-1);
        for (let i = total - 4; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push(-1);
        pages.push(total);
      }
    }

    return pages;
  }

  protected onPageClick(page: number): void {
    if (page > 0 && page !== this.currentPage() && page <= this.totalPages()) {
      this.pageChange.emit(page);
    }
  }

  protected onPrevious(): void {
    if (this.currentPage() > 1) {
      this.pageChange.emit(this.currentPage() - 1);
    }
  }

  protected onNext(): void {
    if (this.currentPage() < this.totalPages()) {
      this.pageChange.emit(this.currentPage() + 1);
    }
  }

  protected get startItem(): number {
    return (this.currentPage() - 1) * this.perPage() + 1;
  }

  protected get endItem(): number {
    const end = this.currentPage() * this.perPage();
    return Math.min(end, this.totalCount());
  }
}
