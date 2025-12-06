import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';
import { map, catchError, of, tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const loadingService = inject(LoadingService);

  if (authService.isAuthenticated()) {
    return true;
  }

  loadingService.show();
  return authService.initializeUser().pipe(
    tap(() => {
      loadingService.hide();
    }),
    map((user) => {
      if (user) {
        return true;
      }
      router.navigate(['/login']);
      return false;
    }),
    catchError(() => {
      loadingService.hide();
      router.navigate(['/login']);
      return of(false);
    })
  );
};
