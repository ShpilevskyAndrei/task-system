import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../services/requests/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export function AuthGuard(): Observable<boolean> {
  const _authService = inject(AuthService);
  const _router = inject(Router);
  const _snackBar = inject(MatSnackBar);

  return _authService.getIsAuthorized().pipe(
    map((isAuthorized: boolean): boolean => {
      if (!isAuthorized) {
        _snackBar.open(
          'Для входа в личный кабинет необходимо авторизоваться',
          'ОК',
          {
            duration: 3000,
          }
        );

        void _router.navigate(['/login']);

        return false;
      }

      return true;
    })
  );
}
