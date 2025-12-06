import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

const TOKEN_KEY = 'auth_token';

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

export function setToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function removeToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = getToken();

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: token,
      },
    });
    return next(clonedReq);
  }

  return next(req);
};
