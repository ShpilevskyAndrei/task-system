import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard.component').then((m) => m.DashboardComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'tasks',
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./pages/tasks/tasks.component').then((m) => m.TasksComponent),
      },
      {
        path: 'home',
        loadComponent: () =>
          import('../../shared/pages/soon/soon.component').then(
            (m) => m.SoonComponent
          ),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('../../shared/pages/soon/soon.component').then(
            (m) => m.SoonComponent
          ),
      },
      {
        path: 'team',
        loadComponent: () =>
          import('../../shared/pages/soon/soon.component').then(
            (m) => m.SoonComponent
          ),
      },
      {
        path: 'activity',
        loadComponent: () =>
          import('../../shared/pages/soon/soon.component').then(
            (m) => m.SoonComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../../shared/pages/soon/soon.component').then(
            (m) => m.SoonComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('../../shared/pages/soon/soon.component').then(
            (m) => m.SoonComponent
          ),
      },
    ],
  },
];
