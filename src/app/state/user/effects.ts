import { inject, Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';

import * as UserActions from './actions';
import { UserService } from '../../core/services/requests/user.service';
import { IUserWithoutPass } from '../../core/interfaces/user.interface';
import { IResponse } from '../../core/interfaces/response.interface';

@Injectable()
export class UserEffects {
  private _actions$ = inject(Actions);
  private _userService = inject(UserService);

  getUser$ = createEffect(() =>
    this._actions$.pipe(
      ofType(UserActions.getUser),
      mergeMap(() => {
        return this._userService.getUserInfo().pipe(
          map((response: IResponse<IUserWithoutPass>) =>
            UserActions.getUserSuccess({ user: response.data! })
          ),
          catchError((error) =>
            of(UserActions.getUserFailure({ error: error.message }))
          )
        );
      })
    )
  );
}
