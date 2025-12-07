import {
  Component,
  inject,
  signal,
  computed,
  HostListener,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NAVIGATION_ITEMS } from '../../constants/navigation';
import { IconComponent } from '../icons/icons.component';
import { IconName } from '../../constants/icons';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly navigationItems = NAVIGATION_ITEMS;
  protected readonly IconName = IconName;
  protected readonly isLoggingOut = signal(false);
  protected readonly currentUser = this.authService.getCurrentUserSignal();

  private readonly windowWidth = signal(window.innerWidth);
  protected readonly isMobile = computed(() => this.windowWidth() < 768);
  protected readonly isOpen = signal(false);

  @HostListener('window:resize')
  onResize() {
    this.windowWidth.set(window.innerWidth);
    if (!this.isMobile()) this.isOpen.set(false);
  }

  protected getVisibleItems() {
    const user = this.currentUser();
    if (!user) return [];
    return this.navigationItems.filter((item) =>
      item.roles.includes(user.role)
    );
  }

  toggle() {
    if (this.isMobile()) this.isOpen.update((v) => !v);
  }

  close() {
    this.isOpen.set(false);
  }

  onNavClick() {
    if (this.isMobile()) this.close();
  }

  protected logout(): void {
    if (this.isLoggingOut()) return;
    this.isLoggingOut.set(true);
    this.authService.logout().subscribe({
      next: () => {
        this.close();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.close();
        this.router.navigate(['/login']);
        this.isLoggingOut.set(false);
      },
    });
  }
}
