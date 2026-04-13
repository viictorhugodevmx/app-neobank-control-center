import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./layout/auth-shell/auth-shell.component').then(
        (m) => m.AuthShellComponent
      ),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/pages/login-page/login-page.component').then(
            (m) => m.LoginPageComponent
          ),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/main-shell/main-shell.component').then(
        (m) => m.MainShellComponent
      ),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard-page.component').then(
            (m) => m.DashboardPageComponent
          ),
      },
      {
        path: 'customers',
        loadComponent: () =>
          import(
            './features/customers/pages/customers-list-page/customers-list-page.component'
          ).then((m) => m.CustomersListPageComponent),
      },
      {
        path: 'customers/:id',
        loadComponent: () =>
          import(
            './features/customers/pages/customer-detail-page/customer-detail-page.component'
          ).then((m) => m.CustomerDetailPageComponent),
      },
      {
        path: 'accounts',
        loadComponent: () =>
          import(
            './features/accounts/pages/accounts-list-page/accounts-list-page.component'
          ).then((m) => m.AccountsListPageComponent),
      },
      {
        path: 'cards',
        loadComponent: () =>
          import(
            './features/cards/pages/cards-list-page/cards-list-page.component'
          ).then((m) => m.CardsListPageComponent),
      },
      {
        path: 'transfers',
        loadComponent: () =>
          import(
            './features/transfers/pages/transfers-list-page/transfers-list-page.component'
          ).then((m) => m.TransfersListPageComponent),
      },
      {
        path: 'incidents',
        loadComponent: () =>
          import(
            './features/incidents/pages/incidents-list-page/incidents-list-page.component'
          ).then((m) => m.IncidentsListPageComponent),
      },
    ],
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
