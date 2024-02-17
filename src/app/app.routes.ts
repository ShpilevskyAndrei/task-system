import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canMatch: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'tasks',
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./pages/dashboard/pages/tasks/tasks.component').then(
            (m) => m.TasksComponent
          ),
      },
      {
        path: 'home',
        loadComponent: () =>
          import('../app/shared/pages/soon/soon.component').then(
            (m) => m.SoonComponent
          ),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('../app/shared/pages/soon/soon.component').then(
            (m) => m.SoonComponent
          ),
      },
      {
        path: 'team',
        loadComponent: () =>
          import('../app/shared/pages/soon/soon.component').then(
            (m) => m.SoonComponent
          ),
      },
      {
        path: 'activity',
        loadComponent: () =>
          import('../app/shared/pages/soon/soon.component').then(
            (m) => m.SoonComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../app/shared/pages/soon/soon.component').then(
            (m) => m.SoonComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('../app/shared/pages/soon/soon.component').then(
            (m) => m.SoonComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
