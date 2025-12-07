import { Component, inject, signal, DestroyRef } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastComponent } from './components/toast/toast.component';
import { LoadingComponent } from './components/loading/loading.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LoadingService } from './services/loading.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ToastComponent,
    LoadingComponent,
    SidebarComponent,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected readonly loadingService = inject(LoadingService);
  protected readonly isLoading = this.loadingService.getLoadingState();
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly showSidebar = signal(false);

  constructor() {
    // Check initial route
    this.updateSidebarVisibility(this.router.url);

    // Update on route changes
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.updateSidebarVisibility(event.urlAfterRedirects);
        }
      });
  }

  private updateSidebarVisibility(url: string): void {
    this.showSidebar.set(url !== '/login' && !url.startsWith('/login'));
  }
}
