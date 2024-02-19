import { inject, Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, first, map, mergeMap, of } from 'rxjs';

import * as UserActions from './actions';
import { UserService } from '../../core/services/requests/user.service';
import { IUserWithoutPass } from '../../core/interfaces/user.interface';
import { IResponse } from '../../core/interfaces/response.interface';
import { AuthService } from '../../core/services/requests/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class UserEffects {
  private _actions$ = inject(Actions);
  private _userService = inject(UserService);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _snackBar = inject(MatSnackBar);

  getUser$ = createEffect(() =>
    this._actions$.pipe(
      ofType(UserActions.getUser),
      mergeMap(() => {
        return this._userService.getUserInfo().pipe(
          map((response: IResponse<IUserWithoutPass>) => {
            if (!response.data) {
              this._authService
                .logout()
                .pipe(first())
                .subscribe(() => {
                  void this._router.navigate(['/auth/login']).then(() => {
                    this._snackBar.open(
                      'Токены устарели или не валидны, войдите заново',
                      'ОК',
                      {
                        duration: 3000,
                      }
                    );
                  });
                });

              return UserActions.getUserFailure({ error: 'Invalid tokens' });
            }

            return UserActions.getUserSuccess({ user: response.data! });
          }),
          catchError((error) =>
            of(UserActions.getUserFailure({ error: error.message }))
          )
        );
      })
    )
  );
}
