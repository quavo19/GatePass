import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CheckInComponent } from './pages/check-in/check-in.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/check-in',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'check-in',
    component: CheckInComponent,
    canActivate: [authGuard],
  },
  {
    path: 'check-out',
    loadComponent: () =>
      import('./pages/check-out/check-out.component').then(
        (m) => m.CheckOutComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'visitors',
    loadComponent: () =>
      import('./pages/visitors/visitors.component').then(
        (m) => m.VisitorsComponent
      ),
    canActivate: [authGuard, adminGuard],
  },
];
