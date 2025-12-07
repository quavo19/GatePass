import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const userGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getCurrentUser();
  if (user && user.role === 'User') {
    return true;
  }

  if (user && user.role === 'Admin') {
    router.navigate(['/dashboard']);
    return false;
  }

  router.navigate(['/login']);
  return false;
};

