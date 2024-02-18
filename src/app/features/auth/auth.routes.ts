import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./login/login.component').then((m) => m.LoginComponent),
      },
    ],
  },
];
