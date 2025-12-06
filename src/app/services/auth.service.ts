import { Injectable, inject } from '@angular/core';
import { Observable, tap, map, of, catchError } from 'rxjs';
import { ENDPOINTS } from '../constants/apis';
import {
  LoginRequest,
  LoginResponse,
  GetUserResponse,
  User,
} from '../interfaces/api.interface';
import {
  setToken,
  removeToken,
  getToken,
} from '../interceptors/auth.interceptor';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private currentUser: User | null = null;

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${environment.apiBaseUrl}${ENDPOINTS.AUTH.LOGIN}`,
        credentials,
        { observe: 'response' }
      )
      .pipe(
        tap((response) => {
          if (response.body && response.body.status.code === 200) {
            this.currentUser = response.body.data;
            const authHeader = response.headers.get('Authorization');
            if (authHeader) {
              setToken(authHeader);
            }
          }
        }),
        map((response) => {
          if (!response.body) {
            throw new Error('No response body');
          }
          return response.body;
        })
      );
  }

  logout(): Observable<void> {
    return this.http
      .delete<void>(`${environment.apiBaseUrl}${ENDPOINTS.AUTH.LOGOUT}`)
      .pipe(
        tap(() => {
          this.currentUser = null;
          removeToken();
        }),
        map(() => void 0),
        catchError(() => {
          this.currentUser = null;
          removeToken();
          return of(void 0);
        })
      );
  }

  getCurrentUserFromApi(): Observable<GetUserResponse> {
    return this.http
      .get<GetUserResponse>(`${environment.apiBaseUrl}${ENDPOINTS.AUTH.ME}`)
      .pipe(
        tap((response) => {
          if (response.status.code === 200) {
            this.currentUser = response.data;
          }
        })
      );
  }

  initializeUser(): Observable<User | null> {
    const token = getToken();
    if (!token) {
      return of(null);
    }

    return this.getCurrentUserFromApi().pipe(
      map((response) => response.data),
      tap((user) => {
        this.currentUser = user;
      })
    );
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}
