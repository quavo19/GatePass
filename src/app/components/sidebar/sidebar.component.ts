import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NAVIGATION_ITEMS } from '../../constants/navigation';
import { IconComponent } from '../icons/icons.component';
import { IconName } from '../../constants/icons';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, IconComponent],
  standalone: true,
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly navigationItems = NAVIGATION_ITEMS;
  protected readonly IconName = IconName;
  protected readonly isLoggingOut = signal(false);
  protected readonly currentUser = this.authService.getCurrentUserSignal();

  protected getVisibleItems() {
    const user = this.currentUser();
    if (!user) return [];
    return this.navigationItems.filter((item) =>
      item.roles.includes(user.role)
    );
  }

  protected logout(): void {
    if (this.isLoggingOut()) return;

    this.isLoggingOut.set(true);
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        // Even if logout fails, redirect anyway (state already cleared in service)
        this.router.navigate(['/login']);
        this.isLoggingOut.set(false);
      },
    });
  }
}
